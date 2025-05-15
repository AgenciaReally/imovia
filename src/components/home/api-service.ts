"use client";

// Interface para as respostas do formulário
export interface RespostaFormulario {
  perguntaId: string;
  resposta: any;
  usuarioId?: string;
  usuarioNome?: string;
  usuarioEmail?: string;
  usuarioTelefone?: string;
}

// Enviar as respostas para o backend
export async function enviarRespostas(
  respostas: Record<string, any>,
  dadosUsuario: {
    nome?: string;
    email?: string;
    telefone?: string;
    userId?: string;
    token?: string;
  }
): Promise<boolean> {
  try {
    // Formatar as respostas no formato esperado pelo backend
    const respostasFormatadas: RespostaFormulario[] = Object.entries(respostas)
      .filter(([chave]) => chave !== 'userId' && chave !== 'token') // Filtrar campos internos
      .map(([perguntaId, resposta]) => ({
        perguntaId,
        resposta,
        usuarioId: dadosUsuario.userId || respostas.userId, // Usar userId se disponível
        usuarioNome: dadosUsuario.nome,
        usuarioEmail: dadosUsuario.email,
        usuarioTelefone: dadosUsuario.telefone,
      })
    );
    
    console.log('Enviando respostas com dados de usuário:', {
      temUserId: Boolean(dadosUsuario.userId || respostas.userId),
      userId: dadosUsuario.userId || respostas.userId,
      email: dadosUsuario.email,
      totalRespostas: respostasFormatadas.length
    });
    
    // Enviar para o endpoint
    const response = await fetch('/api/respostas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(respostasFormatadas),
    });
    
    if (!response.ok) {
      throw new Error('Falha ao enviar respostas');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar respostas:', error);
    return false;
  }
}

// Solicitar um relatório completo
export async function solicitarRelatorio(
  email: string,
  nome?: string,
  telefone?: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/relatorio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        nome,
        telefone,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Falha ao solicitar relatório');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao solicitar relatório:', error);
    return false;
  }
}
