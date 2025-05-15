// Importando o cliente Prisma gerado no caminho correto
const { PrismaClient } = require('../src/generated/prisma');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed básico do banco de dados...');

  // Criar usuário admin
  const adminPassword = await argon2.hash('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@imovia.com.br' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@imovia.com.br',
      password: adminPassword,
      role: 'ADMIN',
      telefone: '11999999999',
    },
  });
  console.log('Admin criado:', admin.email);

  // Criar construtora de exemplo
  const construtora = await prisma.construtora.upsert({
    where: { cnpj: '12345678000199' },
    update: {},
    create: {
      nome: 'Construtora Exemplo',
      cnpj: '12345678000199',
      telefone: '11999998888',
      email: 'contato@construtora-exemplo.com.br',
      endereco: 'Av. Paulista, 1000, São Paulo - SP',
      usuarios: {
        create: {
          name: 'Gerente Construtora',
          email: 'gerente@construtora-exemplo.com.br',
          password: await argon2.hash('construtora123'),
          role: 'CONSTRUTORA',
          telefone: '11988887777',
        }
      }
    },
    include: {
      usuarios: true,
    }
  });
  console.log('Construtora criada:', construtora.nome);
  console.log('Usuário da construtora criado:', construtora.usuarios[0].email);

  console.log('Seed básico concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
