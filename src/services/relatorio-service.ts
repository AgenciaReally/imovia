// Serviço para geração e envio de relatórios por email
import { enviarEmail } from './email-service';

export interface RelatorioData {
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

// Função para gerar o HTML do email de relatório
export function gerarHTMLRelatorio(dados: RelatorioData): string {
  const formatarDinheiro = (valor?: number) => {
    if (!valor) return 'Não informado';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarLista = (lista?: string[]) => {
    if (!lista || lista.length === 0) return '<li>Não informado</li>';
    return lista.map(item => `<li>${item}</li>`).join('');
  };

  const dataFormatada = dados.dataEnvio || new Date().toLocaleDateString('pt-BR');
  const nomeCliente = dados.nome || 'Cliente';
  
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Imovia - ${nomeCliente}</title>
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
      
      .greeting {
        margin-bottom: 25px;
        font-size: 18px;
      }
      
      .section {
        margin-bottom: 30px;
        border-bottom: 1px solid #eee;
        padding-bottom: 20px;
      }
      
      .section:last-child {
        border-bottom: none;
      }
      
      .section h2 {
        color: #ff6b35;
        font-size: 20px;
        margin-top: 0;
        margin-bottom: 15px;
        font-weight: 600;
      }
      
      .data-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-bottom: 15px;
      }
      
      .data-item {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 6px;
      }
      
      .data-item p {
        margin: 0;
      }
      
      .data-label {
        color: #666;
        font-size: 14px;
        margin-bottom: 5px;
      }
      
      .data-value {
        font-weight: 600;
        font-size: 16px;
        color: #333;
      }
      
      .highlight {
        color: #ff6b35;
      }
      
      ul {
        margin: 0;
        padding-left: 20px;
      }
      
      li {
        margin-bottom: 6px;
      }
      
      .footer {
        background-color: #f0f0f0;
        padding: 20px 40px;
        text-align: center;
        font-size: 14px;
        color: #666;
      }
      
      .social-links {
        margin-top: 15px;
      }
      
      .social-links a {
        display: inline-block;
        margin: 0 8px;
        color: #ff6b35;
        text-decoration: none;
      }
      
      .cta-button {
        display: inline-block;
        background-color: #ff6b35;
        color: white;
        text-decoration: none;
        padding: 12px 25px;
        border-radius: 4px;
        font-weight: 600;
        margin-top: 15px;
        margin-bottom: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <!-- Imagem em base64 embutida diretamente no HTML -->
        <img src="data:image/png;base64,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"  style="max-width: 200px; height: auto;">
        <h1>Seu Relatório Personalizado</h1>
        <p>Encontramos imóveis que combinam com seu perfil</p>
      </div>
      
      <div class="content">
        <div class="greeting">
          <p>Olá, <strong>${nomeCliente}</strong>!</p>
          <p>Agradecemos por utilizar nossa plataforma para encontrar o imóvel ideal para você. Conforme solicitado, preparamos este relatório personalizado com base nas suas preferências.</p>
        </div>
        
        <div class="section">
          <h2>Seus Dados</h2>
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Email</p>
              <p class="data-value">${dados.email}</p>
            </div>
            <div class="data-item">
              <p class="data-label">Telefone</p>
              <p class="data-value">${dados.telefone || 'Não informado'}</p>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Informações Financeiras</h2>
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Renda Mensal</p>
              <p class="data-value">${formatarDinheiro(dados.rendaMensal)}</p>
            </div>
            <div class="data-item">
              <p class="data-label">Valor Máximo do Imóvel</p>
              <p class="data-value highlight">${formatarDinheiro(dados.valorMaximoImovel)}</p>
            </div>
          </div>
        </div>
        
    
        
        <div class="section">
          <h2>Próximos Passos</h2>
          <p>Baseado em suas preferências, nossa equipe já está trabalhando para selecionar os melhores imóveis que atendam suas necessidades.</p>
          <p>Um de nossos consultores entrará em contato em breve para apresentar as opções disponíveis e esclarecer quaisquer dúvidas.</p>
          <a href="https://app.imovia.ai/login/" class="cta-button">Ver Imóveis Disponíveis</a>
        </div>
      </div>
      
      <div class="footer">
        <p>© 2025 Imovia - Todos os direitos reservados</p>
        <p>Este email foi enviado para ${dados.email} em ${dataFormatada}</p>
        <div class="social-links">
          <a href="https://www.instagram.com/imovia.ai/">Instagram</a>
          <a href="https://imovia.ai">Website</a>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

// Função para enviar o relatório por email
export async function enviarRelatorio(dados: RelatorioData): Promise<boolean> {
  if (!dados.email) {
    console.error("Email não fornecido para envio do relatório");
    return false;
  }

  try {
    console.log(`Enviando relatório para ${dados.email}`);
    
    // Chamada para API em vez de geração direta do email
    const response = await fetch('/api/enviar-relatorio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar relatório: ${response.status}`);
    }

    const resultado = await response.json();
    
    if (resultado.success) {
      console.log(`Relatório enviado com sucesso para ${dados.email}`);
      return true;
    } else {
      console.error(`Falha ao enviar relatório para ${dados.email}`);
      return false;
    }
  } catch (error) {
    console.error('Erro ao enviar relatório:', error);
    return false;
  }
}
