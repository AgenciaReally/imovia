"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Home, 
  FileText, 
  Eye, 
  RefreshCcw, 
  Info,
  BarChart3,
  TrendingUp,
  Download,
  MessageSquare
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import DeepseekChat from "@/components/chat/DeepseekChat"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

// Interface para as respostas
interface Resposta {
  id: string
  perguntaId: string
  pergunta: {
    id: string
    texto: string
    tipo: string
    categoria: string
    fluxo: string
  }
  resposta?: string
  valor?: string
  dataResposta?: string
  createdAt?: string
  categoria?: string
}

// Interface para imóveis indicados
interface ImovelIndicado {
  id: number
  titulo: string
  endereco: string
  preco: number
  area: number
  quartos: number
  banheiros: number
  vagas: number
  tipo: string
  construtora: string
  imagem: string
  compatibilidade: number
  motivo: string
}

// Modal para exibir imóveis indicados
function ModalImoveisIndicados({ 
  imoveis, 
  loading, 
  onCarregar 
}: { 
  imoveis: ImovelIndicado[], 
  loading: boolean,
  onCarregar: () => void 
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="rounded-2xl gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg" 
          size="lg"
          onClick={onCarregar}
        >
          <Home className="h-5 w-5" />
          Imóveis Indicados
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Imóveis Indicados para Você</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {imoveis.map((imovel) => (
                <Card key={imovel.id} className="rounded-3xl overflow-hidden border border-orange-100 shadow-lg bg-gradient-to-r from-white to-orange-50/30">
                  <div className="flex flex-col md:flex-row">
                    <img 
                      src={imovel.imagem} 
                      alt={imovel.titulo}
                      className="w-full md:w-48 h-32 object-cover"
                    />
                    <CardContent className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{imovel.titulo}</h3>
                        <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 rounded-full border border-orange-300">
                          {imovel.compatibilidade}% compatível
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div><strong>Preço:</strong> R$ {imovel.preco.toLocaleString('pt-BR')}</div>
                        <div><strong>Área:</strong> {imovel.area}m²</div>
                        <div><strong>Quartos:</strong> {imovel.quartos}</div>
                        <div><strong>Vagas:</strong> {imovel.vagas}</div>
                      </div>
                      <p className="text-xs text-muted-foreground italic">{imovel.motivo}</p>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

// Modal para exibir respostas detalhadas
function ModalRespostasDetalhadas({ 
  respostas, 
  loading, 
  onCarregar 
}: { 
  respostas: Resposta[], 
  loading: boolean,
  onCarregar: () => void 
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="rounded-2xl gap-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 text-orange-600 shadow-sm" 
          size="lg"
          onClick={onCarregar}
        >
          <Eye className="h-5 w-5" />
          Ver Respostas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Suas Respostas Detalhadas</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {respostas.map((resposta) => (
                <Card key={resposta.id} className="rounded-xl border border-orange-100 bg-gradient-to-r from-white to-orange-50/20">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{resposta.pergunta.texto}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            <strong>Resposta:</strong> {(() => {
                              const valor = resposta.valor || 'Não respondido'
                              
                              // Se é um objeto JSON (arquivo), mostrar informações do arquivo
                              try {
                                const parsed = JSON.parse(valor)
                                if (parsed && typeof parsed === 'object' && parsed.filename) {
                                  return (
                                    <span className="flex items-center gap-2 mt-1">
                                      <span>📎 {parsed.filename}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {parsed.type}
                                      </Badge>
                                    </span>
                                  )
                                }
                              } catch {
                                // Não é JSON, continuar normalmente
                              }
                              
                              return <span>{valor}</span>
                            })()} 
                          </p>
                          
                          {/* Botão de download para arquivos */}
                          {(() => {
                            try {
                              const parsed = JSON.parse(resposta.valor || '{}')
                              if (parsed && typeof parsed === 'object' && parsed.url && parsed.filename) {
                                return (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2 h-7 text-xs gap-1"
                                    onClick={() => {
                                      const link = document.createElement('a')
                                      link.href = parsed.url
                                      link.download = parsed.filename
                                      link.target = '_blank'
                                      document.body.appendChild(link)
                                      link.click()
                                      document.body.removeChild(link)
                                    }}
                                  >
                                    <Download className="h-3 w-3" />
                                    Baixar
                                  </Button>
                                )
                              }
                            } catch {
                              return null
                            }
                            return null
                          })()} 
                        </div>
                        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                          {resposta.pergunta.categoria}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default function RespostasClientePage() {
  const [loading, setLoading] = useState(true)
  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [imoveisIndicados, setImoveisIndicados] = useState<ImovelIndicado[]>([])
  const [userName, setUserName] = useState("Cliente")
  const [loadingImoveis, setLoadingImoveis] = useState(false)
  const [loadingRespostas, setLoadingRespostas] = useState(false)
  const [showChat, setShowChat] = useState(false)
  
  // Carregar dados do usuário e resumo das respostas
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true)
      try {
        // Buscar informações do usuário
        const userResponse = await fetch('/api/cliente/dashboard')
        if (userResponse.ok) {
          const { data } = await userResponse.json()
          if (data?.userName) {
            setUserName(data.userName)
          }
        }
        
        // Buscar resumo das respostas
        const response = await fetch('/api/cliente/respostas')
        if (!response.ok) {
          throw new Error('Erro ao buscar respostas')
        }
        
        const response_data = await response.json()
        setRespostas(response_data.data || [])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar suas informações. Tente novamente mais tarde.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    carregarDados()
  }, [])
  
  // Carregar imóveis indicados
  const carregarImoveisIndicados = async () => {
    setLoadingImoveis(true)
    try {
      const response = await fetch('/api/cliente/imoveis-indicados')
      if (!response.ok) {
        throw new Error('Erro ao buscar imóveis indicados')
      }
      
      const { data } = await response.json()
      setImoveisIndicados(data)
    } catch (error) {
      console.error('Erro ao carregar imóveis indicados:', error)
      toast({
        title: "Erro ao carregar imóveis",
        description: "Não foi possível carregar os imóveis indicados.",
        variant: "destructive"
      })
    } finally {
      setLoadingImoveis(false)
    }
  }
  
  // Carregar respostas detalhadas
  const carregarRespostasDetalhadas = async () => {
    setLoadingRespostas(true)
    try {
      const response = await fetch('/api/cliente/respostas')
      if (!response.ok) {
        throw new Error('Erro ao buscar respostas')
      }
      
      const response_data = await response.json()
      setRespostas(response_data.data || [])
    } catch (error) {
      console.error('Erro ao carregar respostas:', error)
      toast({
        title: "Erro ao carregar respostas",
        description: "Não foi possível carregar as respostas detalhadas.",
        variant: "destructive"
      })
    } finally {
      setLoadingRespostas(false)
    }
  }
  
  // Download de relatório (placeholder)
  const downloadRelatorio = () => {
    toast({
      title: "Relatório em desenvolvimento",
      description: "A funcionalidade de download do relatório será implementada em breve.",
    })
  }
  
  // Estatísticas das respostas
  const totalRespostas = respostas.length
  const categorias = new Set(respostas.map(r => r.pergunta?.categoria)).size
  const ultimaResposta = respostas.sort((a, b) => 
    new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  )[0]
  
  return (
    <DashboardLayout userRole="cliente" userName={userName}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Minhas Respostas</h1>
            <p className="text-muted-foreground">
              Acesse suas respostas e imóveis recomendados de forma simples e intuitiva
            </p>
          </div>
          
          <Button 
            variant="outline"
            onClick={() => window.location.href = "/"}
            className="gap-2 border-orange-200 hover:bg-orange-50 text-orange-600"
          >
            <RefreshCcw className="h-4 w-4" />
            Nova Simulação
          </Button>
        </div>
        
        {/* Card Principal */}
        {loading ? (
          <Skeleton className="h-[400px] rounded-3xl" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="rounded-3xl border-2 shadow-xl bg-gradient-to-br from-white via-orange-50/30 to-white">
              <CardHeader className="text-center pb-6 bg-gradient-to-r from-white via-orange-50/40 to-white rounded-t-3xl">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-orange-600" />
                  Painel de Respostas
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Acesse suas respostas, imóveis indicados e relatórios de forma simples
                </p>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                {/* Estatísticas Resumidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-2xl text-center border border-orange-100 shadow-sm">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{totalRespostas}</p>
                    <p className="text-sm text-muted-foreground">Respostas</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-white to-orange-50/50 p-4 rounded-2xl text-center border border-orange-200/50 shadow-sm">
                    <div className="bg-gradient-to-br from-orange-400 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{categorias}</p>
                    <p className="text-sm text-muted-foreground">Categorias</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50/70 to-white p-4 rounded-2xl text-center border border-orange-100 shadow-sm">
                    <div className="bg-gradient-to-br from-orange-300 to-orange-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                      <RefreshCcw className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-orange-600">
                      {ultimaResposta ? new Date(ultimaResposta.createdAt || '').toLocaleDateString('pt-BR') : 'Nunca'}
                    </p>
                    <p className="text-sm text-muted-foreground">Última Atualização</p>
                  </div>
                </div>
                
                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <ModalImoveisIndicados 
                    imoveis={imoveisIndicados}
                    loading={loadingImoveis}
                    onCarregar={carregarImoveisIndicados}
                  />
              
               
                  
                  <ModalRespostasDetalhadas 
                    respostas={respostas}
                    loading={loadingRespostas}
                    onCarregar={carregarRespostasDetalhadas}
                  />
                </div>
                
                {/* Ação Secundária */}
                <div className="mt-6 text-center">
                  <Button 
                    variant="ghost" 
                    className="gap-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50/50" 
                    onClick={() => window.location.href = "/"}
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Fazer Nova Simulação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Chat IA Section */}
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <DeepseekChat />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
