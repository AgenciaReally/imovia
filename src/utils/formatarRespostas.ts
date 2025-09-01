// Utilitário para formatar valores de respostas
export function formatarValorResposta(valor: string, tipo: string): string {
  if (!valor) return 'Não informado';
  
  try {
    // Se for array JSON, processar
    if (valor.startsWith('[') && valor.endsWith(']')) {
      const array = JSON.parse(valor);
      return formatarArray(array);
    }
    
    // Se for objeto JSON, processar
    if (valor.startsWith('{') && valor.endsWith('}')) {
      const obj = JSON.parse(valor);
      return formatarObjeto(obj);
    }
    
    // Formatações específicas por tipo
    switch (tipo) {
      case 'select':
      case 'radio':
        return formatarOpcao(valor);
      case 'checkbox':
        return valor;
      case 'slider':
      case 'number':
        return formatarNumero(valor);
      case 'email':
        return valor;
      case 'text':
      case 'textarea':
        return valor;
      case 'priority':
        return formatarOpcao(valor);
      default:
        return valor;
    }
  } catch (error) {
    // Se falhar ao processar JSON, retornar valor original
    return formatarOpcao(valor);
  }
}

function formatarArray(array: any[]): string {
  return array
    .map(item => formatarOpcao(item))
    .join(', ');
}

function formatarObjeto(obj: any): string {
  return Object.entries(obj)
    .map(([key, value]) => `${formatarOpcao(key)}: ${formatarOpcao(String(value))}`)
    .join(', ');
}

function formatarOpcao(valor: string): string {
  // Mapeamento de valores comuns
  const mapeamento: Record<string, string> = {
    // Tipos de imóvel
    'apartamento': 'Apartamento',
    'casa': 'Casa',
    'sobrado': 'Sobrado',
    'cobertura': 'Cobertura',
    'casa_rua': 'Casa na Rua',
    'casa_condominio': 'Casa em Condomínio',
    'loft': 'Loft',
    'kitnet': 'Kitnet',
    'studio': 'Studio',
    
    // Orientações solares
    'norte': 'Norte',
    'sul': 'Sul',
    'leste': 'Leste',
    'oeste': 'Oeste',
    'nordeste': 'Nordeste',
    'noroeste': 'Noroeste',
    'sudeste': 'Sudeste',
    'sudoeste': 'Sudoeste',
    
    // Sensibilidade a barulho
    'muito_sensivel': 'Muito Sensível',
    'sensivel': 'Sensível',
    'pouco_sensivel': 'Pouco Sensível',
    'nao_sensivel': 'Não Sensível',
    'normal': 'Normal',
    
    // Sim/Não
    'sim': 'Sim',
    'nao': 'Não',
    'maybe': 'Talvez',
    
    // Números
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4+',
    
    // Bairros (exemplos)
    'agua_verde': 'Água Verde',
    'centro': 'Centro',
    'batel': 'Batel',
    'bigorrilho': 'Bigorrilho',
    
    // Características
    'portaria_remota': 'Portaria Remota',
    'portaria_24h': 'Portaria 24h',
    'piscina': 'Piscina',
    'academia': 'Academia',
    'salao_festa': 'Salão de Festas',
    'playground': 'Playground',
    'churrasqueira': 'Churrasqueira',
    'sauna': 'Sauna',
    'quadra': 'Quadra Esportiva',
  };
  
  return mapeamento[valor] || formatarTextoGenerico(valor);
}

function formatarTextoGenerico(texto: string): string {
  // Capitalizar primeira letra e substituir _ por espaço
  return texto
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function formatarNumero(valor: string): string {
  const num = parseFloat(valor);
  if (isNaN(num)) return valor;
  
  // Se for inteiro, mostrar sem decimais
  if (num % 1 === 0) {
    return num.toString();
  }
  
  // Se for decimal, mostrar com 2 casas
  return num.toFixed(2).replace('.', ',');
}

// Função para formatar categoria
export function formatarCategoria(categoria: string): string {
  const categorias: Record<string, string> = {
    'CADASTRO': 'Dados Pessoais',
    'AVALIACAO_CREDITO': 'Análise de Crédito',
    'INFORMACOES_COMPLEMENTARES': 'Informações Complementares',
    'PREFERENCIAS': 'Preferências',
    'IMOVEL_IDEAL': 'Imóvel Ideal',
    'EMPREENDIMENTO': 'Empreendimento',
    'PROXIMIDADES': 'Localização e Proximidades'
  };
  
  return categorias[categoria] || formatarTextoGenerico(categoria);
}

// Função para obter cor da categoria
export function corCategoria(categoria: string): string {
  const cores: Record<string, string> = {
    'CADASTRO': 'bg-blue-100 text-blue-800 border-blue-200',
    'AVALIACAO_CREDITO': 'bg-green-100 text-green-800 border-green-200',
    'INFORMACOES_COMPLEMENTARES': 'bg-purple-100 text-purple-800 border-purple-200',
    'PREFERENCIAS': 'bg-orange-100 text-orange-800 border-orange-200',
    'IMOVEL_IDEAL': 'bg-pink-100 text-pink-800 border-pink-200',
    'EMPREENDIMENTO': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'PROXIMIDADES': 'bg-teal-100 text-teal-800 border-teal-200'
  };
  
  return cores[categoria] || 'bg-gray-100 text-gray-800 border-gray-200';
}
