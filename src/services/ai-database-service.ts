import { prisma } from '@/lib/prisma';

/**
 * Serviço para interação da AI com o banco de dados
 * Implementa métodos para criação, consulta e atualização de entidades
 */
export class AIDatabaseService {
  
  // ID fixo da construtora padrão para simplificar criação de imóveis
  private static readonly CONSTRUTORA_PADRAO_ID = 'cma2kznc30000l7mcbmjhc9ys';

  /**
   * Criar um imóvel - versão simplificada usando construtora padrão
   */
  static async createImovel(data: {
    titulo: string;
    descricao?: string;
    preco: number;
    quartos?: number;
    banheiros?: number;
    area?: number;
    endereco?: string;
    status?: string;
  }) {
    console.log('===== INICIANDO CRIAÇÃO DE IMÓVEL SIMPLIFICADA =====');
    console.log('Dados recebidos para criar imóvel:', data);
    try {
      console.log('Usando construtora padrão ID:', this.CONSTRUTORA_PADRAO_ID);

      console.log('Tentando criar imóvel com estes dados:');
      console.log('  - título:', data.titulo);
      console.log('  - preço:', data.preco);
      console.log('  - quartos:', data.quartos || 0);
      console.log('  - banheiros:', data.banheiros || 0);
      console.log('  - area:', data.area || 0);

      const createData = {
        titulo: data.titulo,
        descricao: data.descricao || '',
        preco: data.preco,
        quartos: data.quartos || 0,
        banheiros: data.banheiros || 0,
        area: data.area || 0,
        endereco: data.endereco || '',
        status: data.status || 'DISPONIVEL',
        galeriaFotos: [],
        caracteristicasArray: [],
        tipoImovelNome: 'Apartamento', // Usar tipoImovelNome ao invés de tipoImovel
        latitude: 0,
        longitude: 0,
        vagas: data.quartos ? Math.max(1, Math.floor(data.quartos / 2)) : 1, // Estimativa baseada em quartos
        construtoraId: this.CONSTRUTORA_PADRAO_ID // Usar sempre a mesma construtora padrão
      };
      
      console.log('Dados formatados para criar imóvel:', createData);
      
      const novoImovel = await prisma.imovel.create({
        data: createData,
        include: {
          construtora: true
        }
      });

      console.log('Imóvel criado com sucesso:', novoImovel.id);
      
      return {
        success: true,
        imovel: {
          id: novoImovel.id,
          titulo: novoImovel.titulo,
          descricao: novoImovel.descricao,
          preco: novoImovel.preco,
          quartos: novoImovel.quartos,
          banheiros: novoImovel.banheiros,
          area: novoImovel.area,
          endereco: novoImovel.endereco,
          status: novoImovel.status,
          construtora: novoImovel.construtora?.nome
        }
      };
    } catch (error) {
      console.error('ERRO AO CRIAR IMÓVEL:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'Unknown error');
      return {
        success: false,
        error: `Erro ao criar imóvel no banco de dados: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Atualiza um imóvel existente
   */
  static async updateImovel(data: {
    id: string;
    titulo?: string;
    descricao?: string;
    preco?: number;
    quartos?: number;
    banheiros?: number;
    area?: number;
    endereco?: string;
    status?: string;
  }) {
    try {
      // Verificar se o imóvel existe
      const imovelExistente = await prisma.imovel.findUnique({
        where: { id: data.id }
      });

      if (!imovelExistente) {
        return {
          success: false,
          error: `Imóvel com ID ${data.id} não encontrado`
        };
      }

      // Atualizar apenas os campos fornecidos
      const updateData: any = {};
      
      if (data.titulo !== undefined) updateData.titulo = data.titulo;
      if (data.descricao !== undefined) updateData.descricao = data.descricao;
      if (data.preco !== undefined) updateData.preco = data.preco;
      if (data.quartos !== undefined) updateData.quartos = data.quartos;
      if (data.banheiros !== undefined) updateData.banheiros = data.banheiros;
      if (data.area !== undefined) updateData.area = data.area;
      if (data.endereco !== undefined) updateData.endereco = data.endereco;
      if (data.status !== undefined) updateData.status = data.status;
      
      // Se houver quartos, atualizar também a estimativa de vagas
      if (data.quartos !== undefined) {
        updateData.vagas = Math.max(1, Math.floor(data.quartos / 2));
      }

      console.log('Dados para atualização:', updateData);
      
      // Atualizar o imóvel
      const imovelAtualizado = await prisma.imovel.update({
        where: { id: data.id },
        data: updateData,
        include: {
          construtora: true
        }
      });

      return {
        success: true,
        imovel: {
          id: imovelAtualizado.id,
          titulo: imovelAtualizado.titulo,
          descricao: imovelAtualizado.descricao,
          preco: imovelAtualizado.preco,
          quartos: imovelAtualizado.quartos,
          banheiros: imovelAtualizado.banheiros,
          area: imovelAtualizado.area,
          endereco: imovelAtualizado.endereco,
          status: imovelAtualizado.status,
          construtora: imovelAtualizado.construtora?.nome
        }
      };
    } catch (error) {
      console.error('Erro ao atualizar imóvel:', error);
      return {
        success: false,
        error: `Erro ao atualizar imóvel: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Remove um imóvel
   */
  static async deleteImovel(id: string) {
    try {
      // Verificar se o imóvel existe
      const imovelExistente = await prisma.imovel.findUnique({
        where: { id }
      });

      if (!imovelExistente) {
        return {
          success: false,
          error: `Imóvel com ID ${id} não encontrado`
        };
      }

      // Excluir o imóvel
      await prisma.imovel.delete({
        where: { id }
      });

      return {
        success: true,
        message: `Imóvel ${imovelExistente.titulo} (ID: ${id}) excluído com sucesso`
      };
    } catch (error) {
      console.error('Erro ao excluir imóvel:', error);
      return {
        success: false,
        error: `Erro ao excluir imóvel: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Busca imóveis por critérios
   */
  static async buscarImoveis(filtro: {
    titulo?: string;
    minPreco?: number;
    maxPreco?: number;
    minQuartos?: number;
    construtoraId?: string;
    status?: string;
  }) {
    try {
      // Construir o where baseado nos filtros
      const where: any = {
        ativo: true
      };

      if (filtro.titulo) {
        where.titulo = {
          contains: filtro.titulo,
          mode: 'insensitive'
        };
      }

      if (filtro.minPreco || filtro.maxPreco) {
        where.preco = {};
        if (filtro.minPreco) where.preco.gte = filtro.minPreco;
        if (filtro.maxPreco) where.preco.lte = filtro.maxPreco;
      }

      if (filtro.minQuartos) {
        where.quartos = {
          gte: filtro.minQuartos
        };
      }

      if (filtro.construtoraId) {
        where.construtoraId = filtro.construtoraId;
      }

      if (filtro.status) {
        where.status = filtro.status;
      }

      const imoveis = await prisma.imovel.findMany({
        where,
        include: {
          construtora: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      });

      return {
        success: true,
        imoveis: imoveis.map(imovel => ({
          id: imovel.id,
          titulo: imovel.titulo,
          preco: imovel.preco,
          quartos: imovel.quartos,
          banheiros: imovel.banheiros,
          area: imovel.area,
          construtora: imovel.construtora.nome,
          status: imovel.status
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      return {
        success: false,
        error: `Erro ao buscar imóveis: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Busca todas as perguntas ativas
   */
  static async getPerguntas() {
    try {
      const perguntas = await prisma.pergunta.findMany({
        where: {
          ativa: true
        },
        orderBy: {
          ordem: 'asc'
        }
      });

      return {
        success: true,
        perguntas: perguntas.map(pergunta => ({
          id: pergunta.id,
          texto: pergunta.texto,
          tipo: pergunta.tipo,
          categoria: pergunta.categoria,
          fluxo: pergunta.fluxo,
          ordem: pergunta.ordem,
          opcoes: pergunta.opcoes
        })),
        total: perguntas.length
      };
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error);
      return {
        success: false,
        error: `Erro ao buscar perguntas: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Busca todas as respostas de um usuário
   */
  static async getRespostas(userId?: string) {
    try {
      const where: any = {};
      if (userId) {
        where.userId = userId;
      }

      const respostas = await prisma.resposta.findMany({
        where,
        include: {
          pergunta: true,
          usuario: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      });

      return {
        success: true,
        respostas: respostas.map(resposta => ({
          id: resposta.id,
          valor: resposta.valor,
          pergunta: {
            id: resposta.pergunta.id,
            texto: resposta.pergunta.texto,
            tipo: resposta.pergunta.tipo,
            categoria: resposta.pergunta.categoria
          },
          usuario: resposta.usuario,
          dataResposta: resposta.createdAt
        })),
        total: respostas.length
      };
    } catch (error) {
      console.error('Erro ao buscar respostas:', error);
      return {
        success: false,
        error: `Erro ao buscar respostas: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Busca todos os usuários/clientes
   */
  static async getClientes() {
    try {
      const usuarios = await prisma.user.findMany({
        where: {
          role: 'CLIENTE'
        },
        select: {
          id: true,
          name: true,
          email: true,
          telefone: true,
          createdAt: true,
          _count: {
            select: {
              respostas: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      });

      return {
        success: true,
        clientes: usuarios.map(usuario => ({
          id: usuario.id,
          nome: usuario.name,
          email: usuario.email,
          telefone: usuario.telefone,
          dataCadastro: usuario.createdAt,
          totalRespostas: usuario._count.respostas
        })),
        total: usuarios.length
      };
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return {
        success: false,
        error: `Erro ao buscar clientes: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Busca todas as construtoras
   */
  static async getConstrutoras() {
    try {
      const construtoras = await prisma.construtora.findMany({
        where: {
          ativa: true
        },
        include: {
          _count: {
            select: {
              imoveis: true
            }
          }
        },
        orderBy: {
          nome: 'asc'
        }
      });

      return {
        success: true,
        construtoras: construtoras.map(construtora => ({
          id: construtora.id,
          nome: construtora.nome,
          cnpj: construtora.cnpj,
          email: construtora.email,
          telefone: construtora.telefone,
          endereco: construtora.endereco,
          totalImoveis: construtora._count.imoveis
        })),
        total: construtoras.length
      };
    } catch (error) {
      console.error('Erro ao buscar construtoras:', error);
      return {
        success: false,
        error: `Erro ao buscar construtoras: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
}