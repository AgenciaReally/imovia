import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  try {
    console.log('Iniciando teste de envio de email...');
    
    const destinatario = 'suporte@vyzer.com.br';
    
    // Template de email simples para teste
    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://zwrvzwymppmrvtkl.public.blob.vercel-storage.com/logo-branca.png" alt="Imovia Logo" style="max-width: 150px; height: auto;">
        </div>
        <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Teste de Email</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">Este é um email de teste para verificar a configuração do sistema de email.</p>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">Data e hora do teste: ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    `;
    
    // Enviar email
    const info = await transporter.sendMail({
      from: `"Imovia" <relatorios@imovia.ai>`,
      to: destinatario,
      subject: "Teste de Email - Imovia",
      html: htmlEmail,
    });
    
    console.log('Email enviado com sucesso:', info.messageId);
    
    return NextResponse.json({
      success: true,
      message: `Email de teste enviado com sucesso para ${destinatario}`,
      messageId: info.messageId
    });
    
  } catch (error: any) {
    console.error('Erro ao enviar email de teste:', error);
    
    return NextResponse.json({
      success: false,
      message: `Falha ao enviar email: ${error.message || 'Erro desconhecido'}`,
      error: JSON.stringify(error)
    }, { status: 500 });
  }
}
