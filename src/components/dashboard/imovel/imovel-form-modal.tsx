"use client"

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Building2, Loader2, Home, X, Plus, PlusCircle, Upload, ImageIcon, Check } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { put } from "@vercel/blob"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { getConstrutoras, ConstrutoraDashboard } from "@/services/construtora-service"
import { ImovelDisplay } from "@/services/imovel-service"
import { buscarPerguntas, Pergunta } from "@/services/pergunta-service"

// Schema de validação para o formulário
const imovelFormSchema = z.object({
  titulo: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres" }),
  descricao: z.string().min(20, { message: "A descrição deve ter pelo menos 20 caracteres" }),
  preco: z.coerce.number().positive({ message: "O preço deve ser um valor positivo" }),
  area: z.coerce.number().positive({ message: "A área deve ser um valor positivo" }),
  quartos: z.coerce.number().int().nonnegative({ message: "O número de quartos deve ser não negativo" }),
  banheiros: z.coerce.number().int().nonnegative({ message: "O número de banheiros deve ser não negativo" }),
  vagas: z.coerce.number().int().nonnegative({ message: "O número de vagas deve ser não negativo" }),
  latitude: z.coerce.number().min(-90).max(90, { message: "Latitude deve estar entre -90 e 90" }),
  longitude: z.coerce.number().min(-180).max(180, { message: "Longitude deve estar entre -180 e 180" }),
  telefoneContato: z.string().optional(),
  endereco: z.string().min(10, { message: "O endereço deve ter pelo menos 10 caracteres" }),
  fotoPrincipal: z.any().optional(), // Alterado para aceitar arquivos
  galeriaFotos: z.array(z.any()).default([]), // Alterado para aceitar arquivos
  caracteristicasArray: z.array(z.string()).default([]),
  tipoImovel: z.string().optional(), // ID do tipo de imóvel
  status: z.string().optional(),
  perguntasIds: z.array(z.string()).default([]), // IDs das perguntas vinculadas ao imóvel
  destaque: z.boolean().default(false),
  ativo: z.boolean().default(true),
  construtoraId: z.string().optional(), // Tornando construtoraId opcional
})

type ImovelFormValues = z.infer<typeof imovelFormSchema>

type ImovelNovo = {
  titulo: string
  descricao: string
  preco: number
  area: number
  quartos: number
  banheiros: number
  vagas: number
  latitude: number
  longitude: number
  telefoneContato?: string
  endereco: string
  fotoPrincipal?: string
  galeriaFotos?: string[]
  caracteristicasArray: string[]
  tipoImovelId?: string // ID do tipo de imóvel (alterado de tipoImovel)
  tipoImovel?: string | undefined // Campo antigo mantido para compatibilidade
  status?: string
  perguntasIds?: string[] // IDs das perguntas vinculadas ao imóvel
  destaque: boolean
  ativo: boolean
  construtoraId?: string // Tornando construtoraId opcional
  caracteristicas?: Record<string, any>
}

interface ImovelFormModalProps {
  onSuccess?: () => void;
  imovel?: ImovelDisplay & {
    perguntas?: Array<{ perguntaId: string }>
  }; // Imóvel existente para edição (opcional)
}

