"use server";

// Importar apenas no lado do servidor
let nodemailer: any = null;
if (typeof window === 'undefined') {
  // Estamos no servidor
  nodemailer = require('nodemailer');
}

interface EmailBoasVindasParams {
  nome: string;
  email: string;
  senha: string;
}

// Configuração direta do transportador SMTP (mesmo usado no relatório que funciona)
const getTransportador = () => {
  if (typeof window !== 'undefined' || !nodemailer) {
    console.error("Nodemailer não está disponível");
    return null;
  }
  
  // Usar a mesma configuração que funciona no relatório
  return nodemailer.createTransport({
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
}

export async function enviarEmailBoasVindas({ nome, email, senha }: EmailBoasVindasParams): Promise<boolean> {
  try {
    const transportador = getTransportador();
    
    if (!transportador) {
      console.error('Transportador de email não disponível');
      return false;
    }
    
    // Template HTML do email
    const htmlEmail = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #f0f0f0;
        }
        .header img {
          max-width: 150px;
        }
        .content {
          padding: 30px 20px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #f0f0f0;
        }
        h1 {
          color: #ff6b35;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #ff6b35;
          color: white !important;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          margin: 20px 0;
        }
        .credentials {
          background-color: #f5f5f5;
          border-radius: 4px;
          padding: 15px;
          margin: 20px 0;
          border-left: 4px solid #ff6b35;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://app.imovia.ai/logo.png" alt="Imovia" />
        </div>
        <div class="content">
          <h1>Bem-vindo ao Imovia!</h1>
          
          <p>Olá, <strong>${nome}</strong>!</p>
          
          <p>Sua conta foi criada com sucesso na plataforma Imovia. Agora você pode acessar seu painel pessoal para acompanhar suas respostas e preferências sobre imóveis.</p>
          
          <div class="credentials">
            <p><strong>Suas informações de acesso:</strong></p>
            <p>Email: <strong>${email}</strong></p>
            <p>Senha: <strong>${senha}</strong></p>
          </div>
          
          <p>Para acessar seu painel, clique no botão abaixo:</p>
          
          <div style="text-align: center;">
            <a href="https://app.imovia.ai/login" class="button">Acessar meu painel</a>
          </div>
          
          <p>Caso tenha alguma dúvida ou precise de ajuda, entre em contato conosco.</p>
          
          <p>Atenciosamente,<br>Equipe Imovia</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Imovia. Todos os direitos reservados.</p>
          <p>Este é um email automático, por favor não responda.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Configuração do email usando a mesma abordagem do envio de relatório
    console.log(`Tentando enviar email de boas-vindas para ${email} usando configuração direta`);
    
    const mailOptions = {
      from: '"Imovia" <relatorios@imovia.ai>',
      to: email,
      subject: `Bem-vindo ao Imovia, ${nome}!`,
      html: htmlEmail,
    };

    // Enviar o email diretamente com o transportador
    await transportador.verify();
    const info = await transportador.sendMail(mailOptions);

    console.log(`Email de boas-vindas enviado com sucesso para ${email}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
    return false;
  }
}
