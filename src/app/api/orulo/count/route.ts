import { NextResponse } from 'next/server';

// Endpoint para verificar a contagem real de imóveis na Orulo
export async function GET(request: Request) {
  try {
    // Credenciais da Orulo - Cliente Imovia
    const CLIENT_ID = process.env.ORULO_CLIENT_ID || 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
    const CLIENT_SECRET = process.env.ORULO_CLIENT_SECRET || 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ';
    const API_KEY = process.env.ORULO_API_KEY;
    
    console.log('Verificando contagem real de imóveis na Orulo...');
    console.log('Credenciais:', { 
      clientId: CLIENT_ID ? 'Configurado' : 'Não configurado',
      clientSecret: CLIENT_SECRET ? 'Configurado' : 'Não configurado',
      apiKey: API_KEY ? 'Configurado' : 'Não configurado'
    });
    
    // Configurar headers baseado nas credenciais disponíveis
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (CLIENT_ID && CLIENT_SECRET) {
      headers['X-Client-ID'] = CLIENT_ID;
      headers['X-Secret'] = CLIENT_SECRET;
    }
    
    if (API_KEY) {
      headers['Authorization'] = `Token ${API_KEY}`;
    }
    
    // Fazer requisição para a API da Orulo - usando page_size=1 para economizar tráfego
    const response = await fetch('https://api.orulo.com.br/buildings?page=1&page_size=1', {
      method: 'GET',
      headers,
      next: { revalidate: 0 } // Evitar cache
    });
    
    if (!response.ok) {
      console.error(`Erro na API da Orulo: ${response.status} ${response.statusText}`);
      
      // Tentar novamente com outro endpoint que pode ser diferente
      console.log('Tentando endpoint alternativo...');
      const alt = await fetch('https://api.orulo.com.br/establishments?page=1&page_size=1', {
        method: 'GET',
        headers,
        next: { revalidate: 0 }
      });
      
      if (!alt.ok) {
        return NextResponse.json({ 
          error: 'Falha na autenticação',
          status: response.status,
          statusText: response.statusText,
          headers: headers,
          debug: { 
            alt_status: alt.status, 
            alt_text: alt.statusText
          }
        }, { status: 500 });
      }
      
      const altData = await alt.json();
      return NextResponse.json(altData);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      count: data.count || 0,
      next: data.next,
      first_item: data.results && data.results.length > 0 ? {
        id: data.results[0].id,
        name: data.results[0].name,
        address: `${data.results[0].address.street}, ${data.results[0].address.neighborhood}`,
        city: `${data.results[0].address.city}, ${data.results[0].address.state}`
      } : null
    });
  } catch (error) {
    console.error('Erro ao verificar contagem de imóveis:', error);
    return NextResponse.json({ 
      error: 'Erro interno ao verificar contagem', 
      message: (error as Error).message 
    }, { status: 500 });
  }
}
