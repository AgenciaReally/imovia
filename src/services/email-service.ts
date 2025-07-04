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

// Opções de transportadores SMTP
const transportadores = {
  // Configuração da Imovia
  imovia: {
    host: 'mail.imovia.ai',
    port: 465,
    secure: true, // porta 465 usa SSL
    auth: {
      user: 'relatorios@imovia.ai',
      // NOTA: Parece que esta senha está expirada ou incorreta. Por favor, atualize com a senha correta.
      // Erro encontrado: Invalid login: 535 5.7.0 Invalid credentials
      pass: 'Lala147??', // Senha precisa ser atualizada
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
  }
};

// Escolher mailtrap para ambiente de desenvolvimento
const configAtiva = process.env.NODE_ENV === 'production' 
  ? transportadores.imovia 
  : transportadores.mailtrap;

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
