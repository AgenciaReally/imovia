import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

// Função temporária para criar ou obter usuário para testes
async function criarOuObterUsuarioTemporario() {
  const userTemp = await prisma.user.findFirst({
    where: { email: 'usuario.temp@imovia.com' }
  });

  if (userTemp) return userTemp;

  return await prisma.user.create({
    data: {
      name: 'Usuário Temporário',
      email: 'usuario.temp@imovia.com',
      password: 'senha123', // Apenas para testes
      role: 'CLIENTE'
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Tentar obter usuário da sessão atual
    let usuarioSessao = null;
    try {
      const session = await getServerSession();
      if (session?.user) {
        usuarioSessao = session.user;
        console.log('Usuário autenticado encontrado na sessão:', {
          id: usuarioSessao.id,
          email: usuarioSessao.email,
          name: usuarioSessao.name
        });
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }

    // Verificar se o body é um array de respostas
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { erro: 'Formato inválido. Esperado um array de respostas.' },
        { status: 400 }
      );
    }

    // Processar cada resposta
    const resultados = await Promise.all(
      body.map(async (resposta) => {
        const { perguntaId, resposta: valorResposta, usuarioId, usuarioEmail, usuarioNome, usuarioTelefone } = resposta;
        
        console.log(`Processando resposta para pergunta ${perguntaId}`, { usuarioId, usuarioEmail });

        // Verificar se a pergunta existe
        const pergunta = await prisma.pergunta.findUnique({
          where: { id: perguntaId },
        });

        if (!pergunta) {
          return {
            sucesso: false,
            perguntaId,
            erro: 'Pergunta não encontrada',
          };
        }

        // Salvar a resposta
        const valorRespostaStr = typeof valorResposta === 'object' 
          ? JSON.stringify(valorResposta) 
          : String(valorResposta);

        // Determinar qual usuário usar (prioridade: session > parâmetro > email > temporário)
        let userId = usuarioId;
        
        // Se tiver usuário na sessão, usar ele com prioridade
        if (usuarioSessao?.id && !userId) {
          userId = usuarioSessao.id;
          console.log(`Usando usuário da sessão autenticada: ${userId}`);
        }
        
        // Se não tiver ID de usuário, mas tiver email, tentar encontrar por email
        if (!userId && usuarioEmail) {
          const usuarioExistente = await prisma.user.findUnique({
            where: { email: usuarioEmail }
          });
          
          if (usuarioExistente) {
            userId = usuarioExistente.id;
            console.log(`Encontrado usuário existente pelo email ${usuarioEmail}: ${userId}`);
          }
        }
        
        // Se ainda não tiver usuário, criar um novo ou usar temporário
        if (!userId) {
          if (usuarioEmail && usuarioNome) {
            // Criar novo usuário
            try {
              const novoUsuario = await prisma.user.create({
                data: {
                  name: usuarioNome,
                  email: usuarioEmail,
                  telefone: usuarioTelefone,
                  password: Math.random().toString(36).substring(2), // Senha aleatória
                  role: 'CLIENTE'
                }
              });
              
              userId = novoUsuario.id;
              console.log(`Criado novo usuário para ${usuarioEmail}: ${userId}`);
            } catch (error) {
              console.error(`Erro ao criar usuário para ${usuarioEmail}:`, error);
              // Usar usuário temporário como fallback
              const userTemp = await criarOuObterUsuarioTemporario();
              userId = userTemp.id;
            }
          } else {
            // Usar usuário temporário
            const userTemp = await criarOuObterUsuarioTemporario();
            userId = userTemp.id;
          }
        }
        
        // Criar resposta com conexões explícitas às entidades relacionadas
        const respostaRegistrada = await prisma.resposta.create({
          data: {
            valor: valorRespostaStr,
            pergunta: {
              connect: { id: perguntaId }
            },
            usuario: {
              connect: { id: userId }
            }
          },
        });

        return {
          sucesso: true,
          id: respostaRegistrada.id,
          perguntaId,
        };
      })
    );

    return NextResponse.json({ resultados });
  } catch (error) {
    console.error('Erro ao processar respostas:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const respostas = await prisma.resposta.findMany({
      include: {
        pergunta: true,
        usuario: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(respostas);
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
