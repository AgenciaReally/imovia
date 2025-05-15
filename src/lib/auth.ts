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
 * Verifica se uma senha corresponde ao hash armazenado
 */
export async function verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    return false;
  }
}

/**
 * Simula autenticação de usuário (substituir pela implementação real com banco de dados)
 */
export async function authenticate(email: string, password: string) {
  try {
    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'Usuário não encontrado' };
    }

    // Verificar senha
    const passwordMatch = await verifyPassword(user.password, password);
    if (!passwordMatch) {
      return { success: false, message: 'Senha incorreta' };
    }

    // Autenticação bem-sucedida
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error('Erro durante autenticação:', error);
    return { success: false, message: 'Erro durante autenticação' };
  }
}

/**
 * Registra um novo usuário construtora
 */
export async function registerConstrutora(data: {
  nomeRepresentante: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  telefone: string;
  senha: string;
}) {
  try {
    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, message: 'Email já cadastrado' };
    }

    // Verificar se o CNPJ já está em uso
    const existingConstrutora = await prisma.construtora.findUnique({
      where: { cnpj: data.cnpj },
    });

    if (existingConstrutora) {
      return { success: false, message: 'CNPJ já cadastrado' };
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.senha);

    // Criar a construtora e o usuário em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar a construtora
      const construtora = await tx.construtora.create({
        data: {
          nome: data.razaoSocial,
          cnpj: data.cnpj,
          telefone: data.telefone,
          email: data.email,
          endereco: '',
        },
      });

      // Criar o usuário vinculado à construtora
      const user = await tx.user.create({
        data: {
          name: data.nomeRepresentante,
          email: data.email,
          password: hashedPassword,
          role: 'CONSTRUTORA',
          construtora: {
            connect: {
              id: construtora.id,
            },
          },
        },
      });

      return { construtora, user };
    });

    const { password: _, ...userWithoutPassword } = result.user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error('Erro durante cadastro:', error);
    return { success: false, message: 'Erro ao cadastrar usuário' };
  }
}
