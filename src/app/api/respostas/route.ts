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

    // Suportar tanto array quanto objeto único
    const respostas = Array.isArray(body) ? body : [body];

    // Processar cada resposta
    const resultados = await Promise.all(
      respostas.map(async (resposta: any) => {
        const { perguntaId, valor, userId: usuarioId, usuarioEmail } = resposta
        
        console.log(`🔥 Resposta recebida:`, resposta)
        console.log(`🔥 Campos extraídos:`, { perguntaId, valor, usuarioId, usuarioEmail })

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

        // Debug: verificar o que está chegando na API
        console.log(`🔥 API recebeu:`, {
          perguntaId,
          valor,
          tipoValor: typeof valor,
          valorProcessado: typeof valor === 'object' ? JSON.stringify(valor) : String(valor)
        })

        // Salvar a resposta
        const valorRespostaStr = typeof valor === 'object' 
          ? JSON.stringify(valor) 
          : String(valor);

        // Determinar qual usuário usar (prioridade: session > parâmetro > email > temporário)
        let userId;
        
        // PRIORIDADE 1: Se tiver usuário na sessão, SEMPRE usar ele
        if (usuarioSessao?.id) {
          userId = usuarioSessao.id;
          console.log(`🔐 Usando usuário AUTENTICADO da sessão: ${userId} (${usuarioSessao.email})`);
        } else {
          // PRIORIDADE 2: usar parâmetro enviado pelo frontend
          userId = usuarioId;
          console.log(`📱 Usando usuário do frontend: ${userId}`);
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
        
        // Se ainda não tiver usuário, usar temporário
        if (!userId) {
          const userTemp = await criarOuObterUsuarioTemporario();
          userId = userTemp.id;
          console.log(`Usando usuário temporário: ${userId}`);
        }
        
        // IMPORTANTE: Verificar se o usuário realmente existe antes de conectar
        const usuarioExisteCheck = await prisma.user.findUnique({
          where: { id: userId }
        });
        
        if (!usuarioExisteCheck) {
          console.error(`❌ ERRO: Usuário ${userId} não encontrado! Criando usuário temporário...`);
          const userTemp = await criarOuObterUsuarioTemporario();
          userId = userTemp.id;
          console.log(`✅ Usuário temporário criado/obtido: ${userId}`);
        } else {
          console.log(`✅ Usuário ${userId} confirmado no banco`);
        }
        
        // Verificar se já existe uma resposta para este usuário + pergunta
        const respostaExistente = await prisma.resposta.findFirst({
          where: {
            userId: userId,
            perguntaId: perguntaId
          }
        });

        let respostaRegistrada;
        
        if (respostaExistente) {
          // Se existe, atualizar
          respostaRegistrada = await prisma.resposta.update({
            where: { id: respostaExistente.id },
            data: {
              valor: valorRespostaStr,
              updatedAt: new Date()
            }
          });
          console.log(`✏️ Resposta atualizada para pergunta ${perguntaId}: ${valorRespostaStr}`);
        } else {
          // Se não existe, criar nova
          respostaRegistrada = await prisma.resposta.create({
            data: {
              valor: valorRespostaStr,
              pergunta: {
                connect: { id: perguntaId }
              },
              usuario: {
                connect: { id: userId }
              }
            }
          });
          console.log(`✅ Nova resposta criada para pergunta ${perguntaId}: ${valorRespostaStr}`);
        }

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
