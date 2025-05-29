/**
 * Funções de formatação para o aplicativo
 */

/**
 * Formata um valor para o formato de moeda brasileira (R$)
 * @param valor - Valor a ser formatado
 * @returns String formatada como moeda brasileira
 */
export function formatarPreco(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

/**
 * Formata uma data para o formato brasileiro (dd/mm/aaaa)
 * @param data - Data a ser formatada
 * @returns String formatada como data brasileira
 */
export function formatarData(data: Date | string): string {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dataObj);
}

/**
 * Formata um número com separadores de milhares
 * @param numero - Número a ser formatado
 * @returns String formatada com separadores de milhares
 */
export function formatarNumero(numero: number): string {
  return new Intl.NumberFormat('pt-BR').format(numero);
}

/**
 * Formata uma área em metros quadrados
 * @param area - Área em metros quadrados
 * @returns String formatada com "m²"
 */
export function formatarArea(area: number): string {
  return `${formatarNumero(area)} m²`;
}
