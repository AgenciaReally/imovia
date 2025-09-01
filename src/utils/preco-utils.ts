/**
 * Utilitários para validação e formatação de preços
 */

export const validarPreco = (preco: any): number => {
  // Se é null ou undefined, retornar preço padrão
  if (preco === null || preco === undefined) {
    return 300000;
  }
  
  // Se é string, tentar converter removendo caracteres não numéricos
  if (typeof preco === 'string') {
    const precoLimpo = preco.replace(/[^\d,.-]/g, '').replace(',', '.');
    const precoNumero = parseFloat(precoLimpo);
    return !isNaN(precoNumero) && precoNumero > 0 ? precoNumero : 300000;
  }
  
  // Se é número, validar
  const precoNumero = Number(preco);
  return !isNaN(precoNumero) && precoNumero > 0 ? precoNumero : 300000;
};

export const formatarPreco = (preco: any): string => {
  const precoValido = validarPreco(preco);
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(precoValido);
};

export const formatarPrecoCompacto = (preco: any): string => {
  const precoValido = validarPreco(preco);
  
  if (precoValido >= 1000000) {
    return `R$ ${(precoValido / 1000000).toFixed(1)}M`;
  }
  
  if (precoValido >= 1000) {
    return `R$ ${(precoValido / 1000).toFixed(0)}k`;
  }
  
  return formatarPreco(precoValido);
};
