import { NextRequest, NextResponse } from 'next/server';
import { gerarHTMLRelatorio, RelatorioData } from '@/services/relatorio-service';
import nodemailer from 'nodemailer';

// Configurar transportador diretamente na API
const transportador = nodemailer.createTransport({
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
    // Obter dados do corpo da requisição
    const dados: RelatorioData = await request.json();
    
    // Validar se dados essenciais estão presentes
    if (!dados.email) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email não fornecido para envio do relatório'
        }, 
        { status: 400 }
      );
    }
    
    // Log detalhado para depuração dos dados recebidos na API
    console.log(`API: Processando envio de relatório para ${dados.email}`);
    console.log('API: Dados recebidos:', JSON.stringify({
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      rendaMensal: dados.rendaMensal,
      valorMaximoImovel: dados.valorMaximoImovel,
      imoveisRecomendados: dados.imoveisRecomendados?.length || 0
    }));
    
    // Gerar o HTML do relatório
    const html = gerarHTMLRelatorio(dados);
    const nome = dados.nome || 'Cliente';
    
    // Enviar o email diretamente com nodemailer
    try {
      // Configuração do email
      const mailOptions = {
        from: `"iMovia" <relatorios@imovia.ai>`,
        to: dados.email,
        subject: `Seu Relatório Personalizado de Imóveis - Imovia`,
        html
      };
      
      // Envio do email
      const info = await transportador.sendMail(mailOptions);
      console.log(`API: Relatório enviado com sucesso para ${dados.email} - ID:`, info.messageId);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Relatório enviado com sucesso',
        messageId: info.messageId
      });
    } catch (emailError: any) {
      console.error(`API: Erro específico ao enviar email:`, emailError);
      return NextResponse.json(
        { 
          success: false, 
          message: `Falha ao enviar o relatório: ${emailError.message || 'Erro desconhecido'}`
        }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API: Erro ao processar envio de relatório:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: `Erro ao processar envio de relatório: ${error.message || 'Erro desconhecido'}`
      }, 
      { status: 500 }
    );
  }
}
