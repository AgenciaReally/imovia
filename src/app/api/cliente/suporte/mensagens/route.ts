import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";

// Função para gerar resposta automática com DeepSeek AI
async function gerarRespostaIA(mensagem: string, userId: string) {
  try {
    // Buscar contexto do usuário (respostas e imóveis)
    const [respostasUsuario, imoveisUsuario] = await Promise.all([
      prisma.resposta.findMany({
        where: { userId },
        include: { pergunta: true }
      }),
      prisma.imovel.findMany({
        where: {
          matches: {
            some: {
              relatorio: {
                userId: userId
              }
            }
          }
        },
        include: { construtora: true },
        take: 5
      })
    ]);

    // Preparar contexto para o DeepSeek
    const contextoImovia = {
      empresa: "iMovia",
      descricao: "Plataforma inteligente que usa IA para encontrar o imóvel ideal para cada cliente",
      servicos: [
        "Recomendação personalizada de imóveis baseada em IA",
        "Análise de compatibilidade com score inteligente",
        "Conexão direta com construtoras e incorporadoras",
        "Formulário dinâmico que se adapta ao perfil do cliente"
      ],
      diferenciais: [
        "Precisão e eficiência na recomendação",
        "Acesso fácil via celular ou computador",
        "Dados protegidos seguindo LGPD",
        "Leads qualificados para construtoras"
      ],
      tiposImoveis: "Condomínios, Sobrados, Apartamentos de construtoras e incorporadoras",
      seguranca: "Dados protegidos pela LGPD, compartilhados apenas com autorização"
    };

    const perfilUsuario = respostasUsuario.map(r => ({
      pergunta: r.pergunta.texto,
      resposta: r.valor
    }));

    const imoveisSalvos = imoveisUsuario.map(i => ({
      titulo: i.titulo,
      preco: i.preco,
      area: i.area,
      quartos: i.quartos,
      endereco: i.endereco,
      construtora: i.construtora.nome
    }));

    // Prompt para o DeepSeek
    const prompt = `
    Você é o assistente virtual da iMovia, uma plataforma que usa IA para encontrar imóveis ideais.

    CONTEXTO DA IMOVIA:
    ${JSON.stringify(contextoImovia, null, 2)}

    PERFIL DO USUÁRIO:
    ${JSON.stringify(perfilUsuario, null, 2)}

    IMÓVEIS SALVOS PELO USUÁRIO:
    ${JSON.stringify(imoveisSalvos, null, 2)}

    MENSAGEM DO USUÁRIO: "${mensagem}"

    INSTRUÇÕES:
    - Responda como assistente virtual da iMovia
    - Use informações do contexto e perfil do usuário
    - Seja útil, amigável e profissional
    - Mencione funcionalidades específicas da plataforma quando relevante
    - Se não souber algo específico, direcione para contato humano
    - Mantenha resposta concisa (máximo 200 palavras)

    Responda diretamente, sem formatação markdown:
    `;

    // Tentar usar DeepSeek API
    if (process.env.DEEPSEEK_API_KEY) {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'Você é o assistente virtual da iMovia. Seja útil, amigável e profissional.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content.trim();
      }
    }

    // Fallback com respostas inteligentes baseadas no contexto
    return gerarRespostaContextual(mensagem, perfilUsuario, imoveisSalvos);

  } catch (error) {
    console.error("Erro ao gerar resposta com IA:", error);
    return gerarRespostaContextual(mensagem, [], []);
  }
}

