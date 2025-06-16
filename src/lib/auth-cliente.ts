import * as argon2 from 'argon2';
import { prisma } from './prisma';

// Opções para o Argon2 (ajustadas para segurança)
const hashingOptions = {
  // Número de iterações (custo de tempo)
  timeCost: 3,
  // Uso de memória
  memoryCost: 65536, // 64MB
  // Grau de paralelismo
  parallelism: 1,
  // Tamanho do salt
  saltLength: 16,
  // Tipo do Argon2 (id, i, d)
  type: argon2.argon2id,
};

/**
 * Gera um hash seguro de uma senha usando Argon2
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password, hashingOptions);
  } catch (error) {
    console.error('Erro ao criar hash da senha:', error);
    throw new Error('Falha ao processar senha');
  }
}

/**
 * Interface para o retorno da função registerCliente
 */
export interface RegisterClienteResult {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    [key: string]: any;
  };
}

/**
 * Registra um novo usuário cliente
 */
export async function registerCliente(data: {
  name: string;
  email: string;
  telefone?: string;
  password: string;
}): Promise<RegisterClienteResult> {
  try {
    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, message: 'Email já cadastrado' };
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.password);

    // Criar o usuário cliente
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        telefone: data.telefone,
        password: hashedPassword,
        role: 'CLIENTE',
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error('Erro durante cadastro de cliente:', error);
    return { success: false, message: 'Erro ao cadastrar usuário' };
  }
}
