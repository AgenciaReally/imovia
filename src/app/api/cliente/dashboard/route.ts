import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Verificar autenticação
    const session = await getServerSession();
    
    // Em ambiente de desenvolvimento, permitir acesso mesmo sem sessão
    const isDev = process.env.NODE_ENV === 'development';
    
    // Tentar obter o email do usuário da sessão
    let userEmail = session?.user?.email;
    let userName = session?.user?.name || 'Cliente';
    
    // Em ambiente de desenvolvimento, se não tiver email na sessão, usar o último usuário cadastrado
    if (!userEmail && isDev) {
      try {
        const lastUser = await prisma.user.findFirst({
          where: { role: 'CLIENTE' },
          orderBy: { createdAt: 'desc' }
        });
        
        if (lastUser) {
          userEmail = lastUser.email;
          userName = lastUser.name;
        }
      } catch (e) {
        console.error('Erro ao buscar último usuário:', e);
      }
    }
    
    // Se tiver email, buscar usuário no banco para garantir que temos o nome mais atualizado
    if (userEmail) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: userEmail }
        });
        if (user) {
          userName = user.name;
        }
      } catch (e) {
        console.error('Erro ao buscar usuário por email:', e);
      }
    }
    
    // Verificar autorização apenas em ambiente de produção
    if (!isDev && (!session || !session.user)) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Em produção, estes dados viriam do banco de dados
    const data = {
      // Adiciona o nome do usuário aos dados do dashboard
      userName: userName,
      metricas: {
        totalImoveis: 24,
        totalConstrutoras: 8,
        imoveisVisitados: 12,
        simulacoesRealizadas: 5
      },
      graficos: {
        atividadeRecenteMeses: [
          { name: 'Jan', visitas: 4, simulacoes: 2 },
          { name: 'Fev', visitas: 3, simulacoes: 1 },
          { name: 'Mar', visitas: 5, simulacoes: 3 },
          { name: 'Abr', visitas: 7, simulacoes: 4 },
          { name: 'Mai', visitas: 6, simulacoes: 3 },
          { name: 'Jun', visitas: 8, simulacoes: 5 }
        ],
        distribuicaoStatus: [
          { name: 'Disponível', value: 65 },
          { name: 'Reservado', value: 15 },
          { name: 'Vendido', value: 20 }
        ]
      },
      graficoTiposImoveis: [
        { nome: 'Apartamento', quantidade: 14 },
        { nome: 'Casa', quantidade: 6 },
        { nome: 'Terreno', quantidade: 3 },
        { nome: 'Comercial', quantidade: 1 }
      ],
      graficoConstrutoras: [
        { nome: 'Construtora A', quantidade: 5 },
        { nome: 'Construtora B', quantidade: 3 },
        { nome: 'Construtora C', quantidade: 2 },
        { nome: 'Construtora D', quantidade: 1 },
        { nome: 'Outras', quantidade: 3 }
      ],
      ultimosImoveis: [
        {
          id: '1',
          titulo: 'Apartamento Luxo',
          preco: 'R$ 850.000',
          endereco: 'Rua das Flores, 123 - Centro',
          imagem: '/images/imoveis/apartamento-luxo.jpg'
        },
        {
          id: '2',
          titulo: 'Casa Moderna',
          preco: 'R$ 1.200.000',
          endereco: 'Av. Principal, 456 - Jardins',
          imagem: '/images/imoveis/casa-moderna.jpg'
        },
        {
          id: '3',
          titulo: 'Terreno Amplo',
          preco: 'R$ 450.000',
          endereco: 'Rua das Palmeiras, 789 - Novo Horizonte',
          imagem: '/images/imoveis/terreno-amplo.jpg'
        }
      ],
      ultimasSimulacoes: [
        {
          id: '1',
          imovel: 'Apartamento Luxo',
          valor: 'R$ 850.000',
          parcela: 'R$ 5.230,45',
          data: '01/06/2025'
        },
        {
          id: '2',
          imovel: 'Casa Moderna',
          valor: 'R$ 1.200.000',
          parcela: 'R$ 7.450,20',
          data: '28/05/2025'
        }
      ]
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Erro ao processar dashboard do cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
