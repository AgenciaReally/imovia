import { NextRequest, NextResponse } from 'next/server';
import { registerCliente } from '@/lib/auth-cliente';
import { z } from 'zod';
import { enviarEmail } from '@/services/email-service';

// Schema de validação para o cadastro de cliente

/**
 * Gera o HTML para o email de boas-vindas
 * @param nome Nome do usuário
 * @param email Email do usuário
 * @param senha Senha original do usuário (não a hash)
 * @returns string - HTML formatado
 */
function gerarHTMLBoasVindas(nome: string, email: string, senha: string): string {
  // URL base do site
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.imovia.ai';
  
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo à Imovia</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      }
      
      .header {
        background-color: #ff6b35;
        padding: 30px 40px;
        color: white;
        text-align: center;
      }
      
      .header img {
        max-width: 180px;
        margin-bottom: 15px;
      }
      
      .header h1 {
        margin: 0;
        font-weight: 600;
        font-size: 24px;
      }
      
      .content {
        padding: 40px;
      }
      
      .greeting {
        margin-bottom: 25px;
        font-size: 18px;
      }
      
      .info-container {
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 6px;
        margin: 30px 0;
      }
      
      .info-title {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 10px;
      }
      
      .info-item {
        margin-bottom: 8px;
      }
      
      .info-label {
        font-weight: bold;
      }
      
      .button-container {
        text-align: center;
        margin: 30px 0;
      }
      
      .cta-button {
        display: inline-block;
        background-color: #ff6b35;
        color: white;
        text-decoration: none;
        padding: 14px 30px;
        border-radius: 4px;
        font-weight: 600;
        font-size: 16px;
      }
      
      .footer {
        background-color: #f0f0f0;
        padding: 20px 40px;
        text-align: center;
        font-size: 14px;
        color: #666;
      }
      
      .note {
        font-size: 13px;
        color: #777;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://imovia.ai/wp-content/uploads/2023/10/logo-imovia-branco.png" alt="Imovia Logo" style="max-width: 180px;">
        <h1>Bem-vindo à Imovia!</h1>
      </div>
      
      <div class="content">
        <div class="greeting">
          <p>Olá, <strong>${nome}</strong>!</p>
          <p>Estamos muito felizes em ter você conosco. Seu cadastro foi realizado com sucesso na plataforma Imovia, o lugar perfeito para encontrar seu imóvel ideal!</p>
        </div>
        
        <div class="info-container">
          <div class="info-title">Suas informações de acesso:</div>
          <div class="info-item"><span class="info-label">Email:</span> ${email}</div>
          <div class="info-item"><span class="info-label">Senha:</span> Use a senha que você cadastrou</div>
        </div>
        
        <p>Com a Imovia, você terá acesso a:</p>
        <ul>
          <li>Recomendações personalizadas de imóveis</li>
          <li>Ferramentas de simulação de financiamento</li>
          <li>Atendimento especializado</li>
          <li>Acompanhamento de todo o processo de compra</li>
        </ul>
        
        <div class="button-container">
          <a href="${baseUrl}/login" class="cta-button">Acessar Minha Conta</a>
        </div>
        
        <p>Se você tiver alguma dúvida ou precisar de assistência, nossa equipe está sempre disponível para ajudar.</p>
        
        <p class="note">Por motivos de segurança, recomendamos que você altere sua senha no primeiro acesso.</p>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Imovia - Todos os direitos reservados</p>
        <p>Este é um email automático, por favor não responda.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

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
    
    // Verifica se a senha foi hasheada corretamente
    if (result.user && !result.user.password?.startsWith('$argon2')) {
      console.warn('ALERTA: A senha pode não estar sendo hasheada corretamente com Argon2!');
    } else {
      console.log('Senha corretamente hasheada com Argon2');
    }
    
    // Enviar email de boas-vindas com as credenciais (SEM a senha por motivos de segurança)
    try {
      // Gerar o HTML do email - agora sem mostrar a senha por motivos de segurança
      const htmlBoasVindas = gerarHTMLBoasVindas(name, email, '******');
      
      // Configurar e enviar o email
      await enviarEmail({
        para: email,
        assunto: 'Bem-vindo à Imovia! Suas credenciais de acesso',
        texto: `Olá ${name}, seu cadastro foi realizado com sucesso na Imovia! Use seu email: ${email} para acessar sua conta. Por segurança, não enviamos sua senha por email.`,
        html: htmlBoasVindas
      });
      
      console.log(`Email de boas-vindas enviado para: ${email}`);
    } catch (emailError) {
      // Não interromper o fluxo se o email falhar
      console.error('Erro ao enviar email de boas-vindas:', emailError);
    }
    
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
