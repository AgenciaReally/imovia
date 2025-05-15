import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Instância do Prisma com singleton para evitar múltiplas conexões
import { prisma } from '@/lib/prisma';

// Não criar nova instância, usar a importada do singleton

// Tipos de notificações que o sistema pode gerar
export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  userId?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  entityType?: string; // 'construtora', 'usuario', 'resposta', 'imovel', etc.
  entityId?: string;
  link?: string;
}

// GET - Buscar notificações dos últimos registros
export async function GET(request: NextRequest) {
  try {
    // Parâmetros de paginação e filtro
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '15');
    
    // Buscar as últimas notificações em tempo real
    const notificacoes: Notification[] = [];
    
    // 1. Últimos usuários cadastrados
    try {
      const ultimosUsuarios = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      
      for (const usuario of ultimosUsuarios) {
        notificacoes.push({
          id: `usuario-${usuario.id}`,
          title: "Novo usuário cadastrado",
          message: `${usuario.name || 'Novo usuário'} se cadastrou na plataforma`,
          read: false,
          createdAt: usuario.createdAt || new Date(),
          type: 'success',
          entityType: 'usuario',
          entityId: usuario.id,
          link: `/painel/admin/usuarios?id=${usuario.id}`
        });
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
    
    // 2. Últimas construtoras cadastradas
    try {
      const ultimasConstrutoras = await prisma.construtora.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3
      });
      
      for (const construtora of ultimasConstrutoras) {
        notificacoes.push({
          id: `construtora-${construtora.id}`,
          title: "Nova construtora",
          message: `${construtora.nome || 'Nova construtora'} foi cadastrada`,
          read: false,
          createdAt: construtora.createdAt || new Date(),
          type: 'success',
          entityType: 'construtora',
          entityId: construtora.id,
          link: `/painel/admin/construtoras?id=${construtora.id}`
        });
      }
    } catch (error) {
      console.error('Erro ao buscar construtoras:', error);
    }
    
    // 3. Últimas respostas do simulador
    try {
      const ultimasRespostas = await prisma.resposta.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          usuario: true,
          pergunta: true
        }
      });
      
      for (const resposta of ultimasRespostas) {
        const nomeUsuario = resposta.usuario?.name || 'Um usuário';
        const perguntaTexto = resposta.pergunta?.texto || 'uma pergunta';
        
        notificacoes.push({
          id: `resposta-${resposta.id}`,
          title: "Nova resposta no simulador",
          message: `${nomeUsuario} respondeu: ${perguntaTexto}`,
          read: false,
          createdAt: resposta.createdAt || new Date(),
          type: 'info',
          entityType: 'resposta',
          entityId: resposta.id,
          link: `/painel/admin/respostas?id=${resposta.userId}`
        });
      }
    } catch (error) {
      console.error('Erro ao buscar respostas:', error);
    }
    
    // 4. Últimas solicitações de relatório
    try {
      const ultimosRelatorios = await prisma.relatorio.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          usuario: true
        }
      });
      
      for (const relatorio of ultimosRelatorios) {
        const nomeUsuario = relatorio.usuario?.name || 'Um usuário';
        
        notificacoes.push({
          id: `relatorio-${relatorio.id}`,
          title: "Relatório solicitado",
          message: `${nomeUsuario} solicitou um relatório personalizado`,
          read: false,
          createdAt: relatorio.createdAt || new Date(),
          type: 'info',
          entityType: 'relatorio',
          entityId: relatorio.id,
          link: `/painel/admin/relatorios?id=${relatorio.id}`
        });
      }
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
    }
    
    // 5. Últimos imóveis cadastrados
    try {
      const ultimosImoveis = await prisma.imovel.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3
      });
      
      for (const imovel of ultimosImoveis) {
        notificacoes.push({
          id: `imovel-${imovel.id}`,
          title: "Novo imóvel cadastrado",
          message: `Imóvel ${imovel.titulo || imovel.id} foi adicionado`,
          read: false,
          createdAt: imovel.createdAt || new Date(),
          type: 'success',
          entityType: 'imovel',
          entityId: imovel.id,
          link: `/painel/admin/imoveis?id=${imovel.id}`
        });
      }
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    }
    
    // Ordenar todas as notificações por data de criação (mais recentes primeiro)
    const notificacoesOrdenadas = notificacoes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    
    // Contar notificações não lidas
    const unreadCount = notificacoesOrdenadas.filter(n => !n.read).length;
    
    return NextResponse.json({ 
      notificacoes: notificacoesOrdenadas, 
      unreadCount,
      total: notificacoesOrdenadas.length
    });
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar notificações' },
      { status: 500 }
    );
  }
}

// PATCH - Marcar notificação como lida (para notificações geradas dinamicamente)
export async function PATCH(request: NextRequest) {
  try {    
    const { id, read = true } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID da notificação é obrigatório' },
        { status: 400 }
      );
    }

    // Como as notificações são geradas dinamicamente, apenas retornamos sucesso
    // Em uma implementação completa, armazenaríamos as notificações lidas em um banco
    return NextResponse.json({ 
      success: true, 
      notificacao: { id, read } 
    });
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar notificação' },
      { status: 500 }
    );
  }
}

// Função antiga para gerar notificações baseadas em dados existentes - não mais usada
// Mantida apenas como referência, todas as consultas agora são feitas diretamente no GET
async function gerarNotificacoesDoSistema(role: string) {
  return []; // Função obsoleta, não mais utilizada
}