// Função de fallback com respostas contextuais
function gerarRespostaContextual(mensagem: string, perfil: any[], imoveis: any[]) {
  const mensagemLower = mensagem.toLowerCase();
  
  if (mensagemLower.includes("olá") || mensagemLower.includes("oi") || mensagemLower.includes("bom dia") || mensagemLower.includes("boa tarde") || mensagemLower.includes("boa noite")) {
    return "Olá! Sou o assistente virtual da iMovia. Como posso ajudar você hoje? Posso tirar dúvidas sobre seus imóveis recomendados, explicar como funciona nossa plataforma ou ajudar com questões técnicas.";
  }
  
  if (mensagemLower.includes("imóvel") || mensagemLower.includes("imovel") || mensagemLower.includes("casa") || mensagemLower.includes("apartamento")) {
    const temImoveis = imoveis.length > 0;
    if (temImoveis) {
      return `Você tem ${imoveis.length} imóvel(is) salvo(s) no seu perfil! Nossa IA analisou seu perfil e encontrou essas opções que combinam com você. Acesse a seção 'Meus Imóveis' para ver detalhes ou faça uma nova simulação para encontrar mais opções.`;
    }
    return "Nossa IA analisa seu perfil e encontra imóveis que combinam perfeitamente com você! Faça uma simulação no nosso formulário inteligente para receber recomendações personalizadas de apartamentos, casas e condomínios.";
  }
  
  if (mensagemLower.includes("financiamento") || mensagemLower.includes("financiar") || mensagemLower.includes("banco") || mensagemLower.includes("empréstimo")) {
    return "Para informações sobre financiamento, recomendo entrar em contato diretamente com a construtora do imóvel de seu interesse. Na iMovia, conectamos você diretamente com construtoras e incorporadoras que podem oferecer as melhores condições de pagamento.";
  }
  
  if (mensagemLower.includes("senha") || mensagemLower.includes("login") || mensagemLower.includes("acesso")) {
    return "Para alterar sua senha ou atualizar dados de acesso, acesse a seção 'Perfil' do seu painel, na aba 'Segurança'. Lá você pode alterar sua senha com segurança.";
  }
  
  if (mensagemLower.includes("como funciona") || mensagemLower.includes("funciona")) {
    return "A iMovia funciona assim: 1) Você responde nosso formulário inteligente sobre suas preferências, 2) Nossa IA analisa suas respostas e calcula o melhor match, 3) Você recebe recomendações personalizadas de imóveis perfeitos para seu perfil, 4) Conectamos você diretamente com as construtoras. Tudo com segurança LGPD!";
  }
  
  if (mensagemLower.includes("segurança") || mensagemLower.includes("dados") || mensagemLower.includes("lgpd")) {
    return "Sua segurança é nossa prioridade! Seguimos rigorosamente a LGPD. Seus dados são protegidos e só são compartilhados com construtoras mediante sua autorização expressa. Você tem controle total sobre suas informações.";
  }
  
  if (mensagemLower.includes("ajuda") || mensagemLower.includes("suporte") || mensagemLower.includes("problema")) {
    return "Estou aqui para ajudar! Posso esclarecer dúvidas sobre: como funciona a plataforma, seus imóveis recomendados, contato com construtoras, alteração de dados do perfil, ou questões técnicas. Descreva seu problema com mais detalhes.";
  }
  
  // Resposta padrão personalizada
  return "Obrigado por sua mensagem! Como assistente da iMovia, estou aqui para ajudar com informações sobre nossa plataforma, seus imóveis recomendados e dúvidas gerais. Para questões mais específicas, nossa equipe humana pode entrar em contato via e-mail ou WhatsApp.";
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
        usuarioId: usuario.id 
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    // Formatar mensagens para o frontend
    const mensagensFormatadas = mensagens.map(msg => ({
      id: msg.id,
      conteudo: msg.texto,
      remetente: msg.status === 'RESPONDIDA' ? 'IA' : 'USUARIO',
      dataCriacao: msg.createdAt.toISOString(),
      lida: true
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
        texto: conteudo,
        status: "PENDENTE",
        usuarioId: usuario.id,
        usuarioNome: usuario.name || "Cliente",
        usuarioEmail: session.user.email
      }
    });
    
    // Gerar resposta automática com IA
    const respostaIA = await gerarRespostaIA(conteudo, usuario.id);
    
    // Atualizar mensagem com resposta da IA
    const mensagemAtualizada = await prisma.mensagemContato.update({
      where: { id: mensagemUsuario.id },
      data: {
        resposta: respostaIA,
        status: "RESPONDIDA"
      }
    });
    
    return NextResponse.json({
      id: mensagemAtualizada.id,
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
