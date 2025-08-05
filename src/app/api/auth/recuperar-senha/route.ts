import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

// Configuração direta do transporte de email
const transporter = nodemailer.createTransport({
  host: 'mail.imovia.ai',
  port: 465,
  secure: true,
  auth: {
    user: 'relatorios@imovia.ai',
    pass: 'Lala147??',
  },
  logger: true,
  debug: true
});

export async function POST(request: NextRequest) {
  try {
    // Extrair dados da requisição
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Por segurança, não informamos se o email existe ou não
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Gerar código de recuperação (6 dígitos)
    const resetCode = randomBytes(3).toString('hex').toUpperCase();
    
    // Calcular expiração (1 hora)
    const expiracao = new Date();
    expiracao.setHours(expiracao.getHours() + 1);

    // Salvar o código de recuperação na tabela de configuração
    await prisma.configuracao.upsert({
      where: { 
        chave: `reset_${user.id}` 
      },
      update: { 
        valor: JSON.stringify({
          code: resetCode,
          expiracao: expiracao.toISOString()
        })
      },
      create: {
        chave: `reset_${user.id}`,
        valor: JSON.stringify({
          code: resetCode,
          expiracao: expiracao.toISOString()
        }),
        descricao: 'Código de recuperação de senha'
      }
    });

    // Criar o HTML do email
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperação de Senha - Imovia</title>
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
            max-width: 650px;
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
            font-size: 28px;
          }
          
          .header p {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 16px;
          }
          
          .content {
            padding: 40px;
          }
          
          .footer {
            margin-top: 30px;
            padding: 20px 40px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            color: #888;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://zwrvzwymppmrvtkl.public.blob.vercel-storage.com/logo-branca.png" alt="Imovia Logo">
            <h1>Recuperação de Senha</h1>
            <p>Seu código de verificação para redefinir sua senha</p>
          </div>
          
          <div class="content">
            <p style="font-size: 16px;">Olá, <strong>${user.name}</strong>,</p>
            <p style="font-size: 16px;">Recebemos uma solicitação para redefinir sua senha. Use o código abaixo para continuar o processo:</p>
            
            <div style="background-color: #f7f7f7; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ff6b00;">${resetCode}</span>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5;">Este código é válido por 1 hora. Se você não solicitou a recuperação de senha, ignore este email.</p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-top: 30px;">Atenciosamente,<br>Equipe Imovia</p>
          </div>
          
          <div class="footer">
            <p>Este é um email automático. Por favor, não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enviar email
    await transporter.sendMail({
      from: `"Imovia" <relatorios@imovia.ai>`,
      to: email,
      subject: "Recuperação de Senha - Imovia",
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no endpoint de recuperação de senha:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
