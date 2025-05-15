import { NextRequest, NextResponse } from 'next/server';
import { enviarEmail } from '@/services/email-service';
import { gerarHTMLRelatorio, RelatorioData } from '@/services/relatorio-service';

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
    
    console.log(`API: Processando envio de relatório para ${dados.email}`);
    
    // Gerar o HTML do relatório
    const html = gerarHTMLRelatorio(dados);
    const nome = dados.nome || 'Cliente';
    
    // Enviar o email
    const resultado = await enviarEmail({
      para: dados.email,
      assunto: `Seu Relatório Personalizado de Imóveis - Imovia`,
      html
    });
    
    if (resultado) {
      console.log(`API: Relatório enviado com sucesso para ${dados.email}`);
      return NextResponse.json({ 
        success: true, 
        message: 'Relatório enviado com sucesso'
      });
    } else {
      console.error(`API: Falha ao enviar relatório para ${dados.email}`);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Falha ao enviar o relatório'
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API: Erro ao processar envio de relatório:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro ao processar envio de relatório' 
      }, 
      { status: 500 }
    );
  }
}
