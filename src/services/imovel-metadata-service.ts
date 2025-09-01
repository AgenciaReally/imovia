import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export interface ImovelMetadata {
  id?: string;
  imovelIdExterno: string;
  telefone: string;
  observacoes: string;
  construtoraId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Busca metadados adicionais de um imóvel externo pelo ID
 */
export async function buscarMetadados(imovelIdExterno: string): Promise<ImovelMetadata | null> {
  try {
    const metadata = await prisma.imovelMetadata.findUnique({
      where: {
        imovelIdExterno
      }
    });
    
    return metadata;
  } catch (error) {
    console.error('Erro ao buscar metadados do imóvel:', error);
    return null;
  }
}

/**
 * Salva ou atualiza metadados adicionais de um imóvel externo
 */
export async function salvarMetadados(dados: ImovelMetadata): Promise<ImovelMetadata | null> {
  try {
    // Verifica se já existe registro para este imóvel
    const existente = await prisma.imovelMetadata.findUnique({
      where: {
        imovelIdExterno: dados.imovelIdExterno
      }
    });
    
    if (existente) {
      // Atualiza registro existente
      const atualizado = await prisma.imovelMetadata.update({
        where: {
          id: existente.id
        },
        data: {
          telefone: dados.telefone,
          observacoes: dados.observacoes,
          construtoraId: dados.construtoraId
        }
      });
      
      return atualizado;
    } else {
      // Cria novo registro
      const novo = await prisma.imovelMetadata.create({
        data: {
          imovelIdExterno: dados.imovelIdExterno,
          telefone: dados.telefone,
          observacoes: dados.observacoes,
          construtoraId: dados.construtoraId
        }
      });
      
      return novo;
    }
  } catch (error) {
    console.error('Erro ao salvar metadados do imóvel:', error);
    return null;
  }
}
