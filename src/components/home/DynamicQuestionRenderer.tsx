"use client"

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Upload, FileText, Image, MapPin, Building } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { FileUploadComponent } from '@/components/ui/file-upload'
import { InsightIA } from '@/components/ui/insight-ia'
import { Pergunta } from '@/services/pergunta-service'
import { applyMask, detectMaskType, removeMask } from '@/utils/masks'

interface DynamicQuestionRendererProps {
  pergunta: Pergunta
  valor?: any
  onChange: (valor: any) => void
}

export function DynamicQuestionRenderer({ pergunta, valor, onChange }: DynamicQuestionRendererProps) {
  const [inputValue, setInputValue] = useState('')
  const [maskType, setMaskType] = useState<string | null>(null)
  const [cidades, setCidades] = useState<any[]>([])
  const [bairros, setBairros] = useState<any[]>([])
  const [loadingCidades, setLoadingCidades] = useState(false)
  const [loadingBairros, setLoadingBairros] = useState(false)
  const [cidadeSelecionada, setCidadeSelecionada] = useState<any>(null)

  // Funções para buscar cidades e bairros
  const buscarCidades = async (query: string) => {
    if (query.length < 2) {
      setCidades([])
      return
    }
    
    console.log('🔍 Buscando cidades para:', query)
    setLoadingCidades(true)
    try {
      const response = await fetch(`/api/cidades?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      console.log('📊 Resposta API cidades:', data)
      
      if (data.success) {
        setCidades(data.cidades)
        console.log('✅ Cidades carregadas:', data.cidades.length)
      } else {
        console.error('❌ Erro na API:', data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao buscar cidades:', error)
    } finally {
      setLoadingCidades(false)
    }
  }
  
  const buscarBairros = async (municipioId: string, query?: string) => {
    console.log('🏘️ Buscando bairros para município:', municipioId, 'query:', query)
    setLoadingBairros(true)
    try {
      let url = `/api/bairros?municipio=${municipioId}`
      if (query && query.length >= 2) {
        url += `&q=${encodeURIComponent(query)}`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      
      console.log('📊 Resposta API bairros:', data)
      
      if (data.success) {
        setBairros(data.bairros)
        console.log('✅ Bairros carregados:', data.bairros.length)
      } else {
        console.error('❌ Erro na API bairros:', data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao buscar bairros:', error)
    } finally {
      setLoadingBairros(false)
    }
  }

  // Detectar tipo de máscara automaticamente
  useEffect(() => {
    // Para radio buttons, nunca aplicar máscara
    if (pergunta.tipo === 'radio' || pergunta.tipo === 'select' || pergunta.tipo === 'checkbox') {
      console.log('🚫 Não aplicando máscara para tipo:', pergunta.tipo)
      setMaskType(null)
      return
    }
    
    // Se mascaraValor está ativa, usar máscara de valor
    if (pergunta.mascaraValor) {
      console.log('🎭 Aplicando máscara de valor para pergunta:', pergunta.texto)
      setMaskType('valor')
    } else {
      const detectedMask = detectMaskType(pergunta.texto)
      console.log('🔍 Máscara detectada:', detectedMask, 'para pergunta:', pergunta.texto)
      setMaskType(detectedMask)
    }
  }, [pergunta.texto, pergunta.mascaraValor, pergunta.tipo])

  // Aplicar máscara inicial quando valor ou máscara mudar
  useEffect(() => {
    if (!valor) {
      setInputValue('')
      return
    }

    // Se pergunta tem máscara de valor ativada
    if (pergunta.mascaraValor && typeof valor === 'number') {
      const formatted = `R$ ${valor.toLocaleString('pt-BR')}`
      console.log('🎭 Formatando valor inicial:', valor, 'para:', formatted)
      setInputValue(formatted)
    } else if (typeof valor === 'string' && maskType) {
      const maskedValue = applyMask(valor, maskType)
      setInputValue(maskedValue)
    } else {
      setInputValue(valor || '')
    }
  }, [valor, pergunta.mascaraValor, maskType])

  // Handler para mudanças no input com máscara
  const handleInputChange = (newValue: any) => {
    console.log('🔧 handleInputChange chamado com:', newValue)
    
    if (typeof newValue === 'string' && maskType) {
      const maskedValue = applyMask(newValue, maskType)
      console.log('🎭 Aplicando máscara:', { original: newValue, masked: maskedValue })
      setInputValue(maskedValue)
      // Salvar valor sem máscara no backend
      onChange(removeMask(maskedValue))
    } else {
      console.log('✅ Passando valor direto:', newValue)
      setInputValue(newValue)
      onChange(newValue)
    }
  }

  // Processar opções se existirem
  const opcoes = (() => {
    console.log('=== DEBUG OPÇÕES ===')
    console.log('pergunta.opcoes:', pergunta.opcoes)
    console.log('tipo da pergunta.opcoes:', typeof pergunta.opcoes)
    
    if (!pergunta.opcoes) {
      console.log('Nenhuma opção encontrada')
      return []
    }
    
    // Se é string, fazer parse do JSON
    if (typeof pergunta.opcoes === 'string') {
      try {
        const parsed = JSON.parse(pergunta.opcoes)
        console.log('Opções parseadas de string JSON:', parsed)
        
        if (Array.isArray(parsed)) {
          return parsed
        }
        
        // Se é objeto após parse, converter para array
        if (typeof parsed === 'object') {
          const entries = Object.entries(parsed)
          if (entries.length > 0) {
            const converted = entries.map(([value, label]) => ({ value, label: String(label) }))
            console.log('Opções convertidas de objeto para array:', converted)
            return converted
          }
        }
      } catch (error) {
        console.error('Erro ao fazer parse das opções JSON:', error)
        return []
      }
    }
    
    // Se é array, usar diretamente
    if (Array.isArray(pergunta.opcoes)) {
      console.log('Opções são array:', pergunta.opcoes)
      return pergunta.opcoes
    }
    
    // Se é objeto, pode ser um objeto chave-valor ou ter propriedade items
    if (typeof pergunta.opcoes === 'object') {
      // VERIFICAR SE É UM OBJETO INDEXADO (string convertida incorretamente)
      const keys = Object.keys(pergunta.opcoes)
      const isIndexedObject = keys.length > 10 && keys.every(key => !isNaN(Number(key)))
      
      if (isIndexedObject) {
        // É uma string que foi convertida em objeto indexado - reconverter
        const reconstructedString = Object.values(pergunta.opcoes).join('')
        console.log('🔧 Detectado objeto indexado, reconstruindo string:', reconstructedString)
        
        try {
          const parsed = JSON.parse(reconstructedString)
          console.log('✅ String reconstruída e parseada:', parsed)
          
          if (Array.isArray(parsed)) {
            return parsed
          }
          
          if (typeof parsed === 'object') {
            const entries = Object.entries(parsed)
            if (entries.length > 0) {
              const converted = entries.map(([value, label]) => ({ value, label: String(label) }))
              console.log('Opções convertidas de objeto reconstruído:', converted)
              return converted
            }
          }
        } catch (error) {
          console.error('Erro ao parsear string reconstruída:', error)
          return []
        }
      }
      
      // Se tem propriedade items, usar ela
      if (pergunta.opcoes.items && Array.isArray(pergunta.opcoes.items)) {
        console.log('Opções têm propriedade items:', pergunta.opcoes.items)
        return pergunta.opcoes.items
      }
      
      // Se é objeto chave-valor normal, converter para array
      const entries = Object.entries(pergunta.opcoes)
      if (entries.length > 0) {
        const converted = entries.map(([value, label]) => ({ value, label: String(label) }))
        console.log('Opções convertidas de objeto para array:', converted)
        return converted
      }
    }
    
    console.log('Formato de opções não reconhecido, retornando array vazio')
    return []
  })()


  const renderInput = () => {
    // Normalizar tipo da pergunta
    const tipo = pergunta.tipo?.toLowerCase()?.trim() || 'text'
    
    switch (tipo) {
      case 'text':
      case 'texto':
      case '': // Fallback para tipo vazio
        // Verificar se deve usar máscara de valor manual
        const usarMascaraValor = pergunta.mascaraValor || maskType === 'currency'
        
        if (usarMascaraValor) {
          return (
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    console.log('=== DEBUG MÁSCARA VALOR ===')
                    console.log('Valor digitado:', e.target.value)
                    
                    // Aplicar máscara de moeda brasileira
                    let value = e.target.value.replace(/\D/g, '')
                    console.log('Valor após remove não-dígitos:', value)
                    
                    if (value === '') {
                      console.log('Valor vazio, limpando campo')
                      setInputValue('')
                      onChange('')
                      return
                    }
                    
                    // Aplicar formatação brasileira sem centavos
                    const numericValue = Number(value)
                    const formatted = `R$ ${numericValue.toLocaleString('pt-BR')}`
                    console.log('Valor numérico:', numericValue)
                    console.log('Valor formatado:', formatted)
                    
                    setInputValue(formatted)
                    // Salvar o valor numérico (sem máscara)
                    onChange(numericValue)
                  }}
                  placeholder="R$ 500.000"
                  className="text-lg p-4 border-2 focus:border-orange-500 pl-12"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                  💰
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Valor em R$
                </Badge>
                <span className="text-xs text-gray-500">Máscara automática aplicada</span>
              </div>
            </div>
          )
        }
        
        return (
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={maskType ? `Digite ${maskType}...` : "Digite sua resposta..."}
                className="text-lg p-4 border-2 focus:border-orange-500 pl-12"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                {maskType === 'telefone' ? '📱' : 
                 maskType === 'cpf' ? '🆔' : 
                 maskType === 'cnpj' ? '🏢' : 
                 maskType === 'currency' ? '💰' : '✏️'}
              </div>
            </div>
            {maskType && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {maskType === 'telefone' ? 'Telefone' : 
                   maskType === 'cpf' ? 'CPF' : 
                   maskType === 'cnpj' ? 'CNPJ' : 
                   maskType === 'currency' ? 'Valor em R$' : maskType}
                </Badge>
                <span className="text-xs text-gray-500">Máscara automática aplicada</span>
              </div>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div className="space-y-2">
            <div className="relative">
              <Textarea
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Digite sua resposta detalhada..."
                className="text-lg p-4 border-2 focus:border-orange-500 min-h-[120px] resize-none"
              />
              <div className="absolute top-3 right-3 text-orange-500">
                ✍️
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Descreva com detalhes</span>
              <span>{inputValue?.length || 0} caracteres</span>
            </div>
          </div>
        )

      case 'number':
      case 'numero':
      case 'numerico':
        return (
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => handleInputChange(Number(e.target.value))}
                placeholder="Digite um número..."
                className="text-lg p-4 border-2 focus:border-orange-500 pl-12"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                🔢
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Apenas números são aceitos
            </p>
          </div>
        )

      case 'email':
        return (
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="email"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="seu@email.com"
                className="text-lg p-4 border-2 focus:border-orange-500 pl-12"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                📧
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Digite um endereço de email válido
            </p>
          </div>
        )

      case 'priority':
      case 'prioridade':
        const priorityOptions = ['Baixa', 'Média', 'Alta', 'Urgente']
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              {priorityOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleInputChange(option)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    inputValue === option
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">
                      {option === 'Baixa' ? '🟢' : 
                       option === 'Média' ? '🟡' : 
                       option === 'Alta' ? '🟠' : '🔴'}
                    </span>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
            {inputValue && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Prioridade selecionada:</span>
                <span className="font-medium text-orange-600">{inputValue}</span>
              </div>
            )}
          </div>
        )

      case 'tel':
      case 'telefone':
      case 'phone':
        return (
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="tel"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="(11) 99999-9999"
                className="text-lg p-4 border-2 focus:border-orange-500 pl-12"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                📱
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Digite seu número com DDD
            </p>
          </div>
        )

      case 'date':
      case 'data':
        return (
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="date"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                className="text-lg p-4 border-2 focus:border-orange-500 pl-12"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                📅
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Selecione uma data no calendário
            </p>
          </div>
        )

      case 'select':
      case 'seleção':
      case 'selecao':
      case 'dropdown':
        return (
          <div className="space-y-2">
            <Select value={String(inputValue || "")} onValueChange={(value) => {
              console.log('Select onChange:', value);
              setInputValue(value);
              onChange(value);
            }}>
              <SelectTrigger className="text-lg p-4 border-2 focus:border-orange-500 hover:border-orange-300 transition-colors">
                <div className="flex items-center space-x-2">
                  <span className="text-orange-500">📋</span>
                  <SelectValue placeholder="Selecione uma opção...">
                    {inputValue || "Selecione uma opção..."}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {opcoes.map((opcao: any, index: number) => {
                  const value = typeof opcao === 'string' ? opcao : opcao.value || opcao.label
                  const label = typeof opcao === 'string' ? opcao : opcao.label || opcao.value
                  
                  return (
                    <SelectItem 
                      key={`${index}-${value}`} 
                      value={String(value)}
                      className="text-base p-3 hover:bg-orange-50 cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{label}</span>
                        {inputValue === value && <span className="text-orange-500 ml-auto">✓</span>}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Clique para ver todas as opções disponíveis
            </p>
            {inputValue && (
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                <span className="text-sm text-green-700">✓ Selecionado:</span>
                <span className="font-medium text-green-800">{inputValue}</span>
              </div>
            )}
          </div>
        )

      case 'radio':
      case 'escolha única':
      case 'escolha unica':
      case 'escolha_unica':
      case 'single_choice':
        return (
          <RadioGroup value={String(inputValue || "")} onValueChange={(value) => {
            console.log('🔘 RadioGroup onChange:', value)
            handleInputChange(value)
          }}>
            <div className="space-y-3">
              {opcoes.map((opcao: any, index: number) => {
                const value = typeof opcao === 'string' ? opcao : opcao.value || opcao.label
                const label = typeof opcao === 'string' ? opcao : opcao.label || opcao.value
                const isSelected = String(inputValue) === String(value)
                
                console.log('🔍 Radio option:', { value, label, isSelected, inputValue })
                
                return (
                  <div key={`${pergunta.id}-radio-${index}`} className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-orange-50 ${
                    isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => {
                    console.log('🖱️ Radio div clicked:', value)
                    handleInputChange(value)
                  }}
                  >
                    <RadioGroupItem 
                      value={String(value)} 
                      id={`radio-${pergunta.id}-${index}`} 
                      className="text-orange-500" 
                    />
                    <Label 
                      htmlFor={`radio-${pergunta.id}-${index}`} 
                      className={`text-lg cursor-pointer flex-1 ${
                        isSelected ? 'text-orange-700 font-medium' : 'text-gray-700'
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log('🏷️ Label clicked:', value)
                        handleInputChange(value)
                      }}
                    >
                      {label}
                    </Label>
                    {isSelected && (
                      <div className="text-orange-500">✓</div>
                    )}
                  </div>
                )
              })}
            </div>
          </RadioGroup>
        )

      case 'checkbox':
      case 'múltipla escolha':
      case 'multipla escolha':
      case 'multiple_choice':
      case 'multipla_escolha':
        const checkboxValues: string[] = Array.isArray(inputValue) ? inputValue : []
        
        return (
          <div className="space-y-3">
            {opcoes.map((opcao: any, index: number) => {
              const value = typeof opcao === 'string' ? opcao : opcao.value || opcao.label
              const label = typeof opcao === 'string' ? opcao : opcao.label || opcao.value
              const isChecked = checkboxValues.includes(String(value))
              
              return (
                <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-blue-50 ${
                  isChecked ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <Checkbox
                    id={`checkbox-${index}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      let newValues = [...checkboxValues]
                      if (checked) {
                        if (!newValues.includes(String(value))) {
                          newValues.push(String(value))
                        }
                      } else {
                        newValues = newValues.filter(v => v !== String(value))
                      }
                      handleInputChange(newValues)
                    }}
                    className="text-blue-500"
                  />
                  <Label 
                    htmlFor={`checkbox-${index}`} 
                    className={`text-lg cursor-pointer flex-1 ${
                      isChecked ? 'text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {label}
                  </Label>
                  {isChecked && (
                    <div className="text-blue-500">✓</div>
                  )}
                </div>
              )
            })}
            {checkboxValues.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">{checkboxValues.length}</span> opção(ões) selecionada(s)
                </p>
              </div>
            )}
          </div>
        )

      case 'range':
      case 'slider':
        // Usar novos campos do slider ou fallback para opcoes antigas
        const min = pergunta.sliderMin ?? (() => {
          const minOption = opcoes.find((opt: any) => opt.label === 'min')
          return minOption?.value ? parseFloat(minOption.value) : 0
        })()
        
        const max = pergunta.sliderMax ?? (() => {
          const maxOption = opcoes.find((opt: any) => opt.label === 'max')
          return maxOption?.value ? parseFloat(maxOption.value) : 100
        })()
        
        const stepOption = opcoes.find((opt: any) => opt.label === 'step')
        const step = stepOption?.value ? parseFloat(stepOption.value) : 1

        // Função para formatar valor baseado no tipo
        const formatarValorSlider = (valor: number): string => {
          switch (pergunta.sliderTipo) {
            case 'real':
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(valor)
            case 'porcentagem':
              return `${valor}%`
            case 'metros':
              return `${valor}m`
            case 'anos':
              return `${valor} ${valor === 1 ? 'ano' : 'anos'}`
            case 'ponto':
              return `⭐ ${valor}`
            case 'numero':
            default:
              return valor.toString()
          }
        }

        // Ícone baseado no tipo
        const obterIconeSlider = () => {
          switch (pergunta.sliderTipo) {
            case 'real': return '💰'
            case 'porcentagem': return '📊'
            case 'metros': return '📏'
            case 'anos': return '📅'
            case 'ponto': return '⭐'
            default: return '🔢'
          }
        }

        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{obterIconeSlider()}</span>
              <span className="text-sm text-gray-600">
                {pergunta.sliderTipo === 'real' && 'Valor em Reais'}
                {pergunta.sliderTipo === 'porcentagem' && 'Porcentagem'}
                {pergunta.sliderTipo === 'metros' && 'Metros'}
                {pergunta.sliderTipo === 'anos' && 'Anos'}
                {pergunta.sliderTipo === 'ponto' && 'Pontuação'}
                {(!pergunta.sliderTipo || pergunta.sliderTipo === 'numero') && 'Número'}
              </span>
            </div>
            
            <Slider
              value={[Number(inputValue) || min]}
              onValueChange={(value) => handleInputChange(value[0])}
              min={min}
              max={max}
              step={step}
              className="w-full"
            />
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{formatarValorSlider(min)}</span>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                {formatarValorSlider(Number(inputValue) || min)}
              </div>
              <span className="text-gray-500">{formatarValorSlider(max)}</span>
            </div>
          </div>
        )

      case 'buttons':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {opcoes.map((opcao: any, index: number) => {
              const value = typeof opcao === 'string' ? opcao : opcao.value || opcao.label
              const label = typeof opcao === 'string' ? opcao : opcao.label || opcao.value
              
              return (
                <Button
                  key={index}
                  variant={inputValue === value ? "default" : "outline"}
                  onClick={() => handleInputChange(value)}
                  className={`p-4 text-lg ${
                    inputValue === value 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'hover:border-orange-500 hover:text-orange-600'
                  }`}
                >
                  {label}
                </Button>
              )
            })}
          </div>
        )

      case 'file':
      case 'arquivo':
      case 'upload':
        return <FileUploadComponent 
          value={typeof inputValue === 'object' && inputValue !== null ? inputValue : null} 
          onChange={handleInputChange}
          accept={pergunta.opcoes?.accept}
        />

      case 'cpf':
      case 'document':
        return (
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => {
              // Aplicar máscara de CPF
              let value = e.target.value.replace(/\D/g, '')
              if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4')
                value = value.replace(/(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3')
                value = value.replace(/(\d{3})(\d{1})$/, '$1.$2')
              }
              handleInputChange(value)
            }}
            placeholder="000.000.000-00"
            className="text-lg p-4 border-2 focus:border-orange-500"
            maxLength={14}
          />
        )

      case 'cnpj':
        return (
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => {
              // Aplicar máscara de CNPJ
              let value = e.target.value.replace(/\D/g, '')
              if (value.length <= 14) {
                value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
                value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})$/, '$1.$2.$3/$4-$5')
                value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{3})$/, '$1.$2.$3/$4')
                value = value.replace(/(\d{2})(\d{3})(\d{2})$/, '$1.$2.$3')
                value = value.replace(/(\d{2})(\d{1})$/, '$1.$2')
              }
              handleInputChange(value)
            }}
            placeholder="00.000.000/0000-00"
            className="text-lg p-4 border-2 focus:border-orange-500"
            maxLength={18}
          />
        )

      case 'phone':
      case 'telefone':
        return (
          <Input
            type="tel"
            value={inputValue}
            onChange={(e) => {
              // Aplicar máscara de telefone
              let value = e.target.value.replace(/\D/g, '')
              if (value.length <= 11) {
                if (value.length <= 10) {
                  value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
                  value = value.replace(/(\d{2})(\d{4})(\d{3})$/, '($1) $2-$3')
                  value = value.replace(/(\d{2})(\d{3})$/, '($1) $2')
                  value = value.replace(/(\d{2})(\d{1})$/, '($1) $2')
                } else {
                  value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                  value = value.replace(/(\d{2})(\d{5})(\d{3})$/, '($1) $2-$3')
                  value = value.replace(/(\d{2})(\d{4})$/, '($1) $2')
                }
              }
              handleInputChange(value)
            }}
            placeholder="(11) 99999-9999"
            className="text-lg p-4 border-2 focus:border-orange-500"
            maxLength={15}
          />
        )

      case 'currency':
      case 'money':
      case 'valor':
        return (
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => {
              // Aplicar máscara de moeda
              let value = e.target.value.replace(/\D/g, '')
              value = (Number(value) / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })
              handleInputChange(value)
            }}
            placeholder="R$ 0,00"
            className="text-lg p-4 border-2 focus:border-orange-500"
          />
        )

      case 'cidade':
      case 'city':
        console.log('🏙️ Renderizando input cidade:', { 
          tipo: pergunta.tipo, 
          mascaraCidade: pergunta.mascaraCidade,
          perguntaCompleta: pergunta 
        })
        
        // Verificar se máscara de cidade está ativa
        if (pergunta.mascaraCidade) {
          console.log('✅ Máscara de cidade ATIVA - renderizando autocomplete')
          return (
            <div className="space-y-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    const query = e.target.value
                    handleInputChange(query)
                    buscarCidades(query)
                  }}
                  placeholder="Digite o nome da cidade..."
                  className="text-lg p-4 pl-12 border-2 focus:border-orange-500"
                />
                {loadingCidades && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              
              {cidades.length > 0 && (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg">
                  {cidades.map((cidade) => (
                    <button
                      key={cidade.id}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        const cidadeCompleta = `${cidade.nome} - ${cidade.uf}`
                        handleInputChange(cidadeCompleta)
                        setCidadeSelecionada(cidade)
                        setCidades([])
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{cidade.nome}</span>
                        <span className="text-sm text-gray-500">- {cidade.uf}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        }
        
        console.log('❌ Máscara de cidade INATIVA - renderizando input simples')
        // Fallback para input normal se máscara não estiver ativa
        return (
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Digite o nome da cidade..."
            className="text-lg p-4 border-2 focus:border-orange-500"
          />
        )

      case 'bairro':
      case 'neighborhood':
        // Verificar se máscara de bairro está ativa
        if (pergunta.mascaraBairro) {
          return (
            <div className="space-y-2">
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    const query = e.target.value
                    handleInputChange(query)
                    
                    // Buscar bairros se tiver cidade selecionada
                    if (cidadeSelecionada?.id) {
                      buscarBairros(cidadeSelecionada.id, query)
                    }
                  }}
                  placeholder={cidadeSelecionada ? "Digite o nome do bairro..." : "Selecione uma cidade primeiro"}
                  className="text-lg p-4 pl-12 border-2 focus:border-orange-500"
                  disabled={!cidadeSelecionada}
                />
                {loadingBairros && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              
              {!cidadeSelecionada && (
                <p className="text-sm text-amber-600 flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  Primeiro selecione uma cidade para buscar bairros
                </p>
              )}
              
              {bairros.length > 0 && (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg">
                  {bairros.map((bairro) => (
                    <button
                      key={bairro.id}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        handleInputChange(bairro.nome)
                        setBairros([])
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{bairro.nome}</span>
                        <span className="text-sm text-gray-500">- {bairro.municipio}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        }
        
        // Fallback para input normal se máscara não estiver ativa
        return (
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Digite o nome do bairro..."
            className="text-lg p-4 border-2 focus:border-orange-500"
          />
        )

      default:
        console.log('Tipo de pergunta não suportado:', {
          tipoOriginal: pergunta.tipo,
          tipoNormalizado: tipo,
          perguntaCompleta: pergunta
        })
        
        // Fallback para texto se não reconhecer o tipo
        return (
          <div className="space-y-4">
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              ⚠️ Tipo "{pergunta.tipo}" não reconhecido. Usando campo de texto como padrão.
            </div>
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Digite sua resposta..."
              className="text-lg p-4 border-2 focus:border-orange-500"
            />
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* Categoria da pergunta */}
      {pergunta.categoria && (
        <Badge variant="outline" className="mb-2">
          {pergunta.categoria.replace('_', ' ')}
        </Badge>
      )}
      
      {/* Input dinâmico */}
      <div className="space-y-2">
        {renderInput()}
      </div>
      
      {/* Insight IA dinâmico */}
      {pergunta.insightIA && (
        <InsightIA 
          pergunta={pergunta.texto}
          valor={inputValue}
        />
      )}
      
      {/* Informações adicionais */}
      {pergunta.opcoes?.descricao && (
        <p className="text-sm text-gray-500 mt-2">
          {pergunta.opcoes.descricao}
        </p>
      )}
    </div>
  )
}

export default DynamicQuestionRenderer
