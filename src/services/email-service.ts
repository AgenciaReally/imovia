// Email Service para o Imovia
// Implementado usando nodemailer

// Importar apenas no lado do servidor
let nodemailer: any = null;
if (typeof window === 'undefined') {
  // Estamos no servidor
  nodemailer = require('nodemailer');
}

interface EmailConfig {
  para: string;
  assunto: string;
  texto?: string;
  html?: string;
  dados?: RespostaRelatorioData;
}

// Interface para dados do relatório
export interface RespostaRelatorioData {
  nome?: string;
  email: string;
  telefone?: string;
  rendaMensal?: number;
  valorMaximoImovel?: number;
  preferencias?: string[];
  bairrosInteresse?: string[];
  tipoImovel?: string;
  caracteristicas?: string[];
  proximidades?: string[];
  dataEnvio?: string;
  imoveisRecomendados?: any[];
  mediaPontuacao?: number;
}

// Obter configurações de email do ambiente (ou usar valores padrão)
const EMAIL_HOST = process.env.EMAIL_HOST || 'mail.imovia.ai';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '465', 10);
const EMAIL_USER = process.env.EMAIL_USER || 'relatorios@imovia.ai';
const EMAIL_PASS = process.env.EMAIL_PASS || 'Lala147??';
const EMAIL_SECURE = process.env.EMAIL_SERVER_SECURE !== 'false';

console.log('Configurando email com:', {
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  user: EMAIL_USER,
  secure: EMAIL_SECURE
});

// Opções de transportadores SMTP
const transportadores = {
  // Configuração principal (baseada em variáveis de ambiente)
  principal: {
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false // Aceitar certificados auto-assinados
    },
    logger: true,
    debug: true
  },
  
  // Mailtrap para testes seguros (não envia emails reais)
  mailtrap: {
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    secure: false,
    auth: {
      user: 'e2c41b09fd28c4',
      pass: '22f3b3fd0c36ef',
    }
  },
  
  // Configuração do Gmail como fallback
  gmail: {
    service: 'gmail',
    auth: {
      user: 'agencia.really@gmail.com',
      pass: 'lwxwapjguolkecgq' // Nova senha de app gerada para o Gmail
    },
    tls: {
      rejectUnauthorized: false
    }
  }
};

// Escolher configuração dependendo do ambiente
const configAtiva = process.env.NODE_ENV === 'production' 
  ? transportadores.principal 
  : transportadores.principal; // Usar principal também em dev

// Criar transportador
// Criar transportador apenas no servidor
const transportador = typeof window === 'undefined' && nodemailer ? nodemailer.createTransport(configAtiva) : null;

export async function enviarEmail({ para, assunto, texto, html, dados }: EmailConfig): Promise<boolean> {
  // Este código agora só é executado no lado do servidor via API
  if (!nodemailer) {
    console.error("Nodemailer não está disponível (provavelmente executando no navegador).");
    return false;
  }

  try {
    // Verificar se transportador está disponível
    if (!transportador) {
      console.error("Transportador de email não disponível.");
      return false;
    }
    
    // Logar informações do email para debug
    console.log('=== ENVIANDO EMAIL REAL ===');
    console.log(`Para: ${para}`);
    console.log(`Assunto: ${assunto}`);
    console.log(`Conteúdo Texto: ${texto ? 'Sim (tamanho: ' + texto.length + ' chars)' : 'Não fornecido'}`);
    console.log(`Conteúdo HTML: ${html ? 'Sim (tamanho: ' + html.length + ' chars)' : 'Não fornecido'}`);

    // Configuração do email
    const mailOptions = {
      from: `"iMovia" <${configAtiva.auth.user}>`,
      to: para,
      subject: assunto,
      text: texto,
      html: html,
    };
    
    // Envio do email
    const info = await transportador.sendMail(mailOptions);
    console.log('Email enviado para', para, '- ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}
