// Serviço para geração e envio de relatórios por email
import { enviarEmail } from './email-service';

export interface RelatorioData {
  nome?: string;
  email: string;
  telefone?: string;
  rendaMensal?: number;
  valorMaximoImovel?: number;
  valorParcelaMaxima?: number;
  temOutrosEmprestimos?: boolean;
  // Preferências de localização
  cidade?: string;
  localTrabalho?: string;
  localEscola?: string;
  
  // Preferências de empreendimento
  importanciaPisoQuartos?: number;
  importanciaAcademia?: number;
  importanciaPiscina?: number;
  tipoPortaria?: string;
  importanciaSalaoFestas?: number;
  importanciaPlayground?: number;
  importanciaEspacoPet?: number;
  
  // Preferências de proximidades
  importanciaParques?: number;
  importanciaShoppings?: number;
  importanciaRestaurantes?: number;
  importanciaCaminhabilidade?: number;
  temPet?: string;
  importanciaEscolas?: number;
  importanciaTransporte?: number;
  // Fluxo do simulador de crédito
  fluxoSimulador?: string; // COM_APROVACAO ou SEM_APROVACAO
  // Campos do fluxo COM_APROVACAO
  cpf?: string;
  estadoCivil?: string;
  comprovanteRenda?: string;
  comprovanteEndereco?: string;
  carteiraTrabalho?: string;
  irpf?: string;
  escolaridade?: string;
  outrosCompradores?: string;
  // Campos do fluxo SEM_APROVACAO
  rendaMensalFaixa?: string;
  outrosFinanciamentos?: string;
  dataNascimento?: string;
  fgts?: string;
  prazoFinanciamento?: string;
  tipoDeimovel?: string;
  // Campos padrão
  preferencias?: string[];
  bairrosInteresse?: string[];
  tipoImovel?: string;
  caracteristicas?: string[];
  proximidades?: string[];
  bairro?: string;
  imoveisRecomendados?: any[];
  mediaPontuacao?: number;
  dataEnvio?: string;
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
    <title>Relatório iMovia - ${nomeCliente}</title>
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
        <!-- Imagem hospedada no servidor -->
        <img src="https://zwrvzwymppmrvtkl.public.blob.vercel-storage.com/logo-branca.png" style="max-width: 200px; height: auto;">
        <h1>Seu Relatório Personalizado</h1>
        <p>Encontramos imóveis que combinam com seu perfil</p>
      </div>
      
      <div class="content">
        <div class="greeting">
          <p>Olá, <strong>${nomeCliente}</strong>!</p>
          <p>Agradecemos por utilizar nossa plataforma para encontrar o imóvel ideal para você. Conforme solicitado, preparamos este relatório personalizado com base nas suas preferências.</p>
        </div>
        
        <!-- Seção de dados pessoais removida conforme solicitado -->
        
