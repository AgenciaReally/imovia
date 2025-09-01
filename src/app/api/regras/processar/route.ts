import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { regrasEngine, RespostasUsuario } from "@/lib/regras-negocio-engine";

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
    const { respostas, etapaAtual } = dados;

    if (!respostas || typeof respostas !== 'object') {
      return NextResponse.json(
        { error: "Respostas são obrigatórias" },
        { status: 400 }
      );
    }

    console.log('📋 Processando regras de negócio para usuário:', session.user.email);
    console.log('🎯 Etapa atual:', etapaAtual);
    console.log('📝 Respostas recebidas:', Object.keys(respostas).length);

    // Processar regras usando o engine
    const resultados = await regrasEngine.processarRegras(respostas as RespostasUsuario);
    
    // Extrair ações necessárias
    const acoes: any = {
      continuar: true,
      encerrar: false,
      mensagemEncerramento: null,
      perguntasParaCriar: [],
      perguntasParaOcultar: [],
      calculosFinanceiros: null,
      regrasAplicadas: []
    };

    let deveEncerrar = false;

    for (const resultado of resultados) {
      if (resultado.ativada) {
        acoes.regrasAplicadas.push({
          nome: resultado.regra.nome,
          tipo: resultado.regra.tipo,
          acao: resultado.acao
        });

        switch (resultado.acao) {
          case 'ENCERRAR':
            deveEncerrar = true;
            acoes.encerrar = true;
            acoes.continuar = false;
            acoes.mensagemEncerramento = resultado.dados?.mensagem;
            break;

          case 'CRIAR_PERGUNTA':
            if (resultado.dados?.perguntasParaCriar) {
              acoes.perguntasParaCriar.push(...resultado.dados.perguntasParaCriar);
            }
            break;

          case 'OCULTAR_PERGUNTA':
            if (resultado.dados?.perguntasParaOcultar) {
              acoes.perguntasParaOcultar.push(...resultado.dados.perguntasParaOcultar);
            }
            break;

          case 'CONTINUAR':
            if (resultado.dados?.calculosFinanceiros) {
              acoes.calculosFinanceiros = resultado.dados.calculosFinanceiros;
            }
            break;
        }

        // Se deve encerrar, parar processamento
        if (deveEncerrar) break;
      }
    }

    console.log('✅ Regras processadas:', acoes.regrasAplicadas.length);
    console.log('🎬 Ações geradas:', {
      encerrar: acoes.encerrar,
      perguntasParaCriar: acoes.perguntasParaCriar.length,
      perguntasParaOcultar: acoes.perguntasParaOcultar.length,
      temCalculos: !!acoes.calculosFinanceiros
    });

    return NextResponse.json({
      success: true,
      acoes,
      etapaAtual,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Erro ao processar regras de negócio:", error);
    return NextResponse.json(
      { 
        error: "Erro interno do servidor",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
