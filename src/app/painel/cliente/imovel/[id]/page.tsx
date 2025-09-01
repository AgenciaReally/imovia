"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Heart, 
  HeartOff,
  Phone,
  Building,
  Star,
  ChevronDown,
  ChevronUp,
  User,
  MessageSquare
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "@/components/ui/use-toast"

// Interface para o imóvel
interface Imovel {
  id: string
  titulo: string
  preco: number
  area?: number
  quartos?: number
  banheiros?: number
  vagas?: number
  bairro?: string
  cidade?: string
  fotoPrincipal?: string
  construtora?: {
    id?: string
    nome: string
    telefone?: string
  }
  matchPercentage?: number
  motivos?: string[]
  tipo?: string
  dataSalvo?: string
}

// Interface para as respostas do usuário
interface RespostaUsuario {
  pergunta: string
  resposta: string
  categoria: string
  step: number
}

export default function ImovelDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [imovel, setImovel] = useState<Imovel | null>(null)
  const [respostasUsuario, setRespostasUsuario] = useState<RespostaUsuario[]>([])
  const [respostasAbertas, setRespostasAbertas] = useState(true)
  const [favorito, setFavorito] = useState(false)
  const [userName, setUserName] = useState("Cliente")

  useEffect(() => {
    if (params.id) {
      carregarDados()
    }
  }, [params.id])

  const carregarDados = async () => {
    setLoading(true)
    try {
      // Carregar dados do usuário
      const userResponse = await fetch('/api/cliente/dashboard')
      if (userResponse.ok) {
        const { data } = await userResponse.json()
        if (data?.userName) {
          setUserName(data.userName)
        }
      }

      // Carregar detalhes do imóvel
      const imovelResponse = await fetch(`/api/cliente/imoveis/${params.id}`)
      if (imovelResponse.ok) {
        const { success, data } = await imovelResponse.json()
        if (success) {
          setImovel(data)
          setFavorito(data.favorito || data.tipo === 'FAVORITO')
        }
      } else {
        toast({
          title: "Erro ao carregar imóvel",
          description: "Não foi possível carregar os detalhes do imóvel.",
          variant: "destructive"
        })
        router.push('/painel/cliente/imoveis')
        return
      }

      // Carregar respostas do usuário
      const respostasResponse = await fetch('/api/cliente/respostas')
      if (respostasResponse.ok) {
        const responseData = await respostasResponse.json()
        console.log('🔍 Resposta da API respostas:', responseData)
        
        // Verifica se é o novo formato ou o antigo
        let respostasData = []
        if (responseData.success && Array.isArray(responseData.data)) {
          respostasData = responseData.data
        } else if (Array.isArray(responseData)) {
          respostasData = responseData
        }
        
        console.log(`📋 Processando ${respostasData.length} respostas`)
        
        if (respostasData.length > 0) {
          // Agrupar e organizar respostas por step e categoria
          const respostasOrganizadas = respostasData
            .filter((item: any) => {
              // Filtrar apenas respostas válidas
              const temPergunta = item.pergunta && item.pergunta.texto;
              const temValor = item.valor && item.valor !== 'undefined' && item.valor.trim() !== '';
              return temPergunta && temValor;
            })
            .reduce((acc: any[], item: any) => {
              // Remover duplicatas baseado na pergunta
              const jaExiste = acc.find(resp => resp.pergunta === item.pergunta.texto);
              if (!jaExiste) {
                acc.push(item);
              }
              return acc;
            }, [])
            .sort((a: any, b: any) => 
              (a.pergunta?.step || 1) - (b.pergunta?.step || 1) || 
              (a.pergunta?.categoria || '').localeCompare(b.pergunta?.categoria || '')
            )
            .map((item: any) => ({
              pergunta: item.pergunta?.texto || 'Pergunta não disponível',
              resposta: typeof item.valor === 'object' ? JSON.stringify(item.valor) : (item.valor || 'Não respondido'),
              categoria: item.pergunta?.categoria || 'Geral',
              step: item.pergunta?.step || 1
            }))
          
          console.log(`✅ Organizadas ${respostasOrganizadas.length} respostas válidas`)
          setRespostasUsuario(respostasOrganizadas)
        } else {
          console.log('⚠️ Nenhuma resposta válida encontrada')
        }
      } else {
        console.error('❌ Erro ao buscar respostas:', respostasResponse.status)
      }

    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro ao carregar",
        description: "Ocorreu um erro ao carregar os dados.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorito = async () => {
    if (!imovel) return
    
    try {
      setFavorito(!favorito) // Otimistic update
      
      const response = await fetch(`/api/cliente/imoveis/${imovel.id}/favorito`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorito: !favorito })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar favorito')
      }
      
      toast({
        title: favorito ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: `O imóvel foi ${favorito ? 'removido dos' : 'adicionado aos'} seus favoritos.`,
      })
    } catch (error) {
      setFavorito(favorito) // Revert on error
      toast({
        title: "Erro ao atualizar favorito",
        description: "Não foi possível atualizar o status de favorito.",
        variant: "destructive"
      })
    }
  }

  const agruparRespostasPorCategoria = (respostas: RespostaUsuario[]) => {
    return respostas.reduce((grupos, resposta) => {
      const categoria = resposta.categoria
      if (!grupos[categoria]) {
        grupos[categoria] = []
      }
      grupos[categoria].push(resposta)
      return grupos
    }, {} as Record<string, RespostaUsuario[]>)
  }

  if (loading) {
    return (
      <DashboardLayout userRole="cliente" userName={userName}>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-muted rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!imovel) {
    return (
      <DashboardLayout userRole="cliente" userName={userName}>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Imóvel não encontrado</h2>
          <p className="text-muted-foreground mb-4">O imóvel solicitado não foi encontrado.</p>
          <Button onClick={() => router.push('/painel/cliente/imoveis')}>
            Voltar para Meus Imóveis
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const respostasAgrupadas = agruparRespostasPorCategoria(respostasUsuario)

  return (
    <DashboardLayout userRole="cliente" userName={userName}>
      <div className="space-y-6">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/painel/cliente/imoveis')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Detalhes do Imóvel</h1>
            <p className="text-muted-foreground">
              Informações completas e suas respostas do questionário
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal - Detalhes do imóvel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card principal do imóvel */}
            <Card>
              <div className="relative h-64 overflow-hidden rounded-t-lg">
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ 
                    backgroundImage: `url(${imovel.fotoPrincipal || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop'})` 
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Badge de match */}
                {imovel.matchPercentage && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm py-2 px-3 rounded-full shadow-sm">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary fill-primary" />
                      <span className="text-primary font-semibold">
                        {imovel.matchPercentage}% match
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Preço */}
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-2xl font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(imovel.preco) || 300000)}
                  </p>
                </div>
                
                {/* Botão de favorito */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={handleToggleFavorito}
                >
                  {favorito ? (
                    <Heart className="h-4 w-4 fill-primary text-primary" />
                  ) : (
                    <HeartOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-2">{imovel.titulo}</h2>
                {/* Endereço removido conforme solicitado */}
                
                {/* Características */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {imovel.quartos && (
                    <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                      <Bed className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-sm text-muted-foreground">Quartos</span>
                      <span className="font-semibold">{imovel.quartos}</span>
                    </div>
                  )}
                  {imovel.banheiros && (
                    <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                      <Bath className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-sm text-muted-foreground">Banheiros</span>
                      <span className="font-semibold">{imovel.banheiros}</span>
                    </div>
                  )}
                  {imovel.area && (
                    <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                      <Square className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-sm text-muted-foreground">Área</span>
                      <span className="font-semibold">{imovel.area}m²</span>
                    </div>
                  )}
                  {imovel.vagas && (
                    <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                      <Car className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-sm text-muted-foreground">Vagas</span>
                      <span className="font-semibold">{imovel.vagas}</span>
                    </div>
                  )}
                </div>
                
                {/* Motivos da recomendação */}
                {imovel.motivos && imovel.motivos.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3">Por que é perfeito para você:</h3>
                    <ul className="space-y-2">
                      {imovel.motivos
                        .filter((motivo) => {
                          // Filtrar motivos que contenham endereços ou informações de localização
                          const motivoLower = motivo.toLowerCase();
                          const isEndereco = motivoLower.includes('rua ') || 
                                           motivoLower.includes('avenida ') || 
                                           motivoLower.includes('av. ') ||
                                           motivoLower.includes('alameda ') ||
                                           motivoLower.includes('endereço') ||
                                           motivoLower.includes('endereco') ||
                                           motivoLower.includes('localizado em') ||
                                           motivoLower.includes('situado em') ||
                                           motivoLower.includes('localização') ||
                                           motivoLower.includes('localizacao') ||
                                           motivoLower.match(/\b\d+[\s\-]*(rua|av|avenida|alameda)/i) ||
                                           motivoLower.match(/\b(cep|zip)\s*:?\s*\d/i);
                          return !isEndereco;
                        })
                        .map((motivo, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-500 text-sm mt-1">✓</span>
                            <span className="text-sm">{motivo}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                
                {/* Construtora */}
                {imovel.construtora && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">{imovel.construtora.nome}</span>
                      </div>
                      {imovel.construtora.telefone && (
                        <Button 
                          size="sm" 
                          className="gap-2 bg-green-600 hover:bg-green-700 text-white border-green-600"
                          onClick={() => {
                            const numeroLimpo = imovel.construtora?.telefone?.replace(/\D/g, '') || '';
                            const mensagem = encodeURIComponent(
                              `Olá! Tenho interesse no imóvel "${imovel.titulo}". ` +
                              `Gostaria de mais informações. ` +
                              `Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(imovel.preco) || 300000)}`
                            );
                            window.open(`https://wa.me/55${numeroLimpo}?text=${mensagem}`, '_blank');
                          }}
                        >
                          <Phone className="h-4 w-4" />
                          WhatsApp
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Coluna lateral - Respostas do usuário */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Suas Preferências
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Com base no que você nos contou, este imóvel é perfeito para seu perfil
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.keys(respostasAgrupadas).length > 0 ? (
                  <Collapsible open={respostasAbertas} onOpenChange={setRespostasAbertas}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                        <span className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Ver todas as respostas ({respostasUsuario.length})
                        </span>
                        {respostasAbertas ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="space-y-4 mt-4">
                      {Object.entries(respostasAgrupadas).map(([categoria, respostas]) => (
                        <div key={categoria} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {categoria.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {respostas.length} {respostas.length === 1 ? 'resposta' : 'respostas'}
                            </span>
                          </div>
                          
                          <div className="space-y-2 pl-2">
                            {respostas.map((resposta, idx) => (
                              <div key={idx} className="text-sm space-y-2 p-3 bg-background/50 rounded-lg border">
                                <p className="font-medium text-primary text-xs uppercase tracking-wide">
                                  {resposta.pergunta}
                                </p>
                                <p className="text-foreground font-medium">
                                  {resposta.resposta}
                                </p>
                              </div>
                            ))}
                          </div>
                          
                          {categoria !== Object.keys(respostasAgrupadas)[Object.keys(respostasAgrupadas).length - 1] && (
                            <Separator />
                          )}
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma resposta encontrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
