import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Chave secreta para JWT - em produção, isso deveria vir de variáveis de ambiente
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'seu_segredo_super_secreto_aqui_pelo_menos_32_caracteres');

// Interface para a sessão do usuário
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Session {
  user: SessionUser;
}

/**
 * Função para verificar a sessão do usuário
 * Esta função verifica o token JWT armazenado no cookie 'auth-token'
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    // Obter o token do cookie
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    // Verificar o token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Verificar se o token expirou
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    // Retornar os dados do usuário
    return {
      user: {
        id: payload.id || payload.sub as string,
        email: payload.email as string,
        name: payload.name as string,
        role: payload.role as string
      }
    };
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    return null;
  }
}