export function ImovelFormModal({ onSuccess, imovel }: ImovelFormModalProps) {
  const [open, setOpen] = useState(!!imovel) // Abrir automaticamente se tiver um imóvel para edição
  const [loading, setLoading] = useState(false)
  const [construtoras, setConstrutoras] = useState<ConstrutoraDashboard[]>([])
  const [perguntas, setPerguntas] = useState<Pergunta[]>([])
  const [perguntasSelecionadas, setPerguntasSelecionadas] = useState<Pergunta[]>([])
  const [perguntasModalOpen, setPerguntasModalOpen] = useState(false)
  const [perguntasCarregadas, setPerguntasCarregadas] = useState(false) // Controle de carregamento
  const [loadingConstrutoras, setLoadingConstrutoras] = useState(true)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [uploadingGaleria, setUploadingGaleria] = useState(false)
  // Se não houver fotoPrincipal no imovel, usar a primeira imagem ou string vazia
  const fotoPrincipalInicial = imovel ? (imovel as any).fotoPrincipal || (imovel.imagens && imovel.imagens.length > 0 ? imovel.imagens[0] : '') : ''
  const [fotoUrl, setFotoUrl] = useState<string>(fotoPrincipalInicial)
  
  // Para galeriaUrls, adaptar do array de imagens do imovel
  const [galeriaUrls, setGaleriaUrls] = useState<string[]>(imovel?.imagens || [])
  const fotoPrincipalRef = useRef<HTMLInputElement>(null)
  const galeriaFotosRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  // Verificar se é modo de edição
  const modoEdicao = !!imovel
  
  // Adaptar campos do imovel para o formato esperado pelo formulário
  const adaptarDadosImovel = () => {
    if (!imovel) return null
    
    console.log('Dados do imóvel recebidos brutos:', JSON.stringify(imovel))
    
    // IMPORTANTE: Obter o telefone de contato diretamente do imóvel ou objeto raiz
    // Verificar todas as possibilidades de localização do número de telefone
    let telefoneContato = ''
    
    if (typeof imovel === 'object') {
      // Log para depuração
      console.log('Propriedades disponíveis no imóvel:', Object.keys(imovel))
      console.log('Valor bruto do telefoneContato:', (imovel as any).telefoneContato)
      
      if ('telefoneContato' in imovel && (imovel as any).telefoneContato !== undefined) {
        telefoneContato = (imovel as any).telefoneContato || ''
      }
    }
    
    console.log('Telefone encontrado:', telefoneContato)
    
    // Usar imagens como galeriaFotos, pois na interface ImovelDisplay existe apenas imagens
    const galeriaFotos = imovel.imagens || []
    
    // IMPORTANTE: Obter tipoImovel diretamente do imóvel ou objeto raiz
    // Verificar todas as possibilidades de localização do tipo de imóvel
    let tipoImovel = ''
    
    if (typeof imovel === 'object') {
      // Log para depuração
      console.log('Valor bruto do tipoImovel:', (imovel as any).tipoImovel)
      
      if ('tipoImovel' in imovel && (imovel as any).tipoImovel !== undefined) {
        tipoImovel = (imovel as any).tipoImovel || ''
        console.log('Tipo de imóvel obtido do objeto raiz:', tipoImovel)
      }
    }
    
    // Se ainda não encontrou, tentar nas características
    if (!tipoImovel && imovel.caracteristicas) {
      console.log('Tentando obter tipo imóvel das características:', imovel.caracteristicas)
      
      if (typeof imovel.caracteristicas === 'object' && !Array.isArray(imovel.caracteristicas)) {
        const caracteristicas = imovel.caracteristicas as any
        if ('tipoImovel' in caracteristicas) {
          tipoImovel = caracteristicas.tipoImovel || ''
          console.log('Tipo obtido das características:', tipoImovel)
        }
      }
    }
    
    // Valor padrão se nada for encontrado
    if (!tipoImovel) {
      tipoImovel = "Apartamento"
      console.log('Usando valor padrão para tipo de imóvel:', tipoImovel)
    }
    
    console.log('Tipo de imóvel final encontrado:', tipoImovel)
    
    let caracteristicasArray: string[] = []
    
    // Verificar se temos o array de características diretamente no imóvel
    if ((imovel as any).caracteristicasArray && Array.isArray((imovel as any).caracteristicasArray)) {
      caracteristicasArray = (imovel as any).caracteristicasArray
    }
    
    // Verificar se caracteristicas é array ou objeto
    if (imovel.caracteristicas) {
      if (Array.isArray(imovel.caracteristicas)) {
        caracteristicasArray = imovel.caracteristicas
      } else if (typeof imovel.caracteristicas === 'object') {        
        // Tentar extrair um array de uma propriedade que possa existir
        if ((imovel.caracteristicas as any).caracteristicasArray && !caracteristicasArray.length) {
          caracteristicasArray = (imovel.caracteristicas as any).caracteristicasArray || []
        }
      }
    }
    
    console.log('Dados adaptados finais:', { telefoneContato, tipoImovel, caracteristicasArray })
    
    return {
      telefoneContato,
      galeriaFotos,
      tipoImovel,
      caracteristicasArray
    }
  }
  
  const dadosAdaptados = adaptarDadosImovel()
  
  // Carregar construtoras para o select
  useEffect(() => {
    const fetchConstrutoras = async () => {
      try {
        const data = await getConstrutoras()
        // Filtrar apenas construtoras ativas
        setConstrutoras(data.filter(c => c.status === 'ativa'))
      } catch (error) {
        console.error('Erro ao carregar construtoras:', error)
        toast({
          title: "Erro ao carregar construtoras",
          description: "Não foi possível carregar a lista de construtoras.",
          variant: "destructive",
        })
      } finally {
        setLoadingConstrutoras(false)
      }
    }
    
    // Função para buscar os tipos de imóveis do banco de dados
    const fetchTiposImoveis = async () => {
      try {
        // Buscar os tipos reais do banco de dados via API
        const response = await fetch('/api/tipos-imoveis')
        
        if (!response.ok) {
          throw new Error('Erro ao buscar tipos de imóveis')
        }
        
        const tiposDoDb = await response.json()
        
        // Ordenar por nome para manter uma ordem consistente
        const tiposOrdenados = tiposDoDb.sort((a: any, b: any) => 
          a.nome.localeCompare(b.nome, 'pt-BR'))
        
        setTiposDeImovel(tiposOrdenados)
        console.log('Tipos de imóveis carregados do banco:', tiposOrdenados)
        
        // Se estamos em modo edição, vamos definir o tipo correto
        if (modoEdicao && imovel) {
          // Se temos tipoImovelId, priorizamos ele
          if (imovel.tipoImovelId) {
            const tipo = tiposOrdenados.find((t: any) => t.id === imovel.tipoImovelId)
            
            if (tipo) {
              console.log('Tipo encontrado pelo ID:', tipo.id, tipo.nome)
              setTipoImovelSalvo(tipo.nome)
              // Define o valor no formulário
              form.setValue('tipoImovel', tipo.id)
            }
          }
          // Se não tem ID mas tem nome, buscamos pelo nome
          else if (imovel.tipoImovelNome) {
            const tipo = tiposOrdenados.find((t: any) => 
              t.nome.toLowerCase() === imovel.tipoImovelNome?.toLowerCase())
            
            if (tipo) {
              console.log('Tipo encontrado pelo nome:', tipo.nome)
              setTipoImovelSalvo(tipo.nome)
              // Define o valor no formulário
              form.setValue('tipoImovel', tipo.id)
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar tipos de imóveis:', error)
      }
    }
    
    // Função para buscar perguntas ativas
    const fetchPerguntas = async () => {
      try {
        const perguntasData = await buscarPerguntas({ ativa: true });
        setPerguntas(perguntasData);
        
        // Se estiver editando um imóvel, selecionar as perguntas vinculadas
        if (imovel?.perguntas?.length) {
          console.log('Perguntas do imóvel:', imovel.perguntas);
          
          // Mapear os IDs das perguntas vinculadas ao imóvel
          const perguntasIdsVinculadas = imovel.perguntas.map(p => p.perguntaId);
          console.log('IDs das perguntas vinculadas:', perguntasIdsVinculadas);
          
          // Filtrar as perguntas que estão vinculadas ao imóvel
          const perguntasDoImovel = perguntasData.filter((p: Pergunta) => 
            perguntasIdsVinculadas.includes(p.id)
          );
          
          console.log('Perguntas encontradas para o imóvel:', perguntasDoImovel);
          
          // Atualizar o estado local com as perguntas encontradas
          setPerguntasSelecionadas(perguntasDoImovel);
          
          // Atualizar o campo do formulário com os IDs das perguntas
          const perguntasIds = perguntasDoImovel.map(p => p.id);
          
          // Usar setTimeout para garantir que o formulário já esteja inicializado
          setTimeout(() => {
            form.setValue('perguntasIds', perguntasIds, { shouldValidate: true, shouldDirty: true });
            console.log('IDs das perguntas definidos no formulário (com delay):', perguntasIds);
          }, 100);
        }
        
        // Marcar que as perguntas foram carregadas
        setPerguntasCarregadas(true);
      } catch (error) {
        console.error('Erro ao carregar perguntas:', error);
        toast({
          title: "Erro ao carregar perguntas",
          description: "Não foi possível carregar a lista de perguntas.",
          variant: "destructive"
        });
      }
    };
    
    if (open) {
      fetchConstrutoras()
      fetchTiposImoveis()
      fetchPerguntas()
    }
  }, [open, modoEdicao, imovel])
  
  // Efeito de debug removido daqui e adicionado após a declaração do formulário
  
  // Formatação do telefone ao digitar
  const formatTelefone = (value: string) => {
    const telefoneNumeros = value.replace(/\D/g, "")
    if (telefoneNumeros.length <= 2) return telefoneNumeros
    if (telefoneNumeros.length <= 6) return `(${telefoneNumeros.slice(0, 2)}) ${telefoneNumeros.slice(2)}`
    if (telefoneNumeros.length <= 10) return `(${telefoneNumeros.slice(0, 2)}) ${telefoneNumeros.slice(2, 6)}-${telefoneNumeros.slice(6)}`
    return `(${telefoneNumeros.slice(0, 2)}) ${telefoneNumeros.slice(2, 7)}-${telefoneNumeros.slice(7, 11)}`
  }
  
  // Formatação do preço ao digitar
  const formatPreco = (value: string) => {
    const numeros = value.replace(/\D/g, "")
    if (numeros === "") return ""
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(Number(numeros) / 100)
  }

  const form = useForm<ImovelFormValues>({
    resolver: zodResolver(imovelFormSchema) as any,
    defaultValues: {
      titulo: imovel?.titulo || "",
      descricao: imovel?.descricao || "",
      preco: imovel?.preco || 0,
      area: imovel?.area || 0,
      quartos: imovel?.quartos || 0,
      banheiros: imovel?.banheiros || 0,
      vagas: imovel?.vagas || 0,
      latitude: imovel?.latitude || 0,
      longitude: imovel?.longitude || 0,
      telefoneContato: dadosAdaptados?.telefoneContato ? formatTelefone(dadosAdaptados.telefoneContato) : "",
      endereco: imovel?.endereco || "",
      fotoPrincipal: "", // Sempre iniciar vazio, vamos usar a URL do imovel separadamente
      galeriaFotos: [], // Sempre iniciar vazio, vamos usar as URLs do imovel separadamente
      caracteristicasArray: dadosAdaptados?.caracteristicasArray || [],
      tipoImovel: imovel?.tipoImovelId || "", // Agora usamos o ID e não mais o nome
      status: imovel?.status || "Disponível",
      perguntasIds: imovel?.perguntas?.map(p => p.perguntaId) || [],
      destaque: imovel?.destaque || false,
      ativo: imovel?.ativo !== false, // Se for undefined, assume true
      construtoraId: imovel?.construtoraId || ""
    },
  })

  // Efeito para debug do estado das perguntas selecionadas
  useEffect(() => {
    if (perguntasCarregadas) {
      console.log('Estado atual das perguntas selecionadas:', perguntasSelecionadas);
      console.log('IDs das perguntas no formulário:', form.getValues('perguntasIds'));
    }
  }, [perguntasSelecionadas, perguntasCarregadas, form])

  // Efeito para preencher os valores do formulário quando receber um imóvel para edição
  // Usamos um state específico para armazenar o tipo do imóvel e o telefone
  const [tipoImovelSalvo, setTipoImovelSalvo] = useState<string>("Apartamento") 
  const [telefoneSalvo, setTelefoneSalvo] = useState<string>("") 
  
  // Novo estado para armazenar os tipos de imóveis do banco
  const [tiposDeImovel, setTiposDeImovel] = useState<Array<{id: string, nome: string, slug: string}>>([])
  
  // SOLUÇÃO EXTREMA: Fazer uma consulta direta ao banco de dados no momento que abrimos o modal
  const buscarDadosDiretamente = async (imovelId: string) => {
    try {
      console.log('INICIANDO CONSULTA DIRETA PARA O IMÓVEL:', imovelId);
      
      // Consulta a API para obter os dados mais recentes diretamente do banco
      const response = await fetch(`/api/imoveis/${imovelId}`, { 
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache, no-store' } // Força bypass do cache
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do imóvel');
      }
      
      const data = await response.json();
      console.log('DADOS OBTIDOS DIRETAMENTE DO BANCO:', data);
      
      // Extrair telefone e tipo garantindo que são os dados mais recentes
      const telefoneRaw = data.imovel.telefoneContato || '';
      const tipoImovelId = data.imovel.tipoImovelId || null; // Agora buscamos o ID
      const tipoImovelNome = data.imovel.tipoImovel?.nome || data.imovel.tipoImovelNome || 'Apartamento';
      
      console.log('DADOS BRUTOS ENCONTRADOS:', {
        telefone: telefoneRaw,
        tipoId: tipoImovelId,
        tipoNome: tipoImovelNome
      });
      
      // Limpar e formatar o telefone
      const telefoneFormatado = telefoneRaw ? formatTelefone(telefoneRaw) : '';
      
      // Atualizar o formulário e os states
      setTelefoneSalvo(telefoneRaw);
      setTipoImovelSalvo(tipoImovelNome);
      
      // Forçar a redefinição dos campos no formulário sem resetar tudo
      form.setValue('telefoneContato', telefoneFormatado);
      form.setValue('tipoImovel', tipoImovelId); // Usar o ID para o campo
      
      console.log('CAMPOS ATUALIZADOS COM DADOS DIRETOS DO BANCO!');
      
      // Também atualizar o DOM diretamente para casos extremos
      setTimeout(() => {
        const inputTelefone = document.querySelector('input[name="telefoneContato"]') as HTMLInputElement;
        
        if (inputTelefone) {
          inputTelefone.value = telefoneFormatado;
          console.log('TELEFONE ATUALIZADO DIRETAMENTE NO DOM');
        }
        
        // Radio buttons são selecionados de forma diferente de selects
        if (tipoImovelId) {
          const radioTipo = document.querySelector(`input[value="${tipoImovelId}"]`) as HTMLInputElement;
          if (radioTipo) {
            radioTipo.checked = true;
            console.log('TIPO ATUALIZADO DIRETAMENTE NOS RADIO BUTTONS'); 
          }
        }
      }, 500);
      
      return { telefoneFormatado, tipoImovelId, tipoImovelNome };
    } catch (error) {
      console.error('ERRO NA CONSULTA DIRETA:', error);
      return null;
    }
  };
  
  // SOLUÇÃO MELHORADA: useEffect para garantir que o telefone e o tipo são carregados corretamente
  useEffect(() => {
    if (modoEdicao && imovel && (imovel as any).id) {
      console.log('Carregando dados atualizados para o imóvel:', (imovel as any).id);
      
      // Primeiro buscamos os dados atualizados da API
      buscarDadosDiretamente((imovel as any).id);
      
      // Como medida de segurança, também usamos os dados que já temos no objeto imovel
      const dados = imovel as any;
      
      // Pegando o telefone e garantindo que ele nunca seja undefined
      let telefone = dados.telefoneContato || '';
      console.log('Telefone detectado:', telefone);
      
      // Pegando o tipo de imóvel
      let tipoId = dados.tipoImovelId || null;
      let tipoNome = 'Apartamento';
      
      if (dados.tipoImovel?.nome) {
        tipoNome = dados.tipoImovel.nome;
      } else if (dados.tipoImovelNome) {
        tipoNome = dados.tipoImovelNome;
      }
      
      console.log('Valores do imóvel:', { telefone, tipoId, tipoNome, ativo: dados.ativo });
      
      // Aplicar os valores imediatamente e também com um delay para garantir
      function aplicarValores() {
        // Garantir que o telefone seja aplicado corretamente
        if (telefone) {
          const telefoneFormatado = formatTelefone(telefone);
          form.setValue('telefoneContato', telefoneFormatado);
          console.log('Telefone aplicado:', telefoneFormatado);
        }
        
        // Aplicar o tipo de imóvel
        if (tipoId) {
          form.setValue('tipoImovel', tipoId);
        }
        
        // Garantir que o imóvel esteja sempre ativo
        form.setValue('ativo', true);
        
        // Guardar nos states para referência
        setTelefoneSalvo(telefone);
        setTipoImovelSalvo(tipoNome);
      }
      
      // Aplicar imediatamente
      aplicarValores();
      
      // E também com um delay para garantir que os valores sejam aplicados
      setTimeout(aplicarValores, 500);
    }
  }, [imovel, modoEdicao, form]);
  
  // Efeito original para carregar os dados do imóvel quando recebido
  useEffect(() => {
    if (imovel) {
      console.log('Carregando imóvel para edição:', imovel);
      
      // Obter dados brutos diretamente do imóvel para debug
      const dadosBrutos = imovel as any;
      console.log('Dados brutos do imóvel:', {
        id: dadosBrutos.id,
        telefoneContato: dadosBrutos.telefoneContato,
        tipoImovel: dadosBrutos.tipoImovel?.nome,
        tipoImovelId: dadosBrutos.tipoImovelId,
        tipoImovelNome: dadosBrutos.tipoImovelNome,
        caracteristicas: dadosBrutos.caracteristicas
      });
      
      // Verificar se temos o tipo de imóvel no imovel recebido
      let tipoDoImovelNome = ""
      let tipoDoImovelId = ""
      
      // Determinamos explicitamente a prioridade de busca para garantir consistência
      // 1. Diretamente no objeto relacional (valor mais recente)  
      if (dadosBrutos.tipoImovel?.nome) {
        tipoDoImovelNome = dadosBrutos.tipoImovel.nome;
        tipoDoImovelId = dadosBrutos.tipoImovelId;
        console.log('Tipo obtido do relacionamento:', tipoDoImovelNome, 'ID:', tipoDoImovelId);
      }
      // 2. Do campo nome ou id diretamente
      else if (dadosBrutos.tipoImovelId || dadosBrutos.tipoImovelNome) {
        tipoDoImovelId = dadosBrutos.tipoImovelId;
        tipoDoImovelNome = dadosBrutos.tipoImovelNome || 'Apartamento';
        console.log('Tipo obtido dos campos individuais:', tipoDoImovelNome, 'ID:', tipoDoImovelId);
      }
      // 2. Nas características se existirem como objeto
      else if (dadosBrutos.caracteristicas && 
               typeof dadosBrutos.caracteristicas === 'object' && 
               !Array.isArray(dadosBrutos.caracteristicas) && 
               dadosBrutos.caracteristicas.tipoImovel) {
        tipoDoImovelNome = dadosBrutos.caracteristicas.tipoImovel;
        console.log('Tipo obtido das características:', tipoDoImovelNome);
      }
      // 3. Valor padrão se nada for encontrado
      else {
        tipoDoImovelNome = 'Apartamento';
        console.log('Usando tipo padrão:', tipoDoImovelNome);
      }
      
      // Buscar o telefone diretamente, garantindo valor válido
      let telefoneDoImovel = dadosBrutos.telefoneContato || "";
      console.log('Telefone obtido:', telefoneDoImovel);
      
      // Salvar os valores em states para uso posterior e no console para debug
      console.log('Definindo states para:', {
        tipoImovelNome: tipoDoImovelNome || "Apartamento",
        tipoImovelId: tipoDoImovelId,
        telefone: telefoneDoImovel
      })
      
      setTipoImovelSalvo(tipoDoImovelNome || "Apartamento")
      setTelefoneSalvo(telefoneDoImovel)
      
      // Resetar o formulário com os dados do imóvel
      setTimeout(() => {
        console.log('Inicializando formulário com dados:', {
          tipoNome: tipoDoImovelNome || "Apartamento",
          tipoId: tipoDoImovelId,
          telefone: telefoneDoImovel
        })
        
        form.reset({
          titulo: imovel.titulo,
          descricao: imovel.descricao,
          preco: imovel.preco,
          area: imovel.area,
          quartos: imovel.quartos,
          banheiros: imovel.banheiros,
          vagas: imovel.vagas,
          endereco: imovel.endereco,
          construtoraId: imovel.construtoraId,
          latitude: imovel.latitude,
          longitude: imovel.longitude,
          // IMPORTANTE: Usar o telefone que encontramos, aplicando a formatação
          telefoneContato: telefoneDoImovel ? formatTelefone(telefoneDoImovel) : "",
          caracteristicasArray: Array.isArray(imovel.caracteristicas) ? imovel.caracteristicas : 
            ((imovel as any).caracteristicasArray || []),
          // IMPORTANTE: Usar o ID do tipo de imóvel que encontramos
          tipoImovel: tipoDoImovelId || "",
          status: imovel.status || 'Disponível',
          destaque: (imovel as any).destaque || false,
          ativo: imovel.ativo !== false,
          fotoPrincipal: "",
          galeriaFotos: [],
        })
        
        console.log('Form reset completo, valores atuais:', {
          tipoImovel: form.getValues("tipoImovel"),
          telefoneContato: form.getValues("telefoneContato")
        })
        
        // Também atualizar os estados
        setFotoUrl(fotoPrincipalInicial)
        setGaleriaUrls(imovel.imagens || [])
      }, 0)
    }
  }, [imovel])  // Executar quando o imóvel mudar

  // Função para fazer upload da foto principal
  const uploadFotoPrincipal = async (file: File) => {
    try {
      setUploadingFoto(true)
      const filename = `imoveis/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      console.log('Token para blob:', process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN || 'Não encontrado')
      const response = await put(filename, file, {
        access: 'public',
        token: "vercel_blob_rw_bF9k2q8R0FRRS4A6_9qvJTmLhhvko830o6jAzHFYwuBbLQW"
      })
      
      setFotoUrl(response.url)
      return response.url
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error)
      toast({
        title: "Erro ao fazer upload",
        description: "Não foi possível enviar a foto. Tente novamente.",
        variant: "destructive"
      })
      return ''
    } finally {
      setUploadingFoto(false)
    }
  }

  // Função para fazer upload de múltiplas fotos para a galeria
  const uploadGaleriaFotos = async (files: FileList) => {
    try {
      setUploadingGaleria(true)
      const urls = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const filename = `imoveis/galeria/${Date.now()}-${i}-${file.name.replace(/\s+/g, '-')}`
        
        const response = await put(filename, file, {
          access: 'public',
          token: "vercel_blob_rw_bF9k2q8R0FRRS4A6_9qvJTmLhhvko830o6jAzHFYwuBbLQW"
        })
        
        urls.push(response.url)
      }
      
      setGaleriaUrls(prev => [...prev, ...urls])
      return urls
    } catch (error) {
      console.error('Erro ao fazer upload das fotos:', error)
      toast({
        title: "Erro ao fazer upload",
        description: "Não foi possível enviar algumas fotos. Tente novamente.",
        variant: "destructive"
      })
      return []
    } finally {
      setUploadingGaleria(false)
    }
  }

  // Função para remover uma foto da galeria
  const removerFotoGaleria = (index: number) => {
    console.log(`Removendo foto do índice ${index}`);
    const novasUrls = [...galeriaUrls];
    novasUrls.splice(index, 1);
    setGaleriaUrls(novasUrls);
    
    toast({
      title: "Foto removida",
      description: "A foto foi removida da galeria.",
    });
  };

  const onSubmit = async (values: ImovelFormValues) => {
    setLoading(true)
    try {
      // Remover formatação do telefone
      const telefoneLimpo = values.telefoneContato ? values.telefoneContato.replace(/\D/g, "") : undefined
      
      // Upload da foto principal se for um arquivo
      let fotoPrincipalUrl = fotoUrl
      if (values.fotoPrincipal instanceof File) {
        fotoPrincipalUrl = await uploadFotoPrincipal(values.fotoPrincipal)
      }
      
      // Se não tiver foto, usar placeholder
      if (!fotoPrincipalUrl) {
        fotoPrincipalUrl = "https://placehold.co/600x400?text=Im%C3%B3vel"
      }
      
      // Adicionar logs para debug
      console.log('Valores completos do formulário antes do envio:', values);
      console.log('Telefone original:', values.telefoneContato);
      console.log('Telefone limpo:', telefoneLimpo);
      console.log('Tipo de imóvel ID selecionado:', values.tipoImovel); // Este é o ID do tipo
      
      // Verificar se temos um tipo selecionado e validação extra
      const tipoSelecionado = tiposDeImovel.find(t => t.id === values.tipoImovel);
      console.log('Tipo encontrado com esse ID:', tipoSelecionado);
      
      // CRÍTICO: Garantir que os valores sempre sejam enviados, mesmo quando vazios
      // Isso é crucial para que o backend não use valores antigos quando o usuário limpa um campo
      const telefoneParaEnviar = telefoneLimpo; // Pode ser undefined/vazio, e isso é intencional!
      
      // Para o tipo, usamos o ID do tipo selecionado no formulário
      // No novo modelo, tipoImovel é o ID, não mais o nome do tipo
      const tipoImovelIdParaEnviar = values.tipoImovel;
      
      console.log('Dados finais para envio:', {
        telefoneContato: telefoneParaEnviar,
        tipoImovelId: tipoImovelIdParaEnviar, // Agora enviamos o ID do tipo
        nomeTipo: tipoSelecionado?.nome || 'Não identificado',
        perguntasIds: values.perguntasIds || [] // Log das perguntas selecionadas
      });
      
      const payload: ImovelNovo = {
        ...values,
        // Enviar o telefoneContato explicitamente
        telefoneContato: telefoneParaEnviar,
        // Usar a URL da foto upload ou a existente
        fotoPrincipal: fotoPrincipalUrl,
        // Usar as URLs da galeria
        galeriaFotos: galeriaUrls,
        // Garantir que o array de características exista
        caracteristicasArray: values.caracteristicasArray || [],
        // Incluir os IDs das perguntas selecionadas
        perguntasIds: values.perguntasIds || [],
        // Enviar o tipoImovelId explicitamente - agora com o nome correto
        tipoImovelId: tipoImovelIdParaEnviar,
        // Remover campo tipoImovel que não existe mais no schema
        tipoImovel: undefined,
        // SOLUÇÃO DEFINITIVA: Forçar o imóvel a sempre estar ativo, independente do modo
        ativo: true,
        // Campo JSON opcional com metadados adicionais
        caracteristicas: {
          // Também incluir o nome do tipo de imóvel do objeto relacionado
          tipoImovel: tipoSelecionado?.nome || 'Apartamento',
          anoConstrucao: (imovel?.caracteristicas as any)?.anoConstrucao || new Date().getFullYear(),
          estagioConstrucao: values.status || "Pronto para morar",
          // Preservar outras propriedades que possam existir
          ...(typeof imovel?.caracteristicas === 'object' && !Array.isArray(imovel.caracteristicas) ? imovel.caracteristicas : {})
        }
      }
      
      // URL e método diferentes para criação e edição
      const url = modoEdicao ? `/api/imoveis/${imovel?.id}` : '/api/imoveis'
      const method = modoEdicao ? 'PUT' : 'POST'
      
      // Log final antes de enviar para o backend
      console.log('Payload final enviado para o backend:', payload);
      console.log('IDs de perguntas enviados:', payload.perguntasIds);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        throw new Error('Erro ao criar imóvel')
      }
      
      toast({
        title: modoEdicao ? "Imóvel atualizado com sucesso!" : "Imóvel criado com sucesso!",
        description: modoEdicao ? "O imóvel foi atualizado no sistema." : "O imóvel foi adicionado ao sistema.",
      })
      
      setOpen(false)
      form.reset()
      
      // Atualizar a listagem de imóveis
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error('Erro ao criar imóvel:', error)
      toast({
        title: "Erro ao criar imóvel",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!modoEdicao && (
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2 relative overflow-hidden group">
            <div className="absolute inset-0 w-3 bg-white dark:bg-gray-800 opacity-10 transform -skew-x-12 group-hover:animate-shimmer" />
            <Plus className="h-5 w-5" />
            <span>Novo Imóvel</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            {modoEdicao ? 'Editar imóvel' : 'Adicionar novo imóvel'}
          </DialogTitle>
          <DialogDescription>
            {modoEdicao 
              ? 'Edite as informações do imóvel e clique em salvar para atualizar.' 
              : 'Preencha os dados do imóvel e clique em salvar.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 my-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Imóvel</FormLabel>
                    <FormControl>
                      <Input placeholder="Título completo do imóvel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="construtoraId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Construtora</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma construtora" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingConstrutoras ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Carregando construtoras...</span>
                          </div>
                        ) : construtoras.length > 0 ? (
                          construtoras.map(construtora => (
                            <SelectItem key={construtora.id} value={construtora.id}>
                              {construtora.nome}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            Nenhuma construtora encontrada
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="R$ 0,00" 
                        {...field}
                        value={field.value === 0 ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          field.onChange(value ? Number(value) : 0)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área (m²)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        value={field.value === 0 ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="quartos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quartos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="banheiros"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banheiros</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vagas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vagas</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="telefoneContato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone de Contato</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(00) 00000-0000"
                        {...field}
                        value={formatTelefone(field.value || "")}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Endereço Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número, complemento, bairro, cidade, estado, CEP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campo para upload da foto principal */}
              <FormField
                control={form.control}
                name="fotoPrincipal"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Foto Principal</FormLabel>
                    <FormControl>
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input
                          ref={fotoPrincipalRef}
                          type="file"
                          accept="image/*"
                          className="cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                              // Criar preview da imagem
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                if (e.target?.result) {
                                  setFotoUrl(e.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        
                        {uploadingFoto && (
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Fazendo upload...</span>
                          </div>
                        )}
                        
                        {fotoUrl && (
                          <div className="relative mt-2 rounded-md overflow-hidden border w-full h-40">
                            <div 
                              className="absolute inset-0 bg-cover bg-center" 
                              style={{ backgroundImage: `url(${fotoUrl})` }}
                            />
                            <div className="absolute top-2 right-2">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6 rounded-full"
                                onClick={() => {
                                  setFotoUrl('');
                                  field.onChange(null);
                                  if (fotoPrincipalRef.current) {
                                    fotoPrincipalRef.current.value = '';
                                  }
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Selecione uma imagem para ser a foto principal do imóvel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campo para upload da galeria de fotos */}
              <FormField
                control={form.control}
                name="galeriaFotos"
                render={({ field }) => {
                  return (
                    <FormItem className="col-span-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>Galeria de Fotos</FormLabel>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            if (galeriaFotosRef.current) {
                              galeriaFotosRef.current.click();
                            }
                          }}
                          className="h-7 px-3"
                          disabled={uploadingGaleria}
                        >
                          {uploadingGaleria ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                              <span>Enviando...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-3.5 w-3.5 mr-1" />
                              <span>Enviar Fotos</span>
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <Input
                        ref={galeriaFotosRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            // Faça o upload dos arquivos
                            await uploadGaleriaFotos(files);
                            // Limpar o campo de arquivo para permitir selecionar os mesmos arquivos novamente
                            if (galeriaFotosRef.current) {
                              galeriaFotosRef.current.value = '';
                            }
                          }
                        }}
                      />
                      
                      {galeriaUrls.length === 0 ? (
                        <div className="text-center py-4 border border-dashed rounded-md border-gray-300 bg-gray-50 text-muted-foreground">
                          Clique em "Enviar Fotos" para adicionar imagens à galeria do imóvel
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          {galeriaUrls.map((url, index) => (
                            <div key={index} className="relative aspect-square group overflow-hidden rounded-md border bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${url})` }}>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black/50 group-hover:opacity-100 transition-opacity">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => removerFotoGaleria(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <FormDescription>
                        Selecione as imagens para a galeria do imóvel
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              
              {/* Tipo de Imóvel e Status */}
              <div className="grid grid-cols-2 gap-3 col-span-2">
                {/* TIPO DE IMÓVEL - SOLUÇÃO SIMPLES COM RADIO BUTTONS */}
                <FormField
                  control={form.control}
                  name="tipoImovel"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">Tipo de Imóvel</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            console.log('Tipo selecionado pelo usuário:', value)
                            // Vamos salvar o ID do tipo, não mais o nome
                            field.onChange(value)
                            
                            // Encontrar o tipo pelo ID para mostrar o nome
                            const tipoSelecionado = tiposDeImovel.find(tipo => tipo.id === value)
                            if (tipoSelecionado) {
                              console.log('Tipo encontrado e salvo no state:', tipoSelecionado.nome)
                              setTipoImovelSalvo(tipoSelecionado.nome)
                            }
                          }}
                          value={field.value || ''}
                          defaultValue={field.value || tiposDeImovel.find(t => t.nome === tipoImovelSalvo)?.id || tiposDeImovel[0]?.id}
                          className="flex flex-col space-y-1"
                        >
                          {/* Renderizar dinamicamente cada tipo de imóvel */}
                          {tiposDeImovel.map(tipo => {
                            // Definir cores diferentes para cada tipo
                            const corFundo = {
                              'apartamento': 'bg-emerald-500',
                              'casa': 'bg-blue-500',
                              'terreno': 'bg-amber-500',
                              'imovel-comercial': 'bg-violet-500',
                              'imovel-rural': 'bg-green-500'
                            }[tipo.slug] || 'bg-gray-500'
                            
                            return (
                              <div key={tipo.id} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900/20 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors">
                                <RadioGroupItem value={tipo.id} id={`tipo-${tipo.slug}`} />
                                <Label htmlFor={`tipo-${tipo.slug}`}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-full ${corFundo}`}></div>
                                    <span>{tipo.nome}</span>
                                  </div>
                                </Label>
                              </div>
                            )
                          })}
                          
                          {/* Mensagem se não houver tipos disponíveis */}
                          {tiposDeImovel.length === 0 && (
                            <div className="p-2 text-center text-sm text-muted-foreground">
                              Carregando tipos de imóveis...
                            </div>
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status do Imóvel</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || tipoImovelSalvo} 
                        defaultValue={tipoImovelSalvo}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Disponível">Disponível</SelectItem>
                          <SelectItem value="Em Construção">Em Construção</SelectItem>
                          <SelectItem value="Lançamento">Lançamento</SelectItem>
                          <SelectItem value="Vendido">Vendido</SelectItem>
                          <SelectItem value="Reservado">Reservado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campo para seleção de perguntas */}
                <FormField
                  control={form.control}
                  name="perguntasIds"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Perguntas vinculadas ao imóvel</FormLabel>
                      <div className="flex flex-col space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            // Sincronizar o estado local com o estado do formulário antes de abrir o modal
                            const perguntasIds = form.getValues('perguntasIds') || [];
                            console.log('Abrindo modal, IDs no formulário:', perguntasIds);
                            
                            // Se houver IDs no formulário, mas o estado local estiver vazio, sincronizar
                            if (perguntasIds.length > 0 && perguntasSelecionadas.length === 0) {
                              const perguntasFiltradas = perguntas.filter(p => perguntasIds.includes(p.id));
                              console.log('Sincronizando estado local com formulário:', perguntasFiltradas);
                              setPerguntasSelecionadas(perguntasFiltradas);
                            }
                            
                            setPerguntasModalOpen(true);
                          }}
                          className="w-full justify-start text-left font-normal"
                        >
                          <span>
                            {perguntasSelecionadas.length > 0
                              ? `${perguntasSelecionadas.length} pergunta(s) selecionada(s)`
                              : "Selecionar perguntas"}
                          </span>
                        </Button>

                        {/* Modal para seleção de perguntas */}
                        <Dialog open={perguntasModalOpen} onOpenChange={setPerguntasModalOpen}>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Selecionar Perguntas</DialogTitle>
                              <DialogDescription>
                                Escolha as perguntas que serão vinculadas a este imóvel.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 my-4">
                              {perguntas.length > 0 ? (
                                perguntas.map((pergunta) => {
                                  // Verificar se a pergunta está na lista de selecionadas de duas formas
                                  // 1. Verificar no estado local (UI)
                                  const isSelectedLocal = perguntasSelecionadas.some(p => p.id === pergunta.id);
                                  
                                  // 2. Verificar no formulário (dados)
                                  const perguntasIds = form.getValues('perguntasIds') || [];
                                  const isSelectedForm = perguntasIds.includes(pergunta.id);
                                  
                                  // Usar qualquer um dos dois que indique que está selecionado
                                  const isSelected = isSelectedLocal || isSelectedForm;
                                  
                                  console.log(`Pergunta ${pergunta.id} (${pergunta.texto}) - Local: ${isSelectedLocal}, Form: ${isSelectedForm}, Final: ${isSelected}`);
                                  
                                  // Se houver inconsistência, sincronizar
                                  if (isSelectedLocal !== isSelectedForm) {
                                    console.log(`Inconsistência detectada para pergunta ${pergunta.id}. Sincronizando...`);
                                  }
                                  return (
                                    <div
                                      key={pergunta.id}
                                      className={`flex items-center justify-between p-3 rounded-md border ${isSelected ? 'bg-muted' : ''} cursor-pointer`}
                                      onClick={() => {
                                  // Obter os IDs atuais diretamente do formulário para garantir sincronização
                                  const perguntasIdsAtuais = form.getValues('perguntasIds') || [];
                                  
                                  if (isSelected) {
                                    // Remover a pergunta da seleção
                                    const novosIds = perguntasIdsAtuais.filter(id => id !== pergunta.id);
                                    
                                    // Atualizar o campo do formulário imediatamente
                                    form.setValue('perguntasIds', novosIds, { shouldValidate: true, shouldDirty: true });
                                    
                                    // Atualizar o estado local para refletir a mudança na UI
                                    const novasSelecionadas = perguntasSelecionadas.filter(p => p.id !== pergunta.id);
                                    setPerguntasSelecionadas(novasSelecionadas);
                                    
                                    console.log('Pergunta removida, IDs atualizados:', novosIds);
                                  } else {
                                    // Adicionar a pergunta à seleção
                                    const novosIds = [...perguntasIdsAtuais, pergunta.id];
                                    
                                    // Atualizar o campo do formulário imediatamente
                                    form.setValue('perguntasIds', novosIds, { shouldValidate: true, shouldDirty: true });
                                    
                                    // Atualizar o estado local para refletir a mudança na UI
                                    const novasSelecionadas = [...perguntasSelecionadas, pergunta];
                                    setPerguntasSelecionadas(novasSelecionadas);
                                    
                                    console.log('Pergunta adicionada, IDs atualizados:', novosIds);
                                  }
                                }}
                                    >
                                      <div className="flex-1">
                                        <p className="font-medium">{pergunta.texto}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {pergunta.categoria} - {pergunta.tipo}
                                        </p>
                                      </div>
                                      <div className="flex items-center">
                                        {isSelected ? (
                                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                            <Check className="h-4 w-4 text-primary-foreground" />
                                          </div>
                                        ) : (
                                          <div className="h-6 w-6 rounded-full border" />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="text-center py-4">
                                  <p>Nenhuma pergunta disponível</p>
                                </div>
                              )}
                            </div>

                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setPerguntasModalOpen(false)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                onClick={() => {
                                  // Obter os IDs atuais diretamente do formulário
                                  const perguntasIds = form.getValues('perguntasIds') || [];
                                  
                                  // Garantir que o campo do formulário está atualizado
                                  field.onChange(perguntasIds);
                                  
                                  // Garantir que o estado local está sincronizado com o formulário
                                  const perguntasFiltradas = perguntas.filter(p => perguntasIds.includes(p.id));
                                  setPerguntasSelecionadas(perguntasFiltradas);
                                  
                                  console.log('Confirmando seleção de perguntas, IDs:', perguntasIds);
                                  console.log('Perguntas selecionadas atualizadas:', perguntasFiltradas);
                                  
                                  // Fechar o modal
                                  setPerguntasModalOpen(false);
                                }}
                              >
                                Confirmar Seleção
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {perguntasSelecionadas.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {perguntasSelecionadas.map((pergunta) => (
                              <Badge
                                key={pergunta.id}
                                variant="secondary"
                                className="flex items-center gap-1 max-w-full"
                              >
                                <span className="truncate">{pergunta.texto}</span>
                                <X
                                  className="h-3 w-3 ml-1 cursor-pointer shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const novasSelecionadas = perguntasSelecionadas.filter(p => p.id !== pergunta.id);
                                    setPerguntasSelecionadas(novasSelecionadas);
                                    field.onChange(novasSelecionadas.map(p => p.id));
                                  }}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Características */}
              <FormField
                control={form.control}
                name="caracteristicasArray"
                render={({ field }) => {
                  const caracteristicas = field.value || [];
                  const [novaCaracteristica, setNovaCaracteristica] = useState("");
                  
                  // Função para adicionar nova característica
                  const addCaracteristica = () => {
                    if (novaCaracteristica.trim() === "") return;
                    const newCaracteristicas = [...caracteristicas, novaCaracteristica.trim()];
                    field.onChange(newCaracteristicas);
                    setNovaCaracteristica("");
                  };
                  
                  // Função para remover característica
                  const removeCaracteristica = (index: number) => {
                    const newCaracteristicas = caracteristicas.filter((_, i) => i !== index);
                    field.onChange(newCaracteristicas);
                  };
                  
                  return (
                    <FormItem className="col-span-2">
                      <FormLabel>Características do Imóvel</FormLabel>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          placeholder="Ex: Piscina, Churrasqueira, Academia"
                          value={novaCaracteristica}
                          onChange={(e) => setNovaCaracteristica(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCaracteristica())}
                        />
                        <Button 
                          type="button" 
                          onClick={addCaracteristica} 
                          className="shrink-0"
                        >
                          Adicionar
                        </Button>
                      </div>
                      
                      {caracteristicas.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {caracteristicas.map((item, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="cursor-pointer hover:bg-muted"
                              onClick={() => removeCaracteristica(index)}
                            >
                              {item}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <FormDescription>
                        Adicione as características do imóvel (clique para remover)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              
              
              
              {/* Campo Ativo */}
              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Imóvel ativo</FormLabel>
                      <FormDescription>
                        Imóveis ativos aparecem nas pesquisas e na página inicial
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001"
                          placeholder="0.000000" 
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001"
                          placeholder="0.000000" 
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Descrição do Imóvel</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva as características e diferenciais do imóvel" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading 
                  ? "Salvando..." 
                  : modoEdicao 
                    ? "Atualizar Imóvel" 
                    : "Salvar Imóvel"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
