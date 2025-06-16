import { NextRequest, NextResponse } from 'next/server';
import { registerCliente } from '@/lib/auth-cliente';
import { z } from 'zod';

// Schema de validação para o cadastro de cliente

// Schema de validação para o cadastro de cliente
const cadastroSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z.string().optional(),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  role: z.enum(['CLIENTE']).default('CLIENTE')
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

    const { name, email, telefone, password } = validationResult.data;
    
    // Registrar o cliente usando a função do auth-cliente
    const result = await registerCliente({
      name,
      email,
      telefone,
      password
    });
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
    
    console.log(`Novo cliente cadastrado: ${name} (${email})`);
    
    // Garantir que temos um usuário válido
    if (!result.user) {
      return NextResponse.json(
        { success: false, message: "Erro ao processar dados do usuário" },
        { status: 500 }
      );
    }
    
    // Gerar token simples para autenticação imediata
    const token = Buffer.from(result.user.id + Date.now().toString())
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    // Retornar os dados do usuário criado
    return NextResponse.json({
      success: true,
      message: 'Usuário criado com sucesso',
      user: result.user,
      token
    });
  } catch (error) {
    console.error('Erro no endpoint de cadastro de cliente:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