        <div class="section">
          <h2>Informações Financeiras</h2>
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Renda Mensal Familiar</p>
              <p class="data-value" style="color: #ff6b35; font-weight: bold;">
                ${dados.rendaMensal ? formatarDinheiro(dados.rendaMensal) : 'Não informado'}
              </p>
            </div>
            <div class="data-item">
              <p class="data-label">Valor Máximo do Imóvel</p>
              <p class="data-value highlight">${formatarDinheiro(dados.valorMaximoImovel)}</p>
            </div>
          </div>
          
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Parcela Máxima</p>
              <p class="data-value" style="color: #ff6b35; font-weight: bold;">
                ${dados.valorParcelaMaxima ? formatarDinheiro(dados.valorParcelaMaxima) : 'Não informado'}
              </p>
              ${dados.rendaMensal && dados.valorParcelaMaxima ? `
              <p class="text-sm" style="margin-top: 5px; color: #666;">
                ${((dados.valorParcelaMaxima / dados.rendaMensal) * 100).toFixed(1)}% da renda mensal
              </p>` : ''}
            </div>
            <div class="data-item">
              <p class="data-label">Outros Empréstimos</p>
              <p class="data-value">
                ${dados.temOutrosEmprestimos === true ? 'Sim, possui outros financiamentos' : 
                 dados.temOutrosEmprestimos === false ? 'Não possui outros financiamentos' : 'Não informado'}
              </p>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Preferências de Localização</h2>
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Cidade</p>
              <p class="data-value">${dados.cidade || 'Não informado'}</p>
            </div>
            <div class="data-item">
              <p class="data-label">Bairros de Interesse</p>
              <p class="data-value">
                ${dados.bairrosInteresse && dados.bairrosInteresse.length > 0 ? 
                  dados.bairrosInteresse.join(', ') : 'Não informado'}
              </p>
            </div>
          </div>
          
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Local de Trabalho</p>
              <p class="data-value">${dados.localTrabalho || 'Não informado'}</p>
            </div>
            <div class="data-item">
              <p class="data-label">Proximidade a Escolas</p>
              <p class="data-value">${dados.localEscola || 'Não informado'}</p>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Preferências de Condomínio</h2>
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Pisos nos Quartos</p>
              <p class="data-value">
                ${typeof dados.importanciaPisoQuartos !== 'undefined' ? 
                  `${dados.importanciaPisoQuartos}% de importância` : 'Não informado'}
              </p>
            </div>
            <div class="data-item">
              <p class="data-label">Academia no Condomínio</p>
              <p class="data-value">
                ${typeof dados.importanciaAcademia !== 'undefined' ? 
                  `${dados.importanciaAcademia}% de importância` : 'Não informado'}
              </p>
            </div>
          </div>
          
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Piscina</p>
              <p class="data-value">
                ${typeof dados.importanciaPiscina !== 'undefined' ? 
                  `${dados.importanciaPiscina}% de importância` : 'Não informado'}
              </p>
            </div>
            <div class="data-item">
              <p class="data-label">Tipo de Portaria</p>
              <p class="data-value">
                ${dados.tipoPortaria === 'presencial' ? 'Portaria presencial' : 
                 dados.tipoPortaria === 'eletronica' ? 'Portaria eletrônica' : 
                 dados.tipoPortaria === 'ambas' ? 'Ambos os tipos' : 'Não informado'}
              </p>
            </div>
          </div>
          
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Salão de Festas</p>
              <p class="data-value">
                ${typeof dados.importanciaSalaoFestas !== 'undefined' ? 
                  `${dados.importanciaSalaoFestas}% de importância` : 'Não informado'}
              </p>
            </div>
            <div class="data-item">
              <p class="data-label">Playground</p>
              <p class="data-value">
                ${typeof dados.importanciaPlayground !== 'undefined' ? 
                  `${dados.importanciaPlayground}% de importância` : 'Não informado'}
              </p>
            </div>
          </div>
          
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Espaço Pet</p>
              <p class="data-value">
                ${typeof dados.importanciaEspacoPet !== 'undefined' ? 
                  `${dados.importanciaEspacoPet}% de importância` : 'Não informado'}
              </p>
            </div>
            <div class="data-item">
              <p class="data-label"></p>
              <p class="data-value"></p>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Proximidades & Conveniência</h2>
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Proximidade a Parques</p>
              <p class="data-value">
                ${typeof dados.importanciaParques !== 'undefined' ? 
                  `${dados.importanciaParques}% de importância` : 'Não informado'}
              </p>
            </div>
            <div class="data-item">
              <p class="data-label">Proximidade a Shoppings</p>
              <p class="data-value">
                ${typeof dados.importanciaShoppings !== 'undefined' ? 
                  `${dados.importanciaShoppings}% de importância` : 'Não informado'}
              </p>
            </div>
          </div>
          
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Proximidade a Restaurantes</p>
              <p class="data-value">
                ${typeof dados.importanciaRestaurantes !== 'undefined' ? 
                  `${dados.importanciaRestaurantes}% de importância` : 'Não informado'}
              </p>
            </div>
            <div class="data-item">
              <p class="data-label">Caminhabilidade</p>
              <p class="data-value">
                ${typeof dados.importanciaCaminhabilidade !== 'undefined' ? 
                  `${dados.importanciaCaminhabilidade}% de importância` : 'Não informado'}
              </p>
            </div>
          </div>
          
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Possui Pet</p>
              <p class="data-value">
                ${dados.temPet === 'sim' ? 'Sim' : 
                 dados.temPet === 'nao' ? 'Não' : 'Não informado'}
              </p>
            </div>
            <div class="data-item">
              <p class="data-label">Proximidade a Escolas</p>
              <p class="data-value">
                ${typeof dados.importanciaEscolas !== 'undefined' ? 
                  `${dados.importanciaEscolas}% de importância` : 'Não informado'}
              </p>
            </div>
          </div>
          
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Proximidade a Transporte Público</p>
              <p class="data-value">
                ${typeof dados.importanciaTransporte !== 'undefined' ? 
                  `${dados.importanciaTransporte}% de importância` : 'Não informado'}
              </p>
            </div>
            <div class="data-item">
              <p class="data-label"></p>
              <p class="data-value"></p>
            </div>
          </div>
        </div>
        
