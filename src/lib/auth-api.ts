import { prisma } from './prisma';
import * as argon2 from 'argon2';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

// Definir enum UserRole igual ao modelo do Prisma
type UserRole = 'ADMIN' | 'CONSTRUTORA' | 'CLIENTE';

// Token expira em 12 horas
const TOKEN_EXPIRATION = 12 * 60 * 60; // em segundos

// Chave secreta para JWT - em produção, isso deveria vir de variáveis de ambiente
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'seu_segredo_super_secreto_aqui_pelo_menos_32_caracteres');

/**
 * Autentica um usuário verificando email e senha
 * Este método usa argon2 e deve ser usado apenas em rotas API, não no middleware
 */
export async function authenticateUser(email: string, password: string) {
  try {
    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
      }
    });

    // Se não encontrar usuário ou senha não bater, retorna null
    if (!user) return null;
    
    // Verificar senha
    const passwordValid = await verifyPassword(password, user.password);
    if (!passwordValid) return null;

    // Remover senha do objeto antes de retornar
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return null;
  }
}

/**
 * Verifica se a senha informada coincide com o hash armazenado
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    return false;
  }
}

/**
 * Cria um token JWT e salva no cookie
 * @param userId ID do usuário
 * @param email Email do usuário
 * @param role Papel do usuário
 * @param expiration Tempo de expiração em segundos (opcional, padrão: 12 horas)
 */
export async function createSessionToken(userId: string, email: string, role: UserRole, expiration?: number) {
  try {
    // Usar o tempo de expiração fornecido ou o padrão
    const tokenExpiration = expiration || TOKEN_EXPIRATION;
    
    // Criar payload do token
    const payload = {
      sub: userId,
      id: userId, // Adicionar id explicitamente para facilitar acesso
      email,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + tokenExpiration,
    };

    // Assinar token
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(JWT_SECRET);

    // Definir o cookie
    try {
      // @ts-ignore
      cookies().set({
        name: 'auth-token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: tokenExpiration,
        path: '/',
      });
    } catch (e) {
      console.error('Erro ao definir cookie:', e);
    }

    return token;
  } catch (error) {
    console.error('Erro ao criar token de sessão:', error);
    return null;
  }
}

/**
 * Encerra a sessão (remove o cookie)
 */
export function logoutUser() {
  try {
    // @ts-ignore
    cookies().delete('auth-token');
  } catch (e) {
    console.error('Erro ao excluir cookie:', e);
  }
}
