import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

// Configuração do transporte de email usando variáveis de ambiente
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_PORT,
    pass: process.env.EMAIL_PASS,
  },
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://imovia.ai/logo.webp" alt="Imovia Logo" style="max-width: 150px; height: auto;">
        </div>
        <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Recuperação de Senha</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">Olá ${user.name},</p>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">Recebemos uma solicitação para redefinir sua senha. Use o código abaixo para continuar o processo:</p>
        
        <div style="background-color: #f7f7f7; padding: 15px; text-align: center; margin: 25px 0; border-radius: 4px;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #ff6b00;">${resetCode}</span>
        </div>
        
        <p style="color: #555; font-size: 16px; line-height: 1.5;">Este código é válido por 1 hora. Se você não solicitou a recuperação de senha, ignore este email.</p>
        
        <p style="color: #555; font-size: 16px; line-height: 1.5; margin-top: 30px;">Atenciosamente,<br>Equipe Imovia</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
          <p>Este é um email automático. Por favor, não responda.</p>
        </div>
      </div>
    `;

    // Enviar email
    await transporter.sendMail({
      from: `"Imovia" <${process.env.EMAIL_PORT}>`,
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
