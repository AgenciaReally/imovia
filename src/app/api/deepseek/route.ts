import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  
  try {
    const body = await request.json();
    const { perguntas, respostas, categorias } = body;
    
    // Log para debug
    console.log(`Recebido ${Object.keys(respostas).length} respostas para otimização`);
    
    // Verifica se estamos em modo de desenvolvimento
    const isDev = process.env.NODE_ENV === 'development';
    
    // Em desenvolvimento, usar dados mockados para evitar consumo da API
    if (isDev || !DEEPSEEK_API_KEY) {
      console.log('Usando resposta mockada do DeepSeek');
      
      // Extrair categorias disponíveis para recomendação
      const categoriasDisponiveis = categorias || [
        "CADASTRO", "PREFERENCIAS", "IMOVEL_IDEAL", "PROXIMIDADES", 
        "EMPREENDIMENTO", "AVALIACAO_CREDITO", "INFORMACOES_COMPLEMENTARES"
      ];
      
      // Lógica para determinar próxima categoria base nas respostas atuais
      const categoriaAtual = perguntas?.[0]?.categoria || "CADASTRO";
      const proxCategoria = getProximaCategoria(categoriaAtual, categoriasDisponiveis);
      
      // Resposta mockada baseada na categoria atual
      const respostaMock = {
        perguntasRelevantes: perguntas?.map(p => p.id) || [],
        perguntasOcultas: [],
        proximaCategoria: proxCategoria,
        explicacao: "Recomendamos mostrar todas as perguntas disponíveis para obter um perfil completo."
      };
      
      // Delay artificial para simular processamento da IA
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return NextResponse.json(respostaMock);
    }

    // URL correta da API DeepSeek
    const deepseekApiUrl = 'https://api.deepseek.com/v1/chat/completions';
    
    // Chamada à API DeepSeek
    const deepseekResponse = await fetch(deepseekApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `Você é um assistente especializado em otimizar fluxos de perguntas para aplicações imobiliárias.
                     Sua tarefa é analisar as respostas já dadas pelo usuário e determinar quais perguntas são mais relevantes
                     mostrar, pular ou modificar com base no perfil do usuário que está se formando.`
          },
          {
            role: "user",
            content: `Com base nas respostas já fornecidas pelo usuário: ${JSON.stringify(respostas)},
                     analise a lista de perguntas a seguir e retorne APENAS UM OBJETO JSON com as seguintes informações:
                     1. perguntasRelevantes: array com os IDs das perguntas que devem ser mostradas ao usuário
                     2. perguntasOcultas: array com os IDs das perguntas que podem ser puladas
                     3. proximaCategoria: string com a categoria recomendada para ser mostrada após a atual
                     4. explicacao: breve justificativa sobre a lógica utilizada
                     
                     Perguntas disponíveis: ${JSON.stringify(perguntas)}
                     Categorias disponíveis: ${JSON.stringify(categorias)}
                     
                     IMPORTANTE: Retorne APENAS o objeto JSON sem nenhum outro texto.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.2
      })
    });

    if (!deepseekResponse.ok) {
      throw new Error(`Erro na chamada à API DeepSeek: ${deepseekResponse.statusText}`);
    }

    const data = await deepseekResponse.json();
    
    // Extrair o JSON da resposta
    let resposta = {};
    try {
      // Procura por um objeto JSON na resposta
      const responseContent = data.choices[0].message.content;
      resposta = JSON.parse(responseContent.trim());
    } catch (error) {
      console.error("Erro ao extrair JSON da resposta DeepSeek:", error);
      return NextResponse.json(
        { erro: 'Falha ao processar resposta da IA' },
        { status: 500 }
      );
    }

    return NextResponse.json(resposta);
  } catch (error) {
    console.error("Erro ao otimizar perguntas:", error);
    return NextResponse.json(
      { erro: 'Falha na integração com DeepSeek' },
      { status: 500 }
    );
  }
}

// Função auxiliar para determinar a próxima categoria
function getProximaCategoria(categoriaAtual: string, categoriasDisponiveis: string[]): string {
  const ordemCategorias = [
    "CADASTRO", 
    "PREFERENCIAS", 
    "IMOVEL_IDEAL", 
    "PROXIMIDADES", 
    "EMPREENDIMENTO", 
    "AVALIACAO_CREDITO", 
    "INFORMACOES_COMPLEMENTARES"
  ];
  
  // Encontrar o índice da categoria atual
  const indiceAtual = ordemCategorias.indexOf(categoriaAtual);
  
  // Se não encontrou ou é a última categoria, retorna a primeira disponível
  if (indiceAtual === -1 || indiceAtual >= ordemCategorias.length - 1) {
    return categoriasDisponiveis[0] || "CADASTRO";
  }
  
  // Caso contrário, retorna a próxima na ordem
  return ordemCategorias[indiceAtual + 1];
}
