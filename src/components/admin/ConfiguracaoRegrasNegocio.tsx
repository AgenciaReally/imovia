"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Trash2, 
  Edit, 
  DollarSign, 
  Percent, 
  AlertTriangle,
  Calculator,
  Eye,
  EyeOff,
  Save,
  X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RegraNegocio {
  id?: string
  nome: string
  descricao?: string
  tipo: 'ENTRADA' | 'FINANCIAMENTO' | 'RENDA' | 'ENCERRAMENTO'
  ativa: boolean
  condicao: any
  acao: 'CONTINUAR' | 'ENCERRAR' | 'CRIAR_PERGUNTA' | 'OCULTAR_PERGUNTA'
  valorMinimo?: number
  valorMaximo?: number
  percentualMinimo?: number
  percentualMaximo?: number
  taxaJuros?: number
  taxaAprovacao?: number
  custoAdicionalITBI?: number
  custoEscrituraReg?: number
  taxaAvaliacaoImovel?: number
  custoSegurosTaxas?: number
  mensagemEncerramento?: string
  perguntasCriar?: any
  perguntasOcultar?: string[]
  ordem: number
}

interface ConfiguracaoRegrasNegocioProps {
  onClose: () => void
}

const regrasTemplate = {
  ENTRADA: {
    nome: "Controle de Entrada",
    descricao: "Verifica se o cliente tem entrada suficiente",
    valorMinimo: 50000,
    valorMaximo: 10000000,
    acao: "ENCERRAR" as const,
    mensagemEncerramento: "Infelizmente não temos imóveis que atendam ao seu valor de entrada. Entre em contato conosco para outras opções."
  },
  FINANCIAMENTO: {
    nome: "Aprovação de Financiamento",
    descricao: "Regras para aprovação de financiamento bancário",
    percentualMinimo: 30,
    percentualMaximo: 80,
    taxaJuros: 0.08,
    taxaAprovacao: 0.7,
    acao: "CONTINUAR" as const
  },
  RENDA: {
    nome: "Análise de Renda",
    descricao: "Verifica compatibilidade da renda com parcela",
    percentualMaximo: 30, // 30% da renda
    acao: "OCULTAR_PERGUNTA" as const
  },
  ENCERRAMENTO: {
    nome: "Encerramento Antecipado",
    descricao: "Condições para encerrar o formulário antes do final",
    acao: "CRIAR_PERGUNTA" as const
  }
}

