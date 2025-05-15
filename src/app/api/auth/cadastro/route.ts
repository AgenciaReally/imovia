import { NextRequest, NextResponse } from 'next/server';
import { registerConstrutora } from '@/lib/auth';
import { z } from 'zod';

// Schema de validação para o cadastro de construtora
const cadastroSchema = z.object({
  nomeRepresentante: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  razaoSocial: z.string().min(3, { message: "Razão social é obrigatória" }),
  cnpj: z
    .string()
    .refine((val) => {
      // Remove caracteres não numéricos para validação
      const numbers = val.replace(/\D/g, '');
      return numbers.length === 14;
    }, {
      message: "CNPJ inválido",
    }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 números" }),
  senha: z
    .string()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

export async function POST(request: NextRequest) {
  try {
    // Extrair dados da requisição
    const body = await request.json();
    
    // Validar os dados recebidos
    const validationResult = cadastroSchema.safeParse(body);
    
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

    // Normalizar CNPJ e telefone para armazenar apenas números
    const formData = validationResult.data;
    const normalizedData = {
      ...formData,
      cnpj: formData.cnpj.replace(/\D/g, ''),
      telefone: formData.telefone.replace(/\D/g, ''),
    };
    
    // Registrar a construtora
    const result = await registerConstrutora(normalizedData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // Retornar os dados do usuário criado
    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    console.error('Erro no endpoint de cadastro:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