        ${dados.fluxoSimulador ? `
        <div class="section">
          <h2>Detalhes da Simulação de Crédito</h2>
          <div style="margin-bottom: 10px;">
            <p style="font-weight: bold;">Tipo de Simulação: ${dados.fluxoSimulador === 'COM_APROVACAO' ? 'Com Aprovação Prévia' : 'Sem Aprovação Prévia'}</p>
          </div>
          
          ${dados.fluxoSimulador === 'COM_APROVACAO' ? `
          <!-- Perguntas do fluxo COM_APROVACAO -->
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">CPF</p>
              <p class="data-value">${dados.cpf || 'Não informado'}</p>
            </div>
            <div class="data-item">
              <p class="data-label">Estado Civil</p>
              <p class="data-value">${dados.estadoCivil === 'sim' ? 'Possui comprovante' : dados.estadoCivil === 'nao' ? 'Não possui comprovante' : 'Não informado'}</p>
            </div>
          </div>
          
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Comprovante de Renda</p>
              <p class="data-value">${dados.comprovanteRenda === 'sim' ? 'Possui comprovante' : dados.comprovanteRenda === 'nao' ? 'Não possui comprovante' : 'Não informado'}</p>
            </div>
            <div class="data-item">
              <p class="data-label">Comprovante de Endereço</p>
              <p class="data-value">${dados.comprovanteEndereco === 'sim' ? 'Possui comprovante' : dados.comprovanteEndereco === 'nao' ? 'Não possui comprovante' : 'Não informado'}</p>
            </div>
          </div>
          
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Carteira de Trabalho</p>
              <p class="data-value">
                ${dados.carteiraTrabalho === 'sim' ? 'Possui carteira' : 
                 dados.carteiraTrabalho === 'nao' ? 'Não possui carteira' : 
                 dados.carteiraTrabalho === 'nao_se_aplica' ? 'Não se aplica' : 'Não informado'}
              </p>
            </div>
            <div class="data-item">
              <p class="data-label">Declaração de IR</p>
              <p class="data-value">
                ${dados.irpf === 'sim' ? 'Possui declaração' : 
                 dados.irpf === 'nao' ? 'Não possui declaração' : 
                 dados.irpf === 'nao_se_aplica' ? 'Não se aplica' : 'Não informado'}
              </p>
            </div>
          </div>
          
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Escolaridade</p>
              <p class="data-value">${dados.escolaridade || 'Não informado'}</p>
            </div>
            <div class="data-item">
              <p class="data-label">Outros Compradores</p>
              <p class="data-value">${dados.outrosCompradores === 'sim' ? 'Sim' : dados.outrosCompradores === 'nao' ? 'Não' : 'Não informado'}</p>
            </div>
          </div>
          ` : ''}
          
          ${dados.fluxoSimulador === 'SEM_APROVACAO' ? `
          <!-- Perguntas do fluxo SEM_APROVACAO -->
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Faixa de Renda Mensal</p>
              <p class="data-value">
                ${dados.rendaMensalFaixa === 'ate_3000' ? 'Até R$ 3.000' : 
                 dados.rendaMensalFaixa === '3001_5000' ? 'R$ 3.001 a R$ 5.000' : 
                 dados.rendaMensalFaixa === '5001_10000' ? 'R$ 5.001 a R$ 10.000' : 
                 dados.rendaMensalFaixa === 'acima_10000' ? 'Acima de R$ 10.000' : 'Não informado'}
              </p>
            </div>
            <div class="data-item">
              <p class="data-label">Outros Financiamentos</p>
              <p class="data-value">${dados.outrosFinanciamentos === 'sim' ? 'Sim, possui' : dados.outrosFinanciamentos === 'nao' ? 'Não possui' : 'Não informado'}</p>
            </div>
          </div>
          
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Data de Nascimento</p>
              <p class="data-value">${dados.dataNascimento || 'Não informado'}</p>
            </div>
            <div class="data-item">
              <p class="data-label">Usa FGTS</p>
              <p class="data-value">${dados.fgts === 'sim' ? 'Sim' : dados.fgts === 'nao' ? 'Não' : 'Não informado'}</p>
            </div>
          </div>
          
          <div class="data-grid">
            <div class="data-item">
              <p class="data-label">Prazo do Financiamento</p>
              <p class="data-value">
                ${dados.prazoFinanciamento === 'curto' ? 'Curto (até 10 anos)' : 
                 dados.prazoFinanciamento === 'medio' ? 'Médio (11 a 20 anos)' : 
                 dados.prazoFinanciamento === 'longo' ? 'Longo (21 a 35 anos)' : 'Não informado'}
              </p>
            </div>
            <div class="data-item">
              <p class="data-label">Tipo de Imóvel</p>
              <p class="data-value">${dados.tipoDeimovel || 'Não informado'}</p>
            </div>
          </div>
          ` : ''}
        </div>
        ` : ''}
        
