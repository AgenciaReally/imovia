import { NextResponse } from 'next/server';
// Importar apenas no lado do servidor
let nodemailer: any = null;
if (typeof window === 'undefined') {
  nodemailer = require('nodemailer');
}
import { enviarRelatorio } from '@/services/relatorio-service';

// Função para criar transportador SMTP baseado em configuração
function criarTransportador(config: {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}) {
  // Verificar se estamos no servidor
  if (typeof window !== 'undefined' || !nodemailer) {
    console.error("Esta função só pode ser executada no servidor");
    return null;
  }
  
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    // Aumentar timeout
    connectionTimeout: 10000, // 10 segundos
    socketTimeout: 30000, // 30 segundos
    // Para debug
    logger: true,
    debug: true,
  });
}

// Configuração das opções de email
const configuracoes = {
  imovia: {
    host: 'mail.imovia.ai',
    port: 465,
    secure: true,
    user: 'relatorios@imovia.ai',
    pass: 'Lala147??',
  },
  gmail: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: 'testeimovia@gmail.com', // substitua por uma conta real se tiver uma para teste
    pass: 'senha_aqui', // substitua pela senha aplicativo real se tiver uma
  },
  mailtrap: {
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    secure: false,
    user: 'e2c41b09fd28c4',  // conta gratuita de teste
    pass: '22f3b3fd0c36ef',  // senha de teste
  }
};

// Criar transportador padrão apenas no servidor
const transportador = typeof window === 'undefined' ? criarTransportador(configuracoes.imovia) : null;

// Função para verificar a conexão SMTP
async function verificarConexao(provider?: string) {
  try {
    const trans = provider && configuracoes[provider as keyof typeof configuracoes]
      ? criarTransportador(configuracoes[provider as keyof typeof configuracoes])
      : transportador;
    
    console.log(`Verificando conexão com provedor: ${provider || 'imovia'}`);
    const verificacao = await trans.verify();
    return { 
      sucesso: true, 
      mensagem: 'Conexão SMTP verificada com sucesso', 
      provedor: provider || 'imovia',
      detalhes: verificacao 
    };
  } catch (error) {
    console.error(`Erro ao verificar conexão SMTP com ${provider || 'imovia'}:`, error);
    return { 
      sucesso: false, 
      mensagem: 'Falha ao verificar conexão SMTP', 
      provedor: provider || 'imovia',
      erro: String(error),
      stack: (error as Error).stack
    };
  }
}

// Função para enviar email de teste diretamente
async function enviarEmailTeste(destinatario: string, provider?: string) {
  try {
    // Usar o transportador para o provedor selecionado ou o padrão
    const trans = provider && configuracoes[provider as keyof typeof configuracoes]
      ? criarTransportador(configuracoes[provider as keyof typeof configuracoes])
      : transportador;
    
    const config = provider && configuracoes[provider as keyof typeof configuracoes]
      ? configuracoes[provider as keyof typeof configuracoes]
      : configuracoes.imovia;
    
    console.log(`Tentando enviar email via ${provider || 'imovia'} para ${destinatario}`);
    
    const info = await trans.sendMail({
      from: `"Imovia Teste" <${config.user}>`,
      to: destinatario,
      subject: "Teste de Email - Imovia [" + new Date().toLocaleTimeString() + "]",
      text: "Este é um email de teste enviado diretamente pelo Nodemailer para verificar a configuração SMTP.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #ff6b35;">Teste de Email - Imovia</h2>
          <p>Este é um email de teste enviado diretamente via ${provider || 'imovia'}.</p>
          <p>Se você está recebendo este email, a configuração SMTP está funcionando corretamente!</p>
          <p>Data/hora do envio: ${new Date().toLocaleString('pt-BR')}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; font-size: 12px;">Este é apenas um teste, por favor ignore este email.</p>
        </div>
      `
    });

    return { 
      sucesso: true, 
      mensagem: 'Email de teste enviado com sucesso', 
      detalhes: { 
        messageId: info.messageId,
        destinatario,
        timestamp: new Date().toISOString()
      } 
    };
  } catch (error) {
    console.error('Erro ao enviar email de teste:', error);
    return { 
      sucesso: false, 
      mensagem: 'Falha ao enviar email de teste', 
      erro: String(error),
      detalhes: { stack: (error as Error).stack }
    };
  }
}

// Função para testar o serviço de relatório
async function testarServicoRelatorio(destinatario: string) {
  try {
    const dadosTeste = {
      nome: 'Usuário de Teste',
      email: destinatario,
      telefone: '(11) 99999-9999',
      rendaMensal: 10000,
      valorMaximoImovel: 500000,
      tipoImovel: 'Apartamento',
      caracteristicas: ['3 quartos', 'Varanda', 'Piscina'],
      bairrosInteresse: ['Vila Mariana', 'Moema'],
      proximidades: ['Metrô', 'Shopping'],
      dataEnvio: new Date().toLocaleDateString('pt-BR')
    };

    const resultado = await enviarRelatorio(dadosTeste);
    return { 
      sucesso: resultado, 
      mensagem: resultado ? 'Relatório enviado com sucesso' : 'Falha ao enviar relatório',
      dadosRelatorio: dadosTeste
    };
  } catch (error) {
    console.error('Erro ao testar serviço de relatório:', error);
    return { 
      sucesso: false, 
      mensagem: 'Erro ao testar serviço de relatório', 
      erro: String(error) 
    };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const modo = searchParams.get('modo') || 'todos';
    const provider = searchParams.get('provider');

    if (!email) {
      return NextResponse.json({ 
        erro: 'Parâmetro email é obrigatório', 
        exemplo: '/api/test-email?email=seu@email.com&modo=todos|verificar|direto|relatorio&provider=imovia|gmail|mailtrap' 
      }, { status: 400 });
    }

    const resultados: Record<string, any> = {};
    
    // Informações do sistema
    resultados.sistema = {
      nodeVersion: process.version,
      platform: process.platform,
      nodeEnv: process.env.NODE_ENV,
      memory: process.memoryUsage(),
      providersDisponiveis: Object.keys(configuracoes),
      providerSelecionado: provider || 'imovia (padrão)'
    };

    // Verificar conexão SMTP
    if (modo === 'todos' || modo === 'verificar') {
      resultados.verificacaoConexao = await verificarConexao(provider as string);
    }

    // Enviar email direto
    if (modo === 'todos' || modo === 'direto') {
      resultados.emailDireto = await enviarEmailTeste(email, provider as string);
    }

    // Testar serviço de relatório
    if (modo === 'todos' || modo === 'relatorio') {
      resultados.servicoRelatorio = await testarServicoRelatorio(email);
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      emailDestino: email,
      modo,
      resultados
    });
  } catch (error) {
    console.error('Erro no teste de email:', error);
    return NextResponse.json({ 
      erro: 'Erro interno no teste de email', 
      detalhes: String(error) 
    }, { status: 500 });
  }
}
