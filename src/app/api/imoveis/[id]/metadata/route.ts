import { NextRequest, NextResponse } from 'next/server';
import { buscarMetadados, salvarMetadados } from '@/services/imovel-metadata-service';

// Buscar metadados de um imóvel externo
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const imovelIdExterno = params.id;
    console.log('[API] Buscando metadados para imóvel ID:', imovelIdExterno);

    if (!imovelIdExterno) {
      return NextResponse.json(
        { error: 'ID do imóvel é obrigatório' }, 
        { status: 400 }
      );
    }

    const metadata = await buscarMetadados(imovelIdExterno);
    console.log('[API] Metadados encontrados:', metadata);
    
    return NextResponse.json({
      success: true,
      data: metadata || { 
        imovelIdExterno,
        telefone: '', 
        observacoes: '',
        construtoraId: null
      }
    });
  } catch (error) {
    console.error('Erro ao buscar metadados:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar metadados do imóvel' }, 
      { status: 500 }
    );
  }
}

// Salvar ou atualizar metadados de um imóvel externo
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const imovelIdExterno = params.id;
    const body = await request.json();
    
    const { telefone, observacoes, construtoraId } = body;
    console.log('[API] Salvando metadados:', { imovelIdExterno, telefone, observacoes, construtoraId });
    
    if (!imovelIdExterno) {
      return NextResponse.json(
        { error: 'ID do imóvel é obrigatório' }, 
        { status: 400 }
      );
    }
    
    const construtoraIdFinal = construtoraId === 'null' ? null : construtoraId;
    console.log('[API] Valor final de construtoraId:', construtoraIdFinal);
    
    const resultado = await salvarMetadados({
      imovelIdExterno,
      telefone: telefone || '',
      observacoes: observacoes || '',
      construtoraId: construtoraIdFinal
    });
    
    if (!resultado) {
      throw new Error('Erro ao salvar metadados');
    }
    
    console.log('[API] Metadados salvos com sucesso:', resultado);
    
    return NextResponse.json({
      success: true,
      data: resultado
    });
  } catch (error) {
    console.error('Erro ao salvar metadados:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar metadados do imóvel' }, 
      { status: 500 }
    );
  }
}
