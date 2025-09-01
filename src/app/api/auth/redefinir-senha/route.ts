import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

// Schema de validação para redefinição de senha
const redefinirSenhaSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  codigo: z.string().length(6, { message: "Código deve ter 6 caracteres" }),
  novaSenha: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
  confirmarSenha: z.string(),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

export async function POST(request: NextRequest) {
  try {
    // Extrair dados da requisição
    const body = await request.json();
    
    // Validar os dados recebidos
    const validationResult = redefinirSenhaSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false,
          message: "Dados inválidos", 
          errors: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    const { email, codigo, novaSenha } = validationResult.data;

    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email não encontrado" },
        { status: 404 }
      );
    }

    // Buscar código de recuperação
    const resetConfig = await prisma.configuracao.findUnique({
      where: { chave: `reset_${user.id}` },
    });

    if (!resetConfig) {
      return NextResponse.json(
        { success: false, message: "Nenhuma solicitação de recuperação encontrada" },
        { status: 400 }
      );
    }

    // Verificar código e expiração
    try {
      const resetData = JSON.parse(resetConfig.valor);
      const expiracao = new Date(resetData.expiracao);
      const agora = new Date();

      if (agora > expiracao) {
        return NextResponse.json(
          { success: false, message: "Código de recuperação expirado" },
          { status: 400 }
        );
      }

      if (resetData.code !== codigo) {
        return NextResponse.json(
          { success: false, message: "Código de recuperação inválido" },
          { status: 400 }
        );
      }

      // Código válido, atualizar senha
      const hashedPassword = await hashPassword(novaSenha);
      
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      // Remover código de recuperação
      await prisma.configuracao.delete({
        where: { chave: `reset_${user.id}` },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Erro ao processar dados de recuperação:', error);
      return NextResponse.json(
        { success: false, message: "Erro ao processar solicitação de recuperação" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erro no endpoint de redefinição de senha:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