export function ConfiguracaoRegrasNegocio({ onClose }: ConfiguracaoRegrasNegocioProps) {
  const [regras, setRegras] = useState<RegraNegocio[]>([])
  const [loading, setLoading] = useState(false)
  const [editandoRegra, setEditandoRegra] = useState<RegraNegocio | null>(null)
  const [novaRegra, setNovaRegra] = useState<Partial<RegraNegocio>>({})

  useEffect(() => {
    carregarRegras()
  }, [])

  const carregarRegras = async () => {
    try {
      const response = await fetch('/api/admin/regras-negocio')
      if (response.ok) {
        const data = await response.json()
        setRegras(data.regras || [])
      }
    } catch (error) {
      console.error('Erro ao carregar regras:', error)
    }
  }

  const salvarRegra = async (regra: Partial<RegraNegocio>) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/regras-negocio', {
        method: regra.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regra)
      })

      if (response.ok) {
        toast({
          title: "Regra salva",
          description: `Regra ${regra.id ? 'atualizada' : 'criada'} com sucesso.`
        })
        await carregarRegras()
        setEditandoRegra(null)
        setNovaRegra({})
      } else {
        throw new Error('Erro ao salvar regra')
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a regra.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const excluirRegra = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta regra?')) return

    try {
      const response = await fetch(`/api/admin/regras-negocio/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Regra excluída",
          description: "A regra foi removida com sucesso."
        })
        await carregarRegras()
      }
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a regra.",
        variant: "destructive"
      })
    }
  }

  const criarRegraTemplate = (tipo: keyof typeof regrasTemplate) => {
    const template = regrasTemplate[tipo]
    setNovaRegra({
      ...template,
      tipo,
      ativa: true,
      condicao: {},
      ordem: regras.length,
      custoAdicionalITBI: 0.03,
      custoEscrituraReg: 0.015,
      taxaAvaliacaoImovel: 2500,
      custoSegurosTaxas: 15000,
      perguntasOcultar: []
    })
  }

  const FormRegra = ({ regra, onChange, onSave, onCancel }: any) => (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {regra.id ? 'Editando Regra' : 'Nova Regra'}
          </span>
          <div className="flex gap-2">
            <Button size="sm" onClick={onSave} disabled={loading}>
              <Save className="h-4 w-4 mr-1" />
              Salvar
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="basico" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basico">Básico</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="acoes">Ações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basico" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome da Regra</Label>
                <Input
                  id="nome"
                  value={regra.nome || ''}
                  onChange={(e) => onChange({ ...regra, nome: e.target.value })}
                  placeholder="Ex: Controle de Entrada"
                />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={regra.tipo} onValueChange={(value) => onChange({ ...regra, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTRADA">Entrada</SelectItem>
                    <SelectItem value="FINANCIAMENTO">Financiamento</SelectItem>
                    <SelectItem value="RENDA">Renda</SelectItem>
                    <SelectItem value="ENCERRAMENTO">Encerramento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={regra.descricao || ''}
                onChange={(e) => onChange({ ...regra, descricao: e.target.value })}
                placeholder="Descreva quando esta regra deve ser aplicada..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ativa"
                checked={regra.ativa || false}
                onCheckedChange={(checked) => onChange({ ...regra, ativa: checked })}
              />
              <Label htmlFor="ativa">Regra ativa</Label>
            </div>
          </TabsContent>
          
          <TabsContent value="financeiro" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valorMinimo">Valor Mínimo (R$)</Label>
                <Input
                  id="valorMinimo"
                  type="number"
                  value={regra.valorMinimo || ''}
                  onChange={(e) => onChange({ ...regra, valorMinimo: Number(e.target.value) })}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="valorMaximo">Valor Máximo (R$)</Label>
                <Input
                  id="valorMaximo"
                  type="number"
                  value={regra.valorMaximo || ''}
                  onChange={(e) => onChange({ ...regra, valorMaximo: Number(e.target.value) })}
                  placeholder="10000000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taxaJuros">Taxa de Juros (%)</Label>
                <Input
                  id="taxaJuros"
                  type="number"
                  step="0.01"
                  value={regra.taxaJuros ? regra.taxaJuros * 100 : ''}
                  onChange={(e) => onChange({ ...regra, taxaJuros: Number(e.target.value) / 100 })}
                  placeholder="8.5"
                />
              </div>
              <div>
                <Label htmlFor="taxaAprovacao">Taxa de Aprovação (%)</Label>
                <Input
                  id="taxaAprovacao"
                  type="number"
                  step="0.01"
                  value={regra.taxaAprovacao ? regra.taxaAprovacao * 100 : ''}
                  onChange={(e) => onChange({ ...regra, taxaAprovacao: Number(e.target.value) / 100 })}
                  placeholder="70"
                />
              </div>
            </div>

            <Separator />
            <h4 className="font-medium">Custos Adicionais</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="custoITBI">ITBI (% do imóvel)</Label>
                <Input
                  id="custoITBI"
                  type="number"
                  step="0.001"
                  value={regra.custoAdicionalITBI ? regra.custoAdicionalITBI * 100 : ''}
                  onChange={(e) => onChange({ ...regra, custoAdicionalITBI: Number(e.target.value) / 100 })}
                  placeholder="3"
                />
              </div>
              <div>
                <Label htmlFor="custoEscritura">Escritura (%)</Label>
                <Input
                  id="custoEscritura"
                  type="number"
                  step="0.001"
                  value={regra.custoEscrituraReg ? regra.custoEscrituraReg * 100 : ''}
                  onChange={(e) => onChange({ ...regra, custoEscrituraReg: Number(e.target.value) / 100 })}
                  placeholder="1.5"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="acoes" className="space-y-4">
            <div>
              <Label htmlFor="acao">Ação quando regra ativada</Label>
              <Select value={regra.acao} onValueChange={(value) => onChange({ ...regra, acao: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONTINUAR">Continuar formulário</SelectItem>
                  <SelectItem value="ENCERRAR">Encerrar formulário</SelectItem>
                  <SelectItem value="CRIAR_PERGUNTA">Criar nova pergunta</SelectItem>
                  <SelectItem value="OCULTAR_PERGUNTA">Ocultar pergunta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {regra.acao === 'ENCERRAR' && (
              <div>
                <Label htmlFor="mensagemEncerramento">Mensagem de Encerramento</Label>
                <Textarea
                  id="mensagemEncerramento"
                  value={regra.mensagemEncerramento || ''}
                  onChange={(e) => onChange({ ...regra, mensagemEncerramento: e.target.value })}
                  placeholder="Mensagem que será exibida ao usuário quando o formulário for encerrado..."
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header com botões de templates */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Regras de Negócio</h3>
          <p className="text-sm text-muted-foreground">
            Configure regras para controlar o fluxo do formulário dinamicamente
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => criarRegraTemplate('ENTRADA')}>
            <DollarSign className="h-4 w-4 mr-1" />
            Entrada
          </Button>
          <Button size="sm" variant="outline" onClick={() => criarRegraTemplate('FINANCIAMENTO')}>
            <Calculator className="h-4 w-4 mr-1" />
            Financiamento
          </Button>
          <Button size="sm" variant="outline" onClick={() => criarRegraTemplate('RENDA')}>
            <Percent className="h-4 w-4 mr-1" />
            Renda
          </Button>
        </div>
      </div>

      {/* Formulário de nova regra */}
      {Object.keys(novaRegra).length > 0 && (
        <FormRegra
          regra={novaRegra}
          onChange={setNovaRegra}
          onSave={() => salvarRegra(novaRegra)}
          onCancel={() => setNovaRegra({})}
        />
      )}

      {/* Formulário de edição */}
      {editandoRegra && (
        <FormRegra
          regra={editandoRegra}
          onChange={setEditandoRegra}
          onSave={() => salvarRegra(editandoRegra)}
          onCancel={() => setEditandoRegra(null)}
        />
      )}

      {/* Lista de regras existentes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Regras Configuradas ({regras.length})</h4>
        </div>

        {regras.length === 0 ? (
          <Card className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Nenhuma regra configurada</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie regras para controlar o fluxo do formulário dinamicamente
            </p>
            <Button onClick={() => criarRegraTemplate('ENTRADA')}>
              Criar primeira regra
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {regras.map((regra, index) => (
              <motion.div
                key={regra.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-l-4 ${regra.ativa ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{regra.nome}</h4>
                          <Badge variant={regra.ativa ? 'default' : 'secondary'}>
                            {regra.tipo}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {regra.ativa ? (
                              <Eye className="h-4 w-4 text-green-500" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {regra.descricao}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Ação: {regra.acao}</span>
                          {regra.valorMinimo && (
                            <span>Min: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(regra.valorMinimo) || 0)}</span>
                          )}
                          {regra.valorMaximo && (
                            <span>Max: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(regra.valorMaximo) || 0)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditandoRegra(regra)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => regra.id && excluirRegra(regra.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onClose}>
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
