import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { regrasEngine } from "@/lib/regras-negocio-engine";
import { deepseekQuestions, ContextoDeepseek } from "@/lib/deepseek-dynamic-questions";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const dados = await req.json();
    const { respostas, etapaAtual, forcarGeracao = false } = dados;

    if (!respostas || typeof respostas !== 'object') {
      return NextResponse.json(
        { error: "Respostas são obrigatórias" },
        { status: 400 }
      );
    }

    console.log('🎯 Gerando perguntas dinâmicas para usuário:', session.user.email);
    console.log('📋 Etapa atual:', etapaAtual, '| Respostas:', Object.keys(respostas).length);

    // Primeiro, processar regras de negócio para determinar contexto
    const resultadosRegras = await regrasEngine.processarRegras(respostas);
    const regrasAtivadas = resultadosRegras.filter(r => r.ativada);

    console.log('⚙️ Regras ativadas:', regrasAtivadas.map(r => r.regra.nome));

    // Verificar se precisa gerar novas perguntas
    const precisaNovasPerguntas = forcarGeracao || 
      await deepseekQuestions.analisarNecessidadeNovasPerguntas(respostas, etapaAtual);

    if (!precisaNovasPerguntas && regrasAtivadas.length === 0) {
      return NextResponse.json({
        success: true,
        perguntasDinamicas: [],
        regrasAplicadas: [],
        necessitaPerguntas: false,
        message: "Não há necessidade de perguntas adicionais no momento"
      });
    }

    // Extrair perfil do usuário das respostas
    const perfilUsuario = extrairPerfilUsuario(respostas);

    // Construir contexto para Deepseek
    const contexto: ContextoDeepseek = {
      respostasExistentes: respostas,
      etapaAtual,
      regrasAplicadas: regrasAtivadas,
      perfilUsuario
    };

    const perguntasDinamicas: any[] = [];
    const tiposRegrasAtivadas = new Set(regrasAtivadas.map(r => r.regra.tipo));

    // Gerar perguntas para cada tipo de regra ativada
    for (const tipoRegra of tiposRegrasAtivadas) {
      if (tipoRegra !== 'ENCERRAMENTO') { // Não gerar perguntas se deve encerrar
        try {
          const perguntasTipo = await deepseekQuestions.gerarPerguntasDinamicas(
            contexto, 
            tipoRegra as any
          );
          perguntasDinamicas.push(...perguntasTipo);
        } catch (error) {
          console.error(`❌ Erro ao gerar perguntas para ${tipoRegra}:`, error);
        }
      }
    }

    // Se não há regras específicas ativadas, mas precisa de perguntas, usar contexto geral
    if (perguntasDinamicas.length === 0 && precisaNovasPerguntas) {
      try {
        const perguntasGerais = await deepseekQuestions.gerarPerguntasDinamicas(
          contexto,
          'FINANCIAMENTO' // Usar financiamento como padrão
        );
        perguntasDinamicas.push(...perguntasGerais);
      } catch (error) {
        console.error('❌ Erro ao gerar perguntas gerais:', error);
      }
    }

    // Salvar perguntas dinâmicas no banco (opcional, para auditoria)
    if (perguntasDinamicas.length > 0) {
      try {
        await salvarPerguntasDinamicas(session.user.id, perguntasDinamicas, etapaAtual);
      } catch (error) {
        console.warn('⚠️ Erro ao salvar perguntas dinâmicas no banco:', error);
      }
    }

    console.log('✅ Perguntas dinâmicas geradas:', perguntasDinamicas.length);

    return NextResponse.json({
      success: true,
      perguntasDinamicas,
      regrasAplicadas: regrasAtivadas.map(r => ({
        nome: r.regra.nome,
        tipo: r.regra.tipo,
        acao: r.acao
      })),
      necessitaPerguntas: perguntasDinamicas.length > 0,
      perfilUsuario,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Erro ao gerar perguntas dinâmicas:", error);
    return NextResponse.json(
      { 
        error: "Erro interno do servidor",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

function extrairPerfilUsuario(respostas: Record<string, string>) {
  const perfil: any = {};

  // Extrair renda
  for (const [key, value] of Object.entries(respostas)) {
    const keyLower = key.toLowerCase();
    const valueLower = String(value || '').toLowerCase();

    if (keyLower.includes('renda') || keyLower.includes('salario') || 
        valueLower.includes('renda') || valueLower.includes('salário')) {
      const valor = extrairValor(value);
      if (valor > 0) perfil.renda = valor;
    }

    if (keyLower.includes('entrada') || keyLower.includes('recurso') ||
        valueLower.includes('entrada') || valueLower.includes('recurso')) {
      const valor = extrairValor(value);
      if (valor > 0) perfil.entrada = valor;
    }

    if (keyLower.includes('objetivo') || keyLower.includes('finalidade')) {
      perfil.objetivo = value;
    }

    if (keyLower.includes('local') || keyLower.includes('região') || 
        keyLower.includes('bairro') || keyLower.includes('cidade')) {
      perfil.localizacao = value;
    }
  }

  return perfil;
}

function extrairValor(texto: string | any): number {
  const textoStr = String(texto || '');
  const numeroLimpo = textoStr.replace(/[^\d.,]/g, '').replace(',', '.');
  const valor = parseFloat(numeroLimpo);
  return isNaN(valor) ? 0 : valor;
}

async function salvarPerguntasDinamicas(
  userId: string, 
  perguntas: any[], 
  etapa: number
) {
  try {
    // Salvar log das perguntas dinâmicas geradas
    // Temporariamente comentado até que o schema seja aplicado
    console.log('📝 Log perguntas dinâmicas:', { userId, etapa, count: perguntas.length });
    /* 
    await prisma.perguntaDinamica.create({
      data: {
        userId,
        etapa,
        perguntas: perguntas,
        timestamp: new Date()
      }
    });
    */
  } catch (error) {
    console.error('Erro ao salvar perguntas dinâmicas:', error);
  }
}