        <!-- Imóveis recomendados -->
        ${dados.imoveisRecomendados && dados.imoveisRecomendados.length > 0 ? `
        <div class="section">
          <h2>Imóveis Recomendados ${dados.cidade ? `em ${dados.cidade}` : ''}</h2>
          <p>Com base nas suas preferências, selecionamos os seguintes imóveis que podem ser do seu interesse:</p>
          
          <div style="display: grid; grid-template-columns: repeat(1, 1fr); gap: 20px; margin-top: 20px;">
            ${dados.imoveisRecomendados.map(imovel => `
              <div style="border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <div style="display: flex;">
                  <div style="flex: 0 0 120px;">
                    ${imovel.fotoPrincipal || imovel.thumbnail ? `
                      <img src="${imovel.fotoPrincipal || imovel.thumbnail}" 
                           alt="${imovel.titulo}" 
                           style="width: 120px; height: 100px; object-fit: cover;" />
                    ` : `
                      <div style="width: 120px; height: 100px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                        <span style="color: #999;">Sem imagem</span>
                      </div>
                    `}
                  </div>
                  <div style="flex: 1; padding: 12px;">
                    <h3 style="margin: 0 0 6px 0; font-size: 16px;">${imovel.titulo}</h3>
                    <p style="margin: 0 0 8px 0; font-weight: bold; color: #ff6b35;">
                      ${new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', maximumFractionDigits: 0}).format(imovel.preco)}
                    </p>
                    <div style="display: flex; gap: 10px; font-size: 14px; color: #666;">
                      ${imovel.quartos || (imovel.caracteristicas && imovel.caracteristicas.quartos) ? 
                        `<span>${imovel.quartos || imovel.caracteristicas.quartos} quarto(s)</span>` : ''}
                      ${imovel.banheiros || (imovel.caracteristicas && imovel.caracteristicas.banheiros) ? 
                        `<span>${imovel.banheiros || imovel.caracteristicas.banheiros} banheiro(s)</span>` : ''}
                      ${imovel.area || (imovel.caracteristicas && imovel.caracteristicas.area) ? 
                        `<span>${imovel.area || imovel.caracteristicas.area} m²</span>` : ''}
                    </div>
                    ${imovel.matchPercentage ? 
                      `<div style="margin-top: 8px;">
                        <span style="background-color: #ff6b35; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                          ${imovel.matchPercentage}% Match
                        </span>
                      </div>` : ''
                    }
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <div class="section">
          <h2>Próximos Passos</h2>
          <p>Baseado em suas preferências, nossa equipe já está trabalhando para selecionar os melhores imóveis que atendam suas necessidades.</p>
          <p>Um de nossos consultores entrará em contato em breve para apresentar as opções disponíveis e esclarecer quaisquer dúvidas.</p>
          <a href="https://app.imovia.ai/login/" class="cta-button">Ver Imóveis Disponíveis</a>
        </div>
      </div>
      
      <div class="footer">
        <p>© 2025 iMovia - Todos os direitos reservados</p>
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
