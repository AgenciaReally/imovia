import { NextRequest, NextResponse } from 'next/server'
import { AIService, ChatMessage } from '@/services/ai-service'
import { v4 as uuidv4 } from 'uuid'

// Usar o padrão singleton para o AIService
const aiService = AIService.getInstance()

// Estrutura para o prompt do sistema
const SYSTEM_PROMPT = `Você é o assistente IA do sistema Imovia, uma plataforma para gestão de imóveis e construtoras.
Você deve ajudar os usuários a gerenciar imóveis, construtoras, clientes e outras funcionalidades do sistema.

A sua função é responder perguntas e executar ações dentro do sistema de forma simples e direta.

Responda de forma clara, objetiva e profissional.`

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId: providedSessionId } = await request.json()
    
    // Se não foi fornecido um sessionId, cria um novo
    const sessionId = providedSessionId || uuidv4()
    
    // Adiciona o prompt do sistema como primeira mensagem se não estiver presente
    const messagesWithSystem = messages.some((m: ChatMessage) => m.role === 'system')
      ? messages
      : [{ role: 'system', content: SYSTEM_PROMPT, timestamp: new Date() }, ...messages]
    
    // Obter serviço de IA
    const aiService = AIService.getInstance()
    
    // Obter todas as mensagens da sessão para contexto
    const history = await aiService.getConversation(sessionId)
    
    // Enviar mensagem para a API
    const response = await aiService.sendMessage([...history, ...messagesWithSystem])
    
    // Adicionar resposta do assistente ao histórico
    const updatedMessages = [...history, ...messagesWithSystem, { role: 'assistant', content: response, timestamp: new Date() }]
    
    // Salvar conversa no banco
    await aiService.saveConversation(sessionId, updatedMessages)
    
    // Verificar se é um comando de ação e registrar se for
    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage.role === 'user') {
      const userMessage = lastUserMessage.content.toLowerCase()
      
      // Detectar tipo de entidade da mensagem
      function detectEntityType(message: string): 'imovel' | 'construtora' | 'cliente' | 'pergunta' {
        const lowerMessage = message.toLowerCase()
        
        if (lowerMessage.includes('imóvel') || lowerMessage.includes('imovel') || 
            lowerMessage.includes('apartamento') || lowerMessage.includes('casa')) {
          return 'imovel'
        }
        
        if (lowerMessage.includes('construtora')) {
          return 'construtora'
        }
        
        if (lowerMessage.includes('cliente') || lowerMessage.includes('usuário') || 
            lowerMessage.includes('usuario')) {
          return 'cliente'
        }
        
        if (lowerMessage.includes('pergunta') || lowerMessage.includes('formulário') || 
            lowerMessage.includes('formulario')) {
          return 'pergunta'
        }
        
        return 'imovel' // AIActionHistory espera um dos tipos válidos
      }
      
      // Detectar ação da mensagem
      function detectAction(message: string): 'criar' | 'editar' | 'excluir' | 'vincular' | 'consultar' {
        if (message.match(/^(adicionar|criar|novo|cadastrar|inserir)/i)) {
          return 'criar'
        } else if (message.match(/^(editar|atualizar|modificar)/i)) {
          return 'editar'
        } else if (message.match(/^(excluir|remover|deletar|apagar)/i)) {
          return 'excluir'
        } else if (message.match(/^(vincular|associar|conectar)/i)) {
          return 'vincular'
        } else if (message.match(/^(consultar|buscar|procurar|listar)/i)) {
          return 'consultar'
        }
        
        return 'consultar' // AIActionHistory espera um dos tipos válidos
      }
      
      if (
        userMessage.match(/^(adicionar|criar|novo|cadastrar|inserir)\s+(im[oó]vel|construtora|cliente|pergunta)/i) ||
        userMessage.match(/^(editar|atualizar|modificar)\s+(im[oó]vel|construtora|cliente|pergunta)/i) ||
        userMessage.match(/^(excluir|remover|deletar|apagar)\s+(im[oó]vel|construtora|cliente|pergunta)/i) ||
        userMessage.match(/^(consultar|buscar|procurar|listar)\s+(im[oó]vel|construtora|cliente|pergunta|resposta)/i) ||
        userMessage.match(/^(vincular|associar|conectar)\s+((telefone|construtora)\s+a\s+im[oó]vel|im[oó]vel\s+a\s+construtora)/i)
      ) {
        // Extrai o tipo de entidade e ação
        const tipo = detectEntityType(userMessage)
        const acao = detectAction(userMessage)
        
        // Registrar ação no histórico (localStorage)
        await aiService.logAction({
          tipo,
          acao,
          entidade: 'chat',
          idEntidade: sessionId,
          timestamp: new Date(),
          status: 'success',
          detalhes: JSON.stringify({
            userMessage: lastUserMessage.content,
            response: response
          })
        })
      }
    }
    
    return NextResponse.json({
      response,
      sessionId,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Erro ao processar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a mensagem' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')
    const type = searchParams.get('type') || 'messages' // 'messages' ou 'actions'

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID é obrigatório' },
        { status: 400 }
      )
    }

    if (type === 'messages') {
      // Buscar mensagens usando a implementação atual do AIService (localStorage)
      const messages = await aiService.getConversation(sessionId)
      return NextResponse.json({ messages })
    } else if (type === 'actions') {
      // Temporário: buscar ações do localStorage
      try {
        // Busca direta no localStorage do lado do servidor não funciona
        // Esse código só funcionará no cliente, portanto retornaremos um array vazio
        return NextResponse.json({ actions: [] })
      } catch (error) {
        console.error('Erro ao buscar histórico de ações:', error)
        return NextResponse.json({ actions: [] })
      }
    } else {
      return NextResponse.json(
        { error: 'Tipo inválido. Use "messages" ou "actions"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar histórico' },
      { status: 500 }
    )
  }
}
