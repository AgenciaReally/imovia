import { jwtVerify } from 'jose';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  exp?: number;
  [key: string]: any;
}

/**
 * Verifica se o usuário está logado pelo token JWT armazenado no cookie
 * Esta função é para uso no lado do cliente
 */
export async function getUserSession(): Promise<UserSession | null> {
  try {
    // Verificar se estamos no lado do cliente
    if (typeof window === 'undefined') {
      return null;
    }

    // Verificar se estamos em ambiente de desenvolvimento local
    const isDevelopment = process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost';
    
    // Em desenvolvimento local, podemos ter problemas com a API de sessão
    // então vamos tentar fazer a requisição com um timeout para não bloquear a UI
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 segundos de timeout

    try {
      // Fazer uma requisição para a API que verifica o token
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para enviar cookies
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      
      if (!data.user) {
        return null;
      }
      
      return data.user as UserSession;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Se estamos em desenvolvimento e houve um erro de conexão,
      // podemos verificar se há um token no localStorage como fallback
      if (isDevelopment) {
        console.warn('Usando fallback para verificação de sessão em ambiente de desenvolvimento');
        const localUser = localStorage.getItem('user-session');
        if (localUser) {
          try {
            return JSON.parse(localUser) as UserSession;
          } catch {
            return null;
          }
        }
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Erro ao verificar sessão do usuário:', error);
    return null;
  }
}
