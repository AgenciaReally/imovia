"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Filter, RefreshCw, CheckCircle2, Ban, ArrowUpCircle, ArrowDownCircle, Settings, Sliders } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { PerguntaCard } from "@/components/dashboard/pergunta/pergunta-card"
import { PerguntaForm } from "@/components/dashboard/pergunta/pergunta-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Pergunta,
  CATEGORIAS_PERGUNTA,
  TIPOS_FLUXO,
  buscarPerguntas,
  criarPergunta,
  atualizarPergunta,
  excluirPergunta,
  atualizarOrdemPergunta
} from "@/services/pergunta-service"
import { useToast } from "@/components/ui/use-toast"

// Schema para validação do formulário de configurações
const configFormSchema = z.object({
  limitePergunta: z.number().min(1).max(100),
  intensidade: z.number().min(0).max(100),
  instrucoesAvancadas: z.string().optional(),
  modeloIA: z.enum(["deepseek-r1", "chatgpt"]).default("deepseek-r1"),
});

type ConfigFormValues = z.infer<typeof configFormSchema>

export default function PerguntasPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Estados
  const [loading, setLoading] = useState(true)
  const [perguntas, setPerguntas] = useState<Pergunta[]>([])
  const [perguntasFiltradas, setPerguntasFiltradas] = useState<Pergunta[]>([])
  const [busca, setBusca] = useState("")
  const [configModalOpen, setConfigModalOpen] = useState(false)
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null)
  const [fluxoFiltro, setFluxoFiltro] = useState<string | null>(null)
  const [apenasAtivas, setApenasAtivas] = useState<boolean | null>(null)
  
  // Estado para o formulário de pergunta
  const [perguntaParaEditar, setPerguntaParaEditar] = useState<Pergunta | null>(null)
  const [formAberto, setFormAberto] = useState(false)
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<Pergunta | null>(null)
  
  // Carregar perguntas
  const carregarPerguntas = async () => {
    setLoading(true)
    try {
      const perguntas = await buscarPerguntas()
      setPerguntas(perguntas)
      setPerguntasFiltradas(perguntas)
    } catch (error: any) {
      console.error("Erro ao carregar perguntas:", error)
      toast({
        title: "Erro ao carregar perguntas",
        description: error?.message || "Ocorreu um erro ao carregar as perguntas. Por favor, tente novamente.",
        variant: "destructive"
      })
      // Inicializar com array vazio para evitar erros na interface
      setPerguntas([])
      setPerguntasFiltradas([])
    } finally {
      setLoading(false)
    }
  }
  
  // Carregar dados na inicialização
  useEffect(() => {
    carregarPerguntas()
  }, [])
  
  // Filtrar perguntas
  useEffect(() => {
    let filtradas = [...perguntas]
    
    // Filtrar por busca
    if (busca) {
      const termo = busca.toLowerCase()
      filtradas = filtradas.filter(pergunta => 
        pergunta.texto.toLowerCase().includes(termo)
      )
    }
    
    // Filtrar por categoria
    if (categoriaFiltro) {
      filtradas = filtradas.filter(pergunta => pergunta.categoria === categoriaFiltro)
    }
    
    // Filtrar por fluxo
    if (fluxoFiltro) {
      filtradas = filtradas.filter(pergunta => 
        pergunta.fluxo === fluxoFiltro || pergunta.fluxo === "AMBOS"
      )
    }
    
    // Filtrar por status ativo
    if (apenasAtivas !== null) {
      filtradas = filtradas.filter(pergunta => pergunta.ativa === apenasAtivas)
    }
    
    // Ordenar por categoria e ordem
    filtradas.sort((a, b) => {
      if (a.categoria !== b.categoria) {
        return a.categoria.localeCompare(b.categoria)
      }
      return a.ordem - b.ordem
    })
    
    setPerguntasFiltradas(filtradas)
  }, [perguntas, busca, categoriaFiltro, fluxoFiltro, apenasAtivas])
  
  // Funções de manipulação
  const handleEditarPergunta = (pergunta: Pergunta) => {
    setPerguntaParaEditar(pergunta)
    setFormAberto(true)
  }
  
  const handleNovaPergunta = () => {
    setPerguntaParaEditar(null)
    setFormAberto(true)
  }
  
  const handleSalvarPergunta = async (data: any) => {
    try {
      if (perguntaParaEditar) {
        // Atualizar pergunta existente
        await atualizarPergunta(perguntaParaEditar.id, data)
        toast({
          title: "Pergunta atualizada",
          description: "A pergunta foi atualizada com sucesso."
        })
      } else {
        // Criar nova pergunta
        await criarPergunta(data)
        toast({
          title: "Pergunta criada",
          description: "A nova pergunta foi criada com sucesso."
        })
      }
      
      // Recarregar perguntas e fechar formulário
      carregarPerguntas()
      setFormAberto(false)
    } catch (error) {
      console.error("Erro ao salvar pergunta:", error)
      toast({
        title: "Erro ao salvar pergunta",
        description: "Ocorreu um erro ao salvar a pergunta. Por favor, tente novamente.",
        variant: "destructive"
      })
    }
  }
  
  const handleExcluirPergunta = async (pergunta: Pergunta) => {
    try {
      await excluirPergunta(pergunta.id)
      toast({
        title: "Pergunta excluída",
        description: "A pergunta foi excluída com sucesso."
      })
      
      // Recarregar perguntas e fechar diálogo de confirmação
      carregarPerguntas()
      setConfirmacaoExclusao(null)
    } catch (error) {
      console.error("Erro ao excluir pergunta:", error)
      toast({
        title: "Erro ao excluir pergunta",
        description: "Ocorreu um erro ao excluir a pergunta. Por favor, tente novamente.",
        variant: "destructive"
      })
    }
  }
  
  const handleToggleAtiva = async (pergunta: Pergunta, novoEstado: boolean) => {
    try {
      await atualizarPergunta(pergunta.id, { ativa: novoEstado })
      toast({
        title: novoEstado ? "Pergunta ativada" : "Pergunta desativada",
        description: `A pergunta foi ${novoEstado ? "ativada" : "desativada"} com sucesso.`
      })
      
      // Recarregar perguntas
      carregarPerguntas()
    } catch (error) {
      console.error("Erro ao alterar status da pergunta:", error)
      toast({
        title: "Erro ao alterar status",
        description: "Ocorreu um erro ao alterar o status da pergunta. Por favor, tente novamente.",
        variant: "destructive"
      })
    }
  }
  
  const handleMoverPergunta = async (pergunta: Pergunta, direcao: "cima" | "baixo") => {
    try {
      // Encontrar todas as perguntas da mesma categoria
      const perguntasNaCategoria = perguntas.filter(p => p.categoria === pergunta.categoria)
        .sort((a, b) => a.ordem - b.ordem)
      
      // Encontrar o índice atual na categoria
      const indiceAtual = perguntasNaCategoria.findIndex(p => p.id === pergunta.id)
      
      if (direcao === "cima" && indiceAtual > 0) {
        // Mover para cima
        const novaOrdem = perguntasNaCategoria[indiceAtual - 1].ordem
        await atualizarOrdemPergunta(pergunta.id, novaOrdem, pergunta.categoria)
      } else if (direcao === "baixo" && indiceAtual < perguntasNaCategoria.length - 1) {
        // Mover para baixo
        const novaOrdem = perguntasNaCategoria[indiceAtual + 1].ordem
        await atualizarOrdemPergunta(pergunta.id, novaOrdem, pergunta.categoria)
      }
      
      // Recarregar perguntas
      carregarPerguntas()
    } catch (error) {
      console.error("Erro ao mover pergunta:", error)
      toast({
        title: "Erro ao reordenar",
        description: "Ocorreu um erro ao reordenar a pergunta. Por favor, tente novamente.",
        variant: "destructive"
      })
    }
  }
  
  // Agrupar perguntas por categoria
  const perguntasPorCategoria = perguntasFiltradas.reduce((acc, pergunta) => {
    const categoria = pergunta.categoria
    if (!acc[categoria]) {
      acc[categoria] = []
    }
    acc[categoria].push(pergunta)
    return acc
  }, {} as Record<string, Pergunta[]>)
  
  // Array de skeletons para estado de carregamento
  const skeletonArray = Array(10).fill(null)
  
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6 py-2 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-1.5"
          >
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Perguntas</h1>
            <p className="text-muted-foreground mt-1">
              Configure todas as perguntas utilizadas nos formulários da plataforma
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex space-x-3">
              <Button 
                size="lg"
                className="gap-2 relative overflow-hidden group"
                onClick={handleNovaPergunta}
              >
                <div className="absolute inset-0 w-3 bg-white dark:bg-gray-800 opacity-10 transform -skew-x-12 group-hover:animate-shimmer" />
                <Plus className="h-5 w-5" />
                <span>Nova Pergunta</span>
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="gap-2 relative overflow-hidden group"
                onClick={() => setConfigModalOpen(true)}
              >
                <div className="absolute inset-0 w-3 bg-white dark:bg-gray-800 opacity-10 transform -skew-x-12 group-hover:animate-shimmer" />
                <Settings className="h-5 w-5" />
                <span>Configurar Perguntas</span>
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar perguntas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-row gap-2">
            <Select value={categoriaFiltro || "all"} onValueChange={(v) => setCategoriaFiltro(v === "all" ? null : v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {CATEGORIAS_PERGUNTA.map((cat) => (
                  <SelectItem key={cat.valor} value={cat.valor}>
                    {cat.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={fluxoFiltro || "all"} onValueChange={(v) => setFluxoFiltro(v === "all" ? null : v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Fluxo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os fluxos</SelectItem>
                {TIPOS_FLUXO.map((fluxo) => (
                  <SelectItem key={fluxo.valor} value={fluxo.valor}>
                    {fluxo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={apenasAtivas !== null ? apenasAtivas.toString() : "all"}
              onValueChange={(v) => {
                if (v === "all") {
                  setApenasAtivas(null)
                } else {
                  setApenasAtivas(v === "true")
                }
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Ativas</SelectItem>
                <SelectItem value="false">Inativas</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={() => {
              setBusca("")
              setCategoriaFiltro(null)
              setFluxoFiltro(null)
              setApenasAtivas(null)
            }}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Contagem de resultados */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Mostrando {perguntasFiltradas.length} de {perguntas.length} perguntas
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="flex gap-1 items-center">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span>{perguntas.filter(p => p.ativa).length} ativas</span>
            </Badge>
            <Badge variant="outline" className="flex gap-1 items-center">
              <Ban className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{perguntas.filter(p => !p.ativa).length} inativas</span>
            </Badge>
          </div>
        </div>
        
        {/* Lista de perguntas */}
        {loading ? (
          <div className="space-y-4">
            {skeletonArray.map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : perguntasFiltradas.length === 0 ? (
          <Alert>
            <AlertTitle>Nenhuma pergunta encontrada</AlertTitle>
            <AlertDescription>
              Não foram encontradas perguntas com os filtros aplicados.
              Tente ajustar os filtros ou criar uma nova pergunta.
            </AlertDescription>
          </Alert>
        ) : (
          <Accordion type="multiple" defaultValue={Object.keys(perguntasPorCategoria)} className="space-y-4">
            {Object.entries(perguntasPorCategoria).map(([categoria, perguntasNaCategoria]) => {
              const categoriaNome = CATEGORIAS_PERGUNTA.find(c => c.valor === categoria)?.nome || categoria
              
              return (
                <AccordionItem key={categoria} value={categoria}>
                  <AccordionTrigger className="text-lg font-medium hover:no-underline">
                    <div className="flex items-center">
                      {categoriaNome}
                      <Badge variant="outline" className="ml-2">
                        {perguntasNaCategoria.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 gap-4 pt-4">
                      {perguntasNaCategoria.map((pergunta, index) => (
                        <PerguntaCard
                          key={pergunta.id}
                          pergunta={pergunta}
                          onEdit={handleEditarPergunta}
                          onDelete={(p) => setConfirmacaoExclusao(p)}
                          onToggleAtiva={handleToggleAtiva}
                          onMoveUp={() => handleMoverPergunta(pergunta, "cima")}
                          onMoveDown={() => handleMoverPergunta(pergunta, "baixo")}
                          index={index}
                          total={perguntasNaCategoria.length}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        )}
        
        {/* Formulário de edição/criação de pergunta */}
        <PerguntaForm 
          perguntaExistente={perguntaParaEditar || undefined}
          open={formAberto}
          onClose={() => setFormAberto(false)}
          onSave={handleSalvarPergunta}
        />
        
        {/* Diálogo de confirmação de exclusão */}
        <Dialog open={!!confirmacaoExclusao} onOpenChange={(open) => !open && setConfirmacaoExclusao(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Você tem certeza que deseja excluir a pergunta &quot;{confirmacaoExclusao?.texto}&quot;?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmacaoExclusao(null)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => confirmacaoExclusao && handleExcluirPergunta(confirmacaoExclusao)}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal de Configuração de Perguntas */}
      <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurar Perguntas
            </DialogTitle>
            <DialogDescription>
              Configure os parâmetros para o sistema de perguntas da IA
            </DialogDescription>
          </DialogHeader>

          <ConfiguracaoForm onClose={() => setConfigModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

// Componente do formulário de configuração de perguntas
function ConfiguracaoForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast()

  // Formulário usando react-hook-form e zod
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      limitePergunta: 10,
      intensidade: 70,
      instrucoesAvancadas: "",
      modeloIA: "deepseek-r1",
    },
  })

  // Função para salvar as configurações
  async function onSubmit(data: ConfigFormValues) {
    try {
      // Aqui você implementaria a chamada para a API para salvar as configurações
      // Por enquanto apenas mostraremos um toast de sucesso
      console.log("Configurações salvas:", data)
      
      toast({
        title: "Configurações salvas",
        description: "As configurações de perguntas foram salvas com sucesso.",
      })

      onClose()
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="limitePergunta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limite de Perguntas</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Slider
                    min={1}
                    max={100}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="flex-1"
                  />
                  <span className="font-medium text-lg min-w-[40px] text-center">
                    {field.value}
                  </span>
                </div>
              </FormControl>
              <FormDescription>
                Número máximo de perguntas que podem ser feitas no sistema
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intensidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intensidade das Perguntas</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="flex-1"
                  />
                  <span className="font-medium text-lg min-w-[40px] text-center">
                    {field.value}%
                  </span>
                </div>
              </FormControl>
              <FormDescription>
                Ajuste a intensidade ou profundidade das perguntas geradas pela IA
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="modeloIA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo de IA</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="deepseek-r1">DeepSeek R1 (Recomendado)</SelectItem>
                  <SelectItem value="chatgpt">ChatGPT</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Selecione o modelo de IA utilizado para gerar as perguntas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instrucoesAvancadas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instruções Avançadas para a IA</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite instruções adicionais para a IA ao gerar perguntas..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Instruções específicas para a IA seguir ao gerar as perguntas (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Configurações
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
