import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Criar usuário admin
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@imovia.com' }
    });
    
    let adminCreated = false;
    if (!adminExists) {
      await prisma.user.create({
        data: {
          email: 'admin@imovia.com',
          name: 'Administrador',
          password: 'admin123', // Na produção, isso seria um hash
          role: 'ADMIN'
        }
      });
      adminCreated = true;
    }
    
    // Criar algumas construtoras
    const construtoras = [
      {
        nome: 'Alpha Construtora',
        cnpj: '12345678000190',
        telefone: '11999990000',
        email: 'contato@alphaconstrutora.com',
        endereco: 'Av. Paulista, 1000, São Paulo, SP',
        ativa: true
      },
      {
        nome: 'Beta Incorporadora',
        cnpj: '98765432000190',
        telefone: '11988880000',
        email: 'contato@betaincorporadora.com',
        endereco: 'Rua Oscar Freire, 500, São Paulo, SP',
        ativa: true
      },
      {
        nome: 'Gamma Empreendimentos',
        cnpj: '45678912000190',
        telefone: '11977770000',
        email: 'contato@gammaempreendimentos.com',
        endereco: 'Av. Brigadeiro Faria Lima, 1500, São Paulo, SP',
        ativa: true
      }
    ];
    
    let construtorasCreated = 0;
    for (const construtora of construtoras) {
      const exists = await prisma.construtora.findUnique({
        where: { cnpj: construtora.cnpj }
      });
      
      if (!exists) {
        await prisma.construtora.create({
          data: construtora
        });
        construtorasCreated++;
      }
    }
    
    // Não vamos criar imóveis no banco local, apenas usar a API da Orulo
    
    return NextResponse.json({ 
      success: true, 
      message: 'Dados iniciais criados com sucesso',
      adminCreated,
      construtorasCreated,
      note: 'Imóveis serão buscados apenas da API da Orulo'
    });
  } catch (error) {
    console.error('Erro ao criar dados iniciais:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao criar dados iniciais',
      details: error
    }, { status: 500 });
  }
}
