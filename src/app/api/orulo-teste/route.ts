import { NextRequest, NextResponse } from 'next/server';

// API de teste para verificar se o problema está no endpoint ou na chamada
export async function GET(request: NextRequest) {
  console.log('API de teste Orulo foi chamada!');
  
  // Retornar dados de mock diretamente
  const mockImoveis = [
    {
      "id": 56377,
      "name": "Imóvel Teste API",
      "description": "Apartamento completo com toda segurança, conforto e lazer que você merece.",
      "min_price": 236854.34,
      "min_bedrooms": 2,
      "max_bedrooms": 2,
      "min_area": 34.79,
      "max_area": 40.79,
      "status": "Em construção",
      "address": {
        "street": "Rua Teste",
        "number": "485",
        "neighborhood": "Jardim Ana Maria",
        "city": "São Paulo",
        "state": "SP",
        "postal_code": "05757-120"
      },
      "default_image": {
        "1024x1024": "https://static.orulo.com.br/images/properties/large/1773750.jpg?1715867051"
      }
    },
    {
      "id": 43769,
      "name": "Imóvel Teste API 2",
      "description": "Invista nos seus sonhos e realize o seu desejo de ter uma casa própria.",
      "min_price": 265634.61,
      "min_bedrooms": 2,
      "max_bedrooms": 2,
      "min_area": 38.11,
      "max_area": 57.12,
      "status": "Em construção",
      "address": {
        "street": "Avenida Teste",
        "number": "555",
        "neighborhood": "Jardim Iae",
        "city": "São Paulo",
        "state": "SP",
        "postal_code": "05890-000"
      },
      "default_image": {
        "1024x1024": "https://static.orulo.com.br/images/properties/large/1386601.jpg?1684961266"
      }
    }
  ];
  
  return NextResponse.json({ 
    results: mockImoveis,
    count: mockImoveis.length,
    message: 'Dados de mock da API de teste'
  });
}
