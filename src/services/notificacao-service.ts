// Serviço para gerenciar notificações
import { Notification } from '@/app/api/notificacoes/route';

// Função para buscar notificações
export async function buscarNotificacoes(params?: {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}) {
  try {
    // Construir query string com parâmetros
    const queryParams = new URLSearchParams();
    
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params?.offset) {
      queryParams.append('offset', params.offset.toString());
    }
    
    if (params?.unreadOnly) {
      queryParams.append('unreadOnly', params.unreadOnly.toString());
    }
    
    const queryString = queryParams.toString();
    const url = `/api/notificacoes${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Falha ao buscar notificações');
    }
    
    const data = await response.json();
    return {
      notificacoes: data.notificacoes as Notification[],
      unreadCount: data.unreadCount as number,
      total: data.total as number,
    };
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return {
      notificacoes: [],
      unreadCount: 0,
      total: 0,
    };
  }
}

// Função para marcar notificação como lida
export async function marcarNotificacaoComoLida(id: string, read: boolean = true) {
  try {
    const response = await fetch('/api/notificacoes', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, read }),
    });
    
    if (!response.ok) {
      throw new Error('Falha ao marcar notificação como lida');
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    return false;
  }
}

// Função para formatar tempo relativo
export function formatarTempoRelativo(data: Date) {
  const agora = new Date();
  const dataNotificacao = new Date(data);
  const diferencaEmMs = agora.getTime() - dataNotificacao.getTime();
  
  const segundos = Math.floor(diferencaEmMs / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  if (dias > 0) {
    return dias === 1 ? '1 dia atrás' : `${dias} dias atrás`;
  } else if (horas > 0) {
    return horas === 1 ? '1 hora atrás' : `${horas}h atrás`;
  } else if (minutos > 0) {
    return minutos === 1 ? '1 minuto atrás' : `${minutos}m atrás`;
  } else {
    return segundos <= 10 ? 'agora mesmo' : `${segundos}s atrás`;
  }
}
