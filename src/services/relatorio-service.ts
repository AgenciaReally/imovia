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
        <img src="https://imovia.ai/wp-content/uploads/2024/04/logo-imovia-branco.png" alt="Imovia Logo">
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
          <h2>Suas Preferências</h2>
          
          <p class="data-label">Tipo de Imóvel</p>
          <p class="data-value">${dados.tipoImovel || 'Não especificado'}</p>
          
          <p class="data-label">Características Desejadas</p>
          <ul>
            ${formatarLista(dados.caracteristicas)}
          </ul>
          
          <p class="data-label">Bairros de Interesse</p>
          <ul>
            ${formatarLista(dados.bairrosInteresse)}
          </ul>
          
          <p class="data-label">Proximidades Importantes</p>
          <ul>
            ${formatarLista(dados.proximidades)}
          </ul>
        </div>
        
        <div class="section">
          <h2>Respostas Detalhadas</h2>
          <p>Abaixo estão todas as suas respostas e pontuações coletadas durante o processo.</p>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px;">
            ${Object.entries(dados).
              filter(([key, value]) => 
                // Filtrar campos relevantes
                !key.startsWith('_') && 
                key !== 'userId' && 
                key !== 'imoveisRecomendados' &&
                key !== 'dataEnvio' &&
                value !== undefined &&
                value !== null
              ).
              map(([key, value]) => {
                // Formatar a chave para exibição
                const formatKey = (key: string): string => {
                  return key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str: string) => str.toUpperCase())
                    .replace(/(\w)([A-Z])/g, '$1 $2');
                };
                
                // Formatar o valor para exibição
                const formatValue = (value: any): string => {
                  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
                  if (typeof value === 'number') {
                    // Se parece com dinheiro
                    if (key.includes('valor') || key.includes('preco') || key.includes('renda')) {
                      try {
                        return new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(value);
                      } catch (e) {
                        return `R$ ${value}`;
                      }
                    }
                    // Se parece com porcentagem
                    if (key.includes('percentagem') || key.includes('score') || key.includes('pontuacao')) {
                      return `${value}%`;
                    }
                    return value.toString();
                  }
                  if (Array.isArray(value)) return value.join(', ');
                  return String(value);
                };
                
                const isPontuacao = key.includes('score') || key.includes('pontuacao') || 
                                   (typeof value === 'number' && value >= 0 && value <= 100);
                
                return `
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px;">
                  <p style="color: #666; font-size: 14px; margin-bottom: 5px;">${formatKey(key)}</p>
                  <p style="font-weight: 600; font-size: 16px; margin: 0; ${isPontuacao ? 'color: #ff6b35;' : 'color: #333;'}">
                    ${formatValue(value)}
                    ${isPontuacao ? `<span style="display: inline-block; width: 80px; height: 6px; margin-left: 10px; vertical-align: middle; background-color: #eee; border-radius: 3px; overflow: hidden;">` +
                      `<span style="display: block; width: ${value}%; height: 100%; background: linear-gradient(to right, #fb923c, #ea580c);"></span>` +
                    `</span>` : ''}
                  </p>
                </div>
                `;
              }).
              join('')
            }
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
