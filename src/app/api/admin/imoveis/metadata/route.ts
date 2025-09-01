import { NextRequest, NextResponse } from 'next/server';
import { buscarMetadados, salvarMetadados } from '@/services/imovel-metadata-service';

// Buscar metadados de um imóvel externo
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imovelIdExterno = searchParams.get('id');

    if (!imovelIdExterno) {
      return NextResponse.json(
        { error: 'ID do imóvel é obrigatório' }, 
        { status: 400 }
      );
    }

    const metadata = await buscarMetadados(imovelIdExterno);
    
    return NextResponse.json({
      success: true,
      data: metadata || { 
        imovelIdExterno,
        telefone: '', 
        observacoes: '' 
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
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { imovelIdExterno, telefone, observacoes, construtoraId } = body;
    
    if (!imovelIdExterno) {
      return NextResponse.json(
        { error: 'ID do imóvel é obrigatório' }, 
        { status: 400 }
      );
    }
    
    const resultado = await salvarMetadados({
      imovelIdExterno,
      telefone: telefone || '',
      observacoes: observacoes || '',
      construtoraId: construtoraId || null
    });
    
    if (!resultado) {
      throw new Error('Erro ao salvar metadados');
    }
    
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
