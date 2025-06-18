import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";

// Função para gerar resposta automática com IA
async function gerarRespostaIA(mensagem: string) {
  try {
    // Aqui seria a integração com a Deepseek AI
    // Por enquanto, vamos simular respostas básicas
    
    const mensagemLower = mensagem.toLowerCase();
    
    if (mensagemLower.includes("olá") || mensagemLower.includes("oi") || mensagemLower.includes("bom dia") || mensagemLower.includes("boa tarde") || mensagemLower.includes("boa noite")) {
      return "Olá! Como posso ajudar você hoje?";
    }
    
    if (mensagemLower.includes("imóvel") || mensagemLower.includes("imovel") || mensagemLower.includes("casa") || mensagemLower.includes("apartamento")) {
      return "Temos diversas opções de imóveis disponíveis! Você pode visualizá-los na seção 'Meus Imóveis' do seu painel ou fazer uma nova simulação para encontrar mais opções que combinem com seu perfil.";
    }
    
    if (mensagemLower.includes("financiamento") || mensagemLower.includes("financiar") || mensagemLower.includes("banco") || mensagemLower.includes("empréstimo")) {
      return "Para informações sobre financiamento, recomendamos entrar em contato diretamente com a construtora do imóvel de seu interesse. Você pode encontrar os contatos na seção 'Construtoras' do seu painel.";
    }
    
    if (mensagemLower.includes("senha") || mensagemLower.includes("login") || mensagemLower.includes("acesso")) {
      return "Para alterar sua senha ou atualizar dados de acesso, acesse a seção 'Perfil' do seu painel, na aba 'Segurança'.";
    }
    
    if (mensagemLower.includes("ajuda") || mensagemLower.includes("suporte") || mensagemLower.includes("problema")) {
      return "Estou aqui para ajudar! Por favor, descreva seu problema com mais detalhes para que eu possa oferecer a melhor assistência possível.";
    }
    
    // Resposta padrão
    return "Obrigado por sua mensagem. Nossa equipe está analisando sua solicitação e em breve entraremos em contato. Se preferir atendimento imediato, você pode entrar em contato pelo WhatsApp ou telefone disponíveis em nosso site.";
  } catch (error) {
    console.error("Erro ao gerar resposta com IA:", error);
    return "Desculpe, estou com dificuldades para processar sua solicitação no momento. Por favor, tente novamente mais tarde.";
  }
}

// GET - Buscar histórico de mensagens
export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    // Buscar usuário pelo email
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });
    
    if (!usuario || usuario.role !== "CLIENTE") {
      return NextResponse.json(
        { error: "Acesso permitido apenas para clientes" },
        { status: 403 }
      );
    }
    
    // Buscar mensagens do cliente
    const mensagens = await prisma.mensagemContato.findMany({
      where: { 
        userId: usuario.id 
      },
      orderBy: {
        dataCriacao: 'asc'
      }
    });
    
    // Formatar mensagens para o frontend
    const mensagensFormatadas = mensagens.map(msg => ({
      id: msg.id,
      conteudo: msg.conteudo,
      remetente: msg.remetente,
      dataCriacao: msg.dataCriacao.toISOString(),
      lida: msg.lida
    }));
    
    return NextResponse.json(mensagensFormatadas);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return NextResponse.json(
      { error: "Erro ao buscar mensagens" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Enviar nova mensagem
export async function POST(req: NextRequest) {
  try {
    const { conteudo } = await req.json();
    
    // Verificar autenticação
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    // Buscar usuário pelo email
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, name: true }
    });
    
    if (!usuario || usuario.role !== "CLIENTE") {
      return NextResponse.json(
        { error: "Acesso permitido apenas para clientes" },
        { status: 403 }
      );
    }
    
    // Validar conteúdo da mensagem
    if (!conteudo || conteudo.trim() === "") {
      return NextResponse.json(
        { error: "Conteúdo da mensagem não pode estar vazio" },
        { status: 400 }
      );
    }
    
    // Salvar mensagem do usuário
    const mensagemUsuario = await prisma.mensagemContato.create({
      data: {
        id: uuidv4(),
        conteudo,
        remetente: "USUARIO",
        userId: usuario.id,
        nome: usuario.name || "Cliente",
        email: session.user.email,
        lida: false
      }
    });
    
    // Gerar resposta automática com IA
    const respostaIA = await gerarRespostaIA(conteudo);
    
    // Salvar resposta da IA
    const mensagemIA = await prisma.mensagemContato.create({
      data: {
        id: uuidv4(),
        conteudo: respostaIA,
        remetente: "IA",
        userId: usuario.id,
        nome: "Assistente Imovia",
        email: "assistente@imovia.com.br",
        lida: true
      }
    });
    
    return NextResponse.json({
      id: mensagemIA.id,
      resposta: respostaIA
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return NextResponse.json(
      { error: "Erro ao enviar mensagem" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
