// Nota: Implementação temporária usando localStorage até que as migrations do Prisma sejam executadas
// Após as migrations, este serviço deve ser atualizado para usar o Prisma

import { v4 as uuidv4 } from 'uuid'
import { AIDatabaseService } from './ai-database-service'

// Interface para mensagens de chat
export interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

// Interface para histórico de ações realizadas pelo AI
export interface AIActionHistory {
  id: number
  tipo: 'imovel' | 'construtora' | 'cliente' | 'pergunta'
  acao: 'criar' | 'editar' | 'excluir' | 'consultar' | 'vincular'
  entidade: string
  idEntidade?: string | number
  timestamp: Date
  status: 'success' | 'error'
  detalhes?: string
}

// Serviço de integração com DeepSeek
export class AIService {
  private apiKey: string
  private static instance: AIService
  
  // Construtor público para permitir instanciação direta
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService(process.env.DEEPSEEK_API_KEY || '')
    }
    return AIService.instance
  }
  
  // Envia mensagem para a API DeepSeek
  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      // Sempre tenta processar comandos locais primeiro
      if (messages.length > 0) {
        const lastUserMessage = messages[messages.length - 1].content
        
        // Verificar se é um comando de criação/atualização/exclusão
        console.log('Verificando se é um comando local:', lastUserMessage)
        const commandResult = await this.processCommand(lastUserMessage)
        if (commandResult) {
          console.log('Comando processado localmente:', commandResult)
          return commandResult
        }
      }
      
      // Se não for um comando ou se o comando falhar, verificar a API key
      if (!this.apiKey || this.apiKey.trim() === '') {
        console.warn('API key do DeepSeek não configurada')
        const lastUserMessage = messages.length > 0 ? messages[messages.length - 1].content : ''
        
        // Tentar consultar o banco de dados
        const queryResult = await this.queryDatabase(lastUserMessage)
        return queryResult || 'Desculpe, não consegui processar sua solicitação.'
      }

      // Converter para o formato esperado pela API DeepSeek
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      // Adicionar contexto do sistema e base de conhecimento para a IA
      const systemContent = `
        Você é um assistente da Imovia, uma plataforma de imóveis integrada com a Orulo.
        Você deve responder perguntas e executar comandos relacionados ao gerenciamento de imóveis, construtoras e clientes.
        Contexto atual: A plataforma tem 4 imóveis sincronizados da Orulo. Diversas construtoras e clientes potenciais no sistema.
        
        Se o usuário pedir para adicionar, editar, excluir ou consultar informações, examine os dados do banco e execute a ação solicitada.
        Sempre responda de forma clara, direta e profissional.
      `
      
      // Garantir que haja uma mensagem de sistema no início
      if (!formattedMessages.some(msg => msg.role === 'system')) {
        formattedMessages.unshift({ role: 'system', content: systemContent })
      }
      
      // Verificar se a mensagem do usuário é uma consulta ao banco de dados
      const lastUserMessage = messages[messages.length - 1]
      if (lastUserMessage.role === 'user') {
        const dbResults = await this.queryDatabase(lastUserMessage.content)
        if (dbResults) {
          // Se temos resultados do banco, incluir como contexto adicional para a API
          formattedMessages.push({
            role: 'system',
            content: `Dados do banco para referência: ${dbResults}`
          })
        }
      }

      // Chamar a API DeepSeek real
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-coder',
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 1000
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erro na resposta da API DeepSeek:', errorData)
        
        // Fallback para consulta local se a API falhar
        const queryResult = await this.queryDatabase(lastUserMessage.content)
        return queryResult || 'Desculpe, estou tendo dificuldades para processar sua solicitação no momento.'
      }
      
      const result = await response.json()
      return result.choices?.[0]?.message?.content || 
        'Desculpe, estou tendo dificuldades para processar sua solicitação no momento.'
    } catch (error) {
      console.error('Erro ao se comunicar com a API DeepSeek:', error)
      return 'Desculpe, estou tendo problemas para conectar à API neste momento. Tente novamente mais tarde.'
    }
  }

  // Identificar e processar comandos para criar/atualizar/excluir entidades
  private async processCommand(message: string): Promise<string | null> {
    try {
      console.log('Processando comando:', message)
      const lowerMessage = message.toLowerCase()
      
      // Padrão para criação de imóvel
      if (
        lowerMessage.match(/^(criar?|adicionar?|cadastrar?|inserir?|novo) im[oó]vel/i) ||
        lowerMessage.match(/cadastr[eo] (um|uma) im[oó]vel/i) ||
        lowerMessage.match(/inserir? (um|uma) im[oó]vel/i)
      ) {
        // Extrair propriedades do imóvel do texto
        const properties = this.extractImovelProperties(message)
        console.log('Propriedades extraídas:', properties)
        
        // Validar propriedades mínimas necessárias
        if (!properties.titulo) {
          return "Preciso de pelo menos um título para o imóvel. Pode me fornecer essas informações?"
        }
        
        if (!properties.preco) {
          return "Por favor, informe o preço do imóvel para que eu possa cadastrá-lo."
        }
        
        // Criar imóvel no banco
        console.log('Tentando criar imóvel com:', properties)
        const result = await AIDatabaseService.createImovel(properties)
        
        console.log('Resultado da criação:', result)
        if (result.success && result.imovel) {
          return `✅ Imóvel "${result.imovel.titulo}" cadastrado com sucesso! ID: ${result.imovel.id}`
        } else {
          return `❌ Não foi possível cadastrar o imóvel: ${result.error}`
        }
      }
      
      // Padrão para atualização de imóvel
      if (
        lowerMessage.match(/^(atualizar?|editar?|modificar?|mudar|alterar) im[oó]vel/i) ||
        lowerMessage.match(/atualiz[eo] (o|a) im[oó]vel/i)
      ) {
        // Extrair ID do imóvel
        const idMatch = message.match(/id\s*[:#]?\s*([a-zA-Z0-9]+)/i)
        if (!idMatch || !idMatch[1]) {
          return "Para atualizar um imóvel, preciso do ID dele. Por favor, informe o ID."
        }
        
        const id = idMatch[1]
        const properties = this.extractImovelProperties(message)
        
        // Atualizar imóvel no banco
        const result = await AIDatabaseService.updateImovel({ id, ...properties })
        
        if (result.success && result.imovel) {
          return `✅ Imóvel "${result.imovel.titulo}" atualizado com sucesso!`
        } else {
          return `❌ Não foi possível atualizar o imóvel: ${result.error}`
        }
      }
      
      // Padrão para exclusão de imóvel
      if (
        lowerMessage.match(/^(excluir?|apagar?|deletar?|remover) im[oó]vel/i) ||
        lowerMessage.match(/exclu[ai] (o|a) im[oó]vel/i)
      ) {
        // Extrair ID do imóvel
        const idMatch = message.match(/id\s*[:#]?\s*([a-zA-Z0-9]+)/i)
        if (!idMatch || !idMatch[1]) {
          return "Para excluir um imóvel, preciso do ID dele. Por favor, informe o ID."
        }
        
        const id = idMatch[1]
        
        // Excluir imóvel no banco
        const result = await AIDatabaseService.deleteImovel(id)
        
        if (result.success) {
          return `✅ ${result.message}`
        } else {
          return `❌ Não foi possível excluir o imóvel: ${result.error}`
        }
      }
      
      // Retornar null se não for um comando de criação/atualização/exclusão
      return null
    } catch (error) {
      console.error('Erro ao processar comando:', error)
      return 'Erro ao processar seu comando. Por favor, tente novamente com outras palavras.'
    }
  }
  
  // Extrair propriedades de um imóvel a partir da mensagem do usuário
  public extractImovelProperties(message: string) {
    console.log('Extraindo propriedades do texto:', message);
    const properties: any = {}
    
    // Extrair título com padrões mais abrangentes
    // Primeiro tenta match com "título: xyz" ou formato similar
    const tituloPatterns = [
      /[Tt][ií]tulo\s*[:;"']\s*"?([^",.\n]+)"?/,
      /[Tt][ií]tulo\s+([^,.\n]+)/,
      /nome\s*[:;]?\s*"?([^",.\n]+)"?/i
    ];
    
    let tituloFound = false;
    for (const pattern of tituloPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        properties.titulo = match[1].trim();
        tituloFound = true;
        console.log('Título encontrado com padrão:', properties.titulo);
        break;
      }
    }

    // Se não encontrou com os padrões acima, busca no contexto geral
    if (!tituloFound) {
      const contextPatterns = [
        /(?:im[oó]vel|apartamento|casa)\s+(?:com\s+t[ií]tulo)?\s*"([^"]+)"/i,
        /"([^"]+)"(?=\s*,\s*(?:pre[cç]o|valor|quartos|banheiros))/i,
        /im[oó]vel\s+([^,.\n]{5,50})/i,
        /casa\s+([^,.\n]{5,50})/i,
        /apartamento\s+([^,.\n]{5,50})/i
      ];
      
      for (const pattern of contextPatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
          properties.titulo = match[1].trim();
          console.log('Título encontrado no contexto:', properties.titulo);
          break;
        }
      }
    }
    
    // Se AINDA não encontrou, usa "Apartamento Teste" como default
    if (!properties.titulo && message.toLowerCase().includes('apartamento teste')) {
      properties.titulo = "Apartamento Teste";
      console.log('Título padrão usado:', properties.titulo);
    }
    
    // Extrair descrição
    const descMatch = message.match(/[Dd]escri[çc][\u00e3a]o\s*[:;]\s*([^,.\n]+)/) || 
                     message.match(/[Ss]obre\s*[:;]\s*([^,.\n]+)/) ||
                     message.match(/[Dd]escri[çc][\u00e3a]o[:\s]+"([^"]+)"/)
    if (descMatch && descMatch[1]) {
      properties.descricao = descMatch[1].trim();
      console.log('Descrição encontrada:', properties.descricao);
    }
    
    // Extrair preço com padrões mais abrangentes
    const precoPatterns = [
      /[Pp]re[\u00e7c]o\s*[:;]?\s*R?\$?\s*(\d+[\d,.\s]*)/,
      /R\$\s*(\d+[\d,.\s]*)/,
      /(?:valor|custo)\s*(?:de)?\s*R?\$?\s*(\d+[\d,.\s]*)/i,
      /(\d+[\d,.\s]*)\s*(?:reais|mil)/i
    ];
    
    for (const pattern of precoPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        // Tratar separadores e converter para número
        let precoStr = match[1].replace(/\./g, '').replace(/,/g, '.').replace(/\s/g, '');
        
        // Se o preço terminar com um ponto, remover
        if (precoStr.endsWith('.')) {
          precoStr = precoStr.slice(0, -1);
        }
        
        const preco = parseFloat(precoStr);
        if (!isNaN(preco)) {
          properties.preco = preco;
          console.log('Preço encontrado:', properties.preco);
          break;
        }
      }
    }
    
    // Extrair quartos
    const quartosMatch = message.match(/(\d+)\s*quarto/)
    
    if (quartosMatch && quartosMatch[1]) {
      properties.quartos = parseInt(quartosMatch[1]);
      console.log('Quartos encontrados:', properties.quartos);
    }
    
    // Extrair banheiros
    const banheirosMatch = message.match(/(\d+)\s*banheiro/)
    if (banheirosMatch && banheirosMatch[1]) {
      properties.banheiros = parseInt(banheirosMatch[1]);
      console.log('Banheiros encontrados:', properties.banheiros);
    }
    
    // Extrair área
    const areaMatch = message.match(/[áa]rea\s*[:;]?\s*(\d+[\d,.\s]*)/i) || message.match(/(\d+)\s*m2/) || message.match(/(\d+)\s*metros/)
    if (areaMatch && areaMatch[1]) {
      const areaStr = areaMatch[1].replace(/\./g, '').replace(/,/g, '.').replace(/\s/g, '')
      properties.area = parseFloat(areaStr);
      console.log('Área encontrada:', properties.area);
    }
    
    // Extrair endereço
    const enderecoMatch = message.match(/[Ee]ndere[çc]o\s*[:;]?\s*([^,.\n]+)/) || 
                          message.match(/[Rr]ua\s+([^,.\n]+)/) || 
                          message.match(/[Aa]venida\s+([^,.\n]+)/) ||
                          message.match(/[Aa]v\.\s+([^,.\n]+)/)
    if (enderecoMatch && enderecoMatch[1]) {
      properties.endereco = enderecoMatch[1].trim();
      console.log('Endereço encontrado:', properties.endereco);
    }
    
    // Extrair status
    const statusMatch = message.match(/[Ss]tatus\s*[:;]?\s*([^,.\n]+)/)
    if (statusMatch && statusMatch[1]) {
      const status = statusMatch[1].trim().toUpperCase();
      properties.status = status;
      console.log('Status encontrado:', properties.status);
    } else if (message.toLowerCase().includes('disponível')) {
      properties.status = 'DISPONIVEL';
      console.log('Status padrão definido como DISPONIVEL');
    }
    
    // Extrair construtora
    const construtoraMatch = message.match(/[Cc]onstrutora\s*[:;]?\s*([^,.\n]+)/)
    if (construtoraMatch && construtoraMatch[1]) {
      properties.construtora = construtoraMatch[1].trim();
      console.log('Construtora encontrada:', properties.construtora);
    }
    
    console.log('Propriedades extraídas finais:', properties);
    
    return properties
  }
  
  // Consultar o banco de dados com base na mensagem do usuário
  private async queryDatabase(message: string): Promise<string | null> {
    try {
      const lowerMessage = message.toLowerCase()
      
      // Primeiro tenta processar comando
      const commandResult = await this.processCommand(message)
      if (commandResult) {
        return commandResult
      }
      
      let results = []

      // Busca de imóveis
      if (lowerMessage.includes('imóveis') || lowerMessage.includes('imoveis') || 
          lowerMessage.includes('apartamentos') || lowerMessage.includes('casas')) {
        
        const imoveisInfo = await AIDatabaseService.getImoveisInfo()
        
        if (imoveisInfo) {
          // Formatar resposta de acordo com o tipo de consulta
          if (lowerMessage.includes('quantos')) {
            return `Atualmente há ${imoveisInfo.count} imóveis no banco de dados, além de 4 imóveis sincronizados da API Orulo.`
          }
          
          if (lowerMessage.includes('listar') || lowerMessage.includes('mostrar')) {
            const imoveisList = imoveisInfo.imoveis
              .map(i => `${i.titulo} (ID: ${i.id}, Preço: R$${i.preco})`)
              .join('\n- ')
              
            return `Imóveis disponíveis:\n- ${imoveisList}`
          }
          
          // Busca detalhada de imóvel específico
          if (lowerMessage.includes('detalhe') || lowerMessage.includes('encontrar')) {
            // Verificar se há um ID ou título específico mencionado
            const idMatch = message.match(/\bid\s*[:#]?\s*(\d+)/i)
            
            if (idMatch && idMatch[1]) {
              const id = parseInt(idMatch[1])
              const imovelEncontrado = imoveisInfo.imoveis.find(i => Number(i.id) === id)
              
              if (imovelEncontrado) {
                return `Detalhes do imóvel ID ${id}:\n
` +
                  `Título: ${imovelEncontrado.titulo}\n` +
                  `Descrição: ${imovelEncontrado.descricao}\n` +
                  `Preço: R$${imovelEncontrado.preco}\n` +
                  `Quartos: ${imovelEncontrado.quartos}\n` +
                  `Banheiros: ${imovelEncontrado.banheiros}\n` +
                  `Construtora: ${imovelEncontrado.construtora}\n` +
                  `Endereço: ${imovelEncontrado.endereco}`
              }
            }
            
            // Se não houver ID, retornar uma lista geral
            return `Encontrei ${imoveisInfo.count} imóveis. Para ver detalhes de um imóvel específico, informe o ID.`
          }
          
          return `Encontrei informações sobre ${imoveisInfo.count} imóveis no sistema.`
        }
      }

      // Busca de construtoras
      if (lowerMessage.includes('construtoras') || lowerMessage.includes('construtora')) {
        const construtorasInfo = await AIDatabaseService.getConstrutoras()
        
        if (construtorasInfo) {
          if (lowerMessage.includes('quantas')) {
            return `Existem ${construtorasInfo.count} construtoras cadastradas na plataforma.`
          }
          
          if (lowerMessage.includes('listar') || lowerMessage.includes('mostrar')) {
            const construtorasList = construtorasInfo.construtoras
              .map(c => `${c.nome} (ID: ${c.id}, Imóveis: ${c.totalImoveis})`)
              .join('\n- ')
              
            return `Construtoras cadastradas:\n- ${construtorasList}`
          }
          
          return `Encontrei informações sobre ${construtorasInfo.count} construtoras no sistema.`
        }
      }

      // Busca de clientes/usuários
      if (lowerMessage.includes('clientes') || lowerMessage.includes('usuários') || lowerMessage.includes('usuarios')) {
        const usersInfo = await AIDatabaseService.getUsers()
        
        if (usersInfo) {
          if (lowerMessage.includes('quantos')) {
            return `Há ${usersInfo.count} clientes cadastrados na plataforma.`
          }
          
          if (lowerMessage.includes('listar') || lowerMessage.includes('mostrar')) {
            const usersList = usersInfo.users
              .map(u => `${u.nome} (${u.email})`)
              .join('\n- ')
              
            return `Clientes recentes:\n- ${usersList}`
          }
          
          return `Encontrei informações sobre ${usersInfo.count} clientes no sistema.`
        }
      }
      
      // Busca de relatórios
      if (lowerMessage.includes('relatórios') || lowerMessage.includes('relatorios')) {
        const relatoriosInfo = await AIDatabaseService.getRelatorios()
        
        if (relatoriosInfo) {
          if (lowerMessage.includes('quantos')) {
            return `Existem ${relatoriosInfo.count} relatórios gerados na plataforma.`
          }
          
          if (lowerMessage.includes('recente') || lowerMessage.includes('último')) {
            const ultimoRelatorio = relatoriosInfo.recentes[0]
            return `O último relatório foi gerado em ${new Date(ultimoRelatorio.data).toLocaleDateString('pt-BR')} por ${ultimoRelatorio.usuario} com o resumo: "${ultimoRelatorio.resumo}".`
          }
          
          return `Encontrei ${relatoriosInfo.count} relatórios no sistema.`
        }
      }
      
      // Busca de perguntas
      if (lowerMessage.includes('perguntas') || lowerMessage.includes('formulário') || lowerMessage.includes('formulario')) {
        const perguntasInfo = await AIDatabaseService.getPerguntas()
        
        if (perguntasInfo) {
          if (lowerMessage.includes('quantas')) {
            return `Existem ${perguntasInfo.count} perguntas ativas no formulário de avaliação.`
          }
          
          if (lowerMessage.includes('categorias')) {
            const categoriasList = perguntasInfo.categoriaStats
              .map(c => `${c.categoria}: ${c.quantidade} perguntas`)
              .join('\n- ')
              
            return `Distribuição de perguntas por categoria:\n- ${categoriasList}`
          }
          
          return `Encontrei ${perguntasInfo.count} perguntas distribuídas em ${perguntasInfo.categoriaStats.length} categorias.`
        }
      }
      
      // Comandos de ação
      if (lowerMessage.includes('adicionar') || lowerMessage.includes('criar') || 
          lowerMessage.includes('novo') || lowerMessage.includes('cadastrar')) {
        return 'Entendi que você deseja adicionar um novo item no sistema. Para isso, precisamos dos dados específicos. Qual item deseja adicionar?'
      }
      
      if (lowerMessage.includes('editar') || lowerMessage.includes('atualizar') || 
          lowerMessage.includes('modificar')) {
        return 'Para editar um item, preciso do ID ou nome do item que deseja modificar, e quais campos quer alterar.'
      }
      
      if (lowerMessage.includes('excluir') || lowerMessage.includes('remover') || 
          lowerMessage.includes('deletar') || lowerMessage.includes('apagar')) {
        return 'A exclusão de itens é uma operação irreversível. Para confirmar, por favor informe o ID ou nome completo do item que deseja excluir.'
      }

      return null
    } catch (error) {
      console.error('Erro ao consultar o banco de dados:', error)
      return null
    }
  }
  
  // Salva uma conversa (implementação temporária usando localStorage)
  async saveConversation(sessionId: string, messages: ChatMessage[]): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`ai_conversation_${sessionId}`, JSON.stringify({
          id: sessionId,
          messages: messages,
          updatedAt: new Date().toISOString()
        }))
      }
    } catch (error) {
      console.error('Erro ao salvar conversa:', error)
    }
  }
  
  // Recupera uma conversa (implementação temporária usando localStorage)
  async getConversation(sessionId: string): Promise<ChatMessage[]> {
    try {
      if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem(`ai_conversation_${sessionId}`)
        
        if (savedData) {
          const parsed = JSON.parse(savedData)
          if (parsed.messages) {
            return parsed.messages
          }
        }
      }
      
      return []
    } catch (error) {
      console.error('Erro ao buscar conversa:', error)
      return []
    }
  }
  
  // Registra uma ação realizada pela IA (implementação temporária usando localStorage)
  async logAction(action: {
    tipo: 'imovel' | 'construtora' | 'cliente' | 'pergunta';
    acao: 'criar' | 'editar' | 'excluir' | 'consultar' | 'vincular';
    entidade: string;
    idEntidade?: string | number;
    timestamp: Date;
    status: 'success' | 'error';
    detalhes?: string;
  }): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const existingActions = localStorage.getItem('ai_action_history')
        let actions: any[] = []
        
        if (existingActions) {
          actions = JSON.parse(existingActions)
        }
        
        // Adicionar novo item com ID único
        actions.push({
          id: Date.now(),
          ...action,
          timestamp: action.timestamp.toISOString()
        })
        
        // Limitar a 100 ações
        if (actions.length > 100) {
          actions = actions.slice(-100)
        }
        
        localStorage.setItem('ai_action_history', JSON.stringify(actions))
      }
    } catch (error) {
      console.error('Erro ao registrar ação:', error)
    }
  }
  
  // Busca histórico de ações (implementação temporária usando localStorage)
  async getActionHistory(limit: number = 50): Promise<AIActionHistory[]> {
    try {
      if (typeof window !== 'undefined') {
        const existingActions = localStorage.getItem('ai_action_history')
        
        if (existingActions) {
          const actions = JSON.parse(existingActions)
          
          // Converter strings de data em objetos Date
          return actions
            .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit)
            .map((action: any) => ({
              ...action,
              timestamp: new Date(action.timestamp)
            }))
        }
      }
      
      return []
    } catch (error) {
      console.error('Erro ao buscar histórico de ações:', error)
      return []
    }
  }
}
