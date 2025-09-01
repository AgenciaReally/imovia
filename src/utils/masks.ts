// Utilitários para máscaras de input
export const applyMask = (value: string, type: string): string => {
  if (!value) return ''
  
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '')
  
  switch (type.toLowerCase()) {
    case 'telefone':
    case 'phone':
    case 'tel':
      return applyPhoneMask(numbers)
    case 'cpf':
      return applyCpfMask(numbers)
    case 'cnpj':
      return applyCnpjMask(numbers)
    case 'cep':
      return applyCepMask(numbers)
    case 'currency':
    case 'moeda':
    case 'dinheiro':
    case 'valor':
      return applyCurrencyMask(value)
    default:
      return value
  }
}

export const applyPhoneMask = (value: string): string => {
  if (value.length <= 10) {
    // Telefone fixo: (11) 1234-5678
    return value
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    // Celular: (11) 91234-5678
    return value
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  }
}

export const applyCpfMask = (value: string): string => {
  return value
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
}

export const applyCnpjMask = (value: string): string => {
  return value
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
}

export const applyCepMask = (value: string): string => {
  return value.replace(/(\d{5})(\d)/, '$1-$2')
}

export const applyCurrencyMask = (value: string): string => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '')
  
  if (!numbers) return ''
  
  // Converte para centavos
  const amount = parseInt(numbers) / 100
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

export const removeMask = (value: string): string => {
  return value.replace(/\D/g, '')
}

export const detectMaskType = (fieldName: string): string | null => {
  const name = fieldName.toLowerCase()
  
  if (name.includes('telefone') || name.includes('phone') || name.includes('celular')) {
    return 'telefone'
  }
  if (name.includes('cpf')) {
    return 'cpf'
  }
  if (name.includes('cnpj')) {
    return 'cnpj'
  }
  if (name.includes('cep')) {
    return 'cep'
  }
  if (name.includes('valor') || name.includes('preco') || name.includes('renda') || name.includes('salario')) {
    return 'currency'
  }
  
  return null
}
