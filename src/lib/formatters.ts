/**
 * Biblioteca de funções para formatação de dados
 */

/**
 * Formata um valor numérico como moeda (R$)
 * @param value Valor a ser formatado
 * @param options Opções de formatação
 * @returns String formatada como moeda
 */
export function formatCurrency(value: number, options: { withSymbol?: boolean } = { withSymbol: true }): string {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: options.withSymbol ? 'currency' : 'decimal',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(value);
}

/**
 * Formata uma data para o formato brasileiro (dd/mm/yyyy)
 * @param date Data a ser formatada
 * @returns String com a data formatada
 */
export function formatDate(date: Date | string): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formata um número de telefone para o padrão brasileiro
 * @param phone Número de telefone a ser formatado
 * @returns String com o telefone formatado
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  
  // Remove caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length <= 8) {
    // Formato 9999-9999
    return numbers.replace(/(\d{4})(\d{4})/, '$1-$2');
  } else if (numbers.length === 9) {
    // Formato 99999-9999
    return numbers.replace(/(\d{5})(\d{4})/, '$1-$2');
  } else if (numbers.length === 10) {
    // Formato (99) 9999-9999
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 11) {
    // Formato (99) 99999-9999
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}

/**
 * Formata um CNPJ para o padrão brasileiro
 * @param cnpj CNPJ a ser formatado
 * @returns String com o CNPJ formatado
 */
export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '';
  
  // Remove caracteres não numéricos
  const numbers = cnpj.replace(/\D/g, '');
  
  if (numbers.length !== 14) return cnpj;
  
  return numbers.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

/**
 * Formata um CPF para o padrão brasileiro
 * @param cpf CPF a ser formatado
 * @returns String com o CPF formatado
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return '';
  
  // Remove caracteres não numéricos
  const numbers = cpf.replace(/\D/g, '');
  
  if (numbers.length !== 11) return cpf;
  
  return numbers.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4'
  );
}

/**
 * Formata um CEP para o padrão brasileiro
 * @param cep CEP a ser formatado
 * @returns String com o CEP formatado
 */
export function formatCEP(cep: string): string {
  if (!cep) return '';
  
  // Remove caracteres não numéricos
  const numbers = cep.replace(/\D/g, '');
  
  if (numbers.length !== 8) return cep;
  
  return numbers.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

/**
 * Trunca um texto se ele for maior que o tamanho máximo
 * @param text Texto a ser truncado
 * @param maxLength Tamanho máximo do texto
 * @param suffix Sufixo a ser adicionado (padrão: '...')
 * @returns Texto truncado
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + suffix;
}

/**
 * Formata um valor numérico como área (m²)
 * @param value Valor da área
 * @returns String formatada como área
 */
export function formatArea(value: number): string {
  if (value === undefined || value === null) return '';
  
  return `${value.toLocaleString('pt-BR')} m²`;
}
