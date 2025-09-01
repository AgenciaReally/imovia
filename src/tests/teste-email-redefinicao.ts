// Teste para envio de email de redefinição de senha
import { enviarEmail } from '../services/email-service';
import * as nodemailer from 'nodemailer';

// Configurar transportador direto para o servidor da Imovia
const transportadorImovia = nodemailer.createTransport({
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

// Substituir a função de envio de email para usar nosso transportador diretamente
const enviarEmailImovia = async (config: any) => {
  try {
    console.log('=== ENVIANDO EMAIL VIA IMOVIA ===');
    console.log(`Para: ${config.para}`);
    console.log(`Assunto: ${config.assunto}`);
    
    const mailOptions = {
      from: '"Imovia" <relatorios@imovia.ai>',
      to: config.para,
      subject: config.assunto,
      text: config.texto,
      html: config.html,
    };
    
    const info = await transportadorImovia.sendMail(mailOptions);
    console.log('Email enviado para', config.para, '- ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
};

/**
 * Gera um código de redefinição de senha aleatório
 * @returns string - Código de 6 caracteres hexadecimais
 */
function gerarCodigoRedefinicao(): string {
  return Math.floor(Math.random() * 16777215)
    .toString(16)
    .toUpperCase()
    .padStart(6, '0');
}

/**
 * Gera o HTML para o email de redefinição de senha
 * @param nome Nome do usuário
 * @param codigo Código de redefinição
 * @returns string - HTML formatado
 */
function gerarHTMLRedefinicaoSenha(nome: string, codigo: string): string {
  // URL base do site
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.imovia.ai';
  
  // URL para redefinição de senha com o código
  const redefinirUrl = `${baseUrl}/auth/redefinir-senha?codigo=${codigo}&email=suporte@vyzer.com.br`;
  
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinição de Senha - Imovia</title>
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
      
      .code-container {
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 6px;
        text-align: center;
        margin: 30px 0;
      }
      
      .code {
        font-family: monospace;
        font-size: 32px;
        letter-spacing: 5px;
        color: #ff6b35;
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
        <h1>Redefinição de Senha</h1>
      </div>
      
      <div class="content">
        <div class="greeting">
          <p>Olá, <strong>${nome}</strong>!</p>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta. Para continuar com o processo de redefinição, utilize o código abaixo ou clique no botão.</p>
        </div>
        
        <div class="code-container">
          <p>Seu código de redefinição é:</p>
          <div class="code">${codigo}</div>
          <p>Este código expira em 1 hora.</p>
        </div>
        
        <div class="button-container">
          <a href="${redefinirUrl}" class="cta-button">Redefinir Minha Senha</a>
        </div>
        
        <p>Se você não solicitou a redefinição de senha, por favor ignore este email ou entre em contato com nosso suporte.</p>
        
        <p class="note">Por razões de segurança, este link de redefinição expirará em 1 hora. Se você precisar de um novo link, visite nossa página de login e clique em "Esqueci minha senha".</p>
      </div>
      
      <div class="footer">
        <p>© 2025 Imovia - Todos os direitos reservados</p>
        <p>Este é um email automático, por favor não responda.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Função principal para testar o envio de email de redefinição de senha
 */
export async function testarEnvioEmailRedefinicao() {
  // Gerar código de redefinição
  const codigoRedefinicao = gerarCodigoRedefinicao();
  
  // Dados do destinatário
  const emailDestinatario = 'suporte@vyzer.com.br';
  const nomeDestinatario = 'Suporte Vyzer';
  
  console.log(`Enviando email de teste para ${emailDestinatario}`);
  console.log(`Código de redefinição gerado: ${codigoRedefinicao}`);
  
  // Gerar HTML do email
  const htmlEmail = gerarHTMLRedefinicaoSenha(nomeDestinatario, codigoRedefinicao);
  
  // Configuração do email
  const emailConfig = {
    para: emailDestinatario,
    assunto: 'Redefinição de Senha - Imovia',
    texto: `Olá ${nomeDestinatario}, seu código de redefinição de senha é: ${codigoRedefinicao}. Este código expira em 1 hora.`,
    html: htmlEmail
  };
  
  try {
    // Enviar o email usando o transportador direto da Imovia
    const resultado = await enviarEmailImovia(emailConfig);
    
    if (resultado) {
      console.log('✅ Email de redefinição enviado com sucesso!');
    } else {
      console.error('❌ Falha ao enviar o email de redefinição');
    }
  } catch (erro) {
    console.error('❌ Erro ao enviar email:', erro);
  }
}

// Executar o teste
testarEnvioEmailRedefinicao()
  .then(() => console.log('Teste concluído'))
  .catch(erro => console.error('Erro no teste:', erro));
