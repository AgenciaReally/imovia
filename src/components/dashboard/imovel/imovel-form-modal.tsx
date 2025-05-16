"use client"

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Building2, Loader2, Home, X, Plus, PlusCircle, Upload, ImageIcon } from "lucide-react"
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
  tipoImovel: z.string().optional(),
  status: z.string().optional(),
  destaque: z.boolean().default(false),
  ativo: z.boolean().default(true),
  construtoraId: z.string({ required_error: "Selecione uma construtora" })
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
  tipoImovel?: string
  status?: string
  destaque: boolean
  ativo: boolean
  construtoraId: string
  caracteristicas?: Record<string, any>
}

interface ImovelFormModalProps {
  onSuccess?: () => void;
  imovel?: ImovelDisplay; // Imóvel existente para edição (opcional)
}

export function ImovelFormModal({ onSuccess, imovel }: ImovelFormModalProps) {
  const [open, setOpen] = useState(!!imovel) // Abrir automaticamente se tiver um imóvel para edição
  const [loading, setLoading] = useState(false)
  const [construtoras, setConstrutoras] = useState<ConstrutoraDashboard[]>([])
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
    
    if (open) {
      fetchConstrutoras()
    }
  }, [open])
  
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
      tipoImovel: dadosAdaptados?.tipoImovel || "Apartamento",
      status: imovel?.status || "Disponível",
      destaque: imovel?.destaque || false,
      ativo: imovel?.ativo !== false, // Se for undefined, assume true
      construtoraId: imovel?.construtoraId || ""
    },
  })

  // Efeito para preencher os valores do formulário quando receber um imóvel para edição
  // Usamos um state específico para armazenar o tipo do imóvel e o telefone
  const [tipoImovelSalvo, setTipoImovelSalvo] = useState<string>("Apartamento") 
  const [telefoneSalvo, setTelefoneSalvo] = useState<string>("") 
  
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
      const tipoImovelRaw = data.imovel.tipoImovel || 'Apartamento';
      
      console.log('DADOS BRUTOS ENCONTRADOS:', {
        telefone: telefoneRaw,
        tipo: tipoImovelRaw
      });
      
      // Limpar e formatar o telefone
      const telefoneFormatado = telefoneRaw ? formatTelefone(telefoneRaw) : '';
      
      // Atualizar o formulário e os states
      setTelefoneSalvo(telefoneRaw);
      setTipoImovelSalvo(tipoImovelRaw);
      
      // Forçar a redefinição dos campos no formulário sem resetar tudo
      form.setValue('telefoneContato', telefoneFormatado);
      form.setValue('tipoImovel', tipoImovelRaw);
      
      console.log('CAMPOS ATUALIZADOS COM DADOS DIRETOS DO BANCO!');
      
      // Também atualizar o DOM diretamente para casos extremos
      setTimeout(() => {
        const inputTelefone = document.querySelector('input[name="telefoneContato"]') as HTMLInputElement;
        const selectTipo = document.querySelector('select[name="tipoImovel"]') as HTMLSelectElement;
        
        if (inputTelefone) {
          inputTelefone.value = telefoneFormatado;
          console.log('TELEFONE ATUALIZADO DIRETAMENTE NO DOM');
        }
        
        if (selectTipo) {
          selectTipo.value = tipoImovelRaw;
          console.log('TIPO ATUALIZADO DIRETAMENTE NO DOM'); 
        }
      }, 500);
      
      return { telefoneFormatado, tipoImovelRaw };
    } catch (error) {
      console.error('ERRO NA CONSULTA DIRETA:', error);
      return null;
    }
  };
  
  // SOLUÇÃO BOMBADA: useEffect específico para forçar o preenchimento do telefone e tipo
  useEffect(() => {
    if (modoEdicao && imovel && (imovel as any).id) {
      console.log('SOLUÇÃO BOMBADA ATIVADA PARA ID:', (imovel as any).id);
      
      // Chamar a função de busca direta
      buscarDadosDiretamente((imovel as any).id);
      
      // Extrair os dados direto do objeto bruto (como fallback)
      const dados = imovel as any;
      
      // Pegando o telefone de todos os possíveis lugares
      let telefone = '';
      if (dados.telefoneContato) telefone = dados.telefoneContato;
      
      // Pegando o tipo de imóvel de todos os possíveis lugares
      let tipo = 'Apartamento';
      if (dados.tipoImovel) tipo = dados.tipoImovel;
      else if (dados.caracteristicas?.tipoImovel) tipo = dados.caracteristicas.tipoImovel;
      
      console.log('VALORES BRUTOS ENCONTRADOS (FALLBACK):', { telefone, tipo });
      
      // Atualizar diretamente o DOM se necessário (hack extremo) - como fallback apenas
      setTimeout(() => {
        // Aplicar diretamente no formulário
        form.setValue('telefoneContato', telefone ? formatTelefone(telefone) : '');
        form.setValue('tipoImovel', tipo);
        
        // Guardar nos states também
        setTelefoneSalvo(telefone);
        setTipoImovelSalvo(tipo);
        
        console.log('CAMPOS FORÇADAMENTE ATUALIZADOS (FALLBACK)!');
      }, 1000); // Um pequeno delay para garantir que o DOM está pronto
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
        tipoImovel: dadosBrutos.tipoImovel,
        caracteristicas: dadosBrutos.caracteristicas
      });
      
      // Verificar se temos o tipo de imóvel no imovel recebido
      let tipoDoImovel = ""
      
      // Determinamos explicitamente a prioridade de busca para garantir consistência
      // 1. Diretamente no objeto (valor mais recente)  
      if (dadosBrutos.tipoImovel) {
        tipoDoImovel = dadosBrutos.tipoImovel;
        console.log('Tipo obtido diretamente:', tipoDoImovel);
      }
      // 2. Nas características se existirem como objeto
      else if (dadosBrutos.caracteristicas && 
               typeof dadosBrutos.caracteristicas === 'object' && 
               !Array.isArray(dadosBrutos.caracteristicas) && 
               dadosBrutos.caracteristicas.tipoImovel) {
        tipoDoImovel = dadosBrutos.caracteristicas.tipoImovel;
        console.log('Tipo obtido das características:', tipoDoImovel);
      }
      // 3. Valor padrão se nada for encontrado
      else {
        tipoDoImovel = 'Apartamento';
        console.log('Usando tipo padrão:', tipoDoImovel);
      }
      
      // Buscar o telefone diretamente, garantindo valor válido
      let telefoneDoImovel = dadosBrutos.telefoneContato || "";
      console.log('Telefone obtido:', telefoneDoImovel);
      
      // Salvar os valores em states para uso posterior e no console para debug
      console.log('Definindo states para:', {
        tipoImovel: tipoDoImovel || "Apartamento",
        telefone: telefoneDoImovel
      })
      
      setTipoImovelSalvo(tipoDoImovel || "Apartamento")
      setTelefoneSalvo(telefoneDoImovel)
      
      // Resetar o formulário com os dados do imóvel
      setTimeout(() => {
        console.log('Inicializando formulário com dados:', {
          tipo: tipoDoImovel || "Apartamento",
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
          // IMPORTANTE: Usar o tipo de imóvel que encontramos
          tipoImovel: tipoDoImovel || "Apartamento",
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
      console.log('Tipo de imóvel selecionado:', values.tipoImovel);
      console.log('Tipo de imóvel salvo anteriormente:', tipoImovelSalvo);
      
      // CRÍTICO: Garantir que os valores sempre sejam enviados, mesmo quando vazios
      // Isso é crucial para que o backend não use valores antigos quando o usuário limpa um campo
      const telefoneParaEnviar = telefoneLimpo; // Pode ser undefined/vazio, e isso é intencional!
      // Para o tipo, usamos o valor selecionado no formulário, garantindo que seja enviado
      const tipoImovelParaEnviar = values.tipoImovel || tipoImovelSalvo || "Terreno";
      
      console.log('Dados finais para envio:', {
        telefoneContato: telefoneParaEnviar,
        tipoImovel: tipoImovelParaEnviar
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
        // Enviar o tipoImovel explicitamente
        tipoImovel: tipoImovelParaEnviar,
        // SOLUÇÃO DEFINITIVA: Forçar o imóvel a sempre estar ativo, independente do modo
        ativo: true,
        // Campo JSON opcional com metadados adicionais
        caracteristicas: {
          // Também incluir o tipoImovel dentro do objeto caracteristicas
          tipoImovel: tipoImovelParaEnviar,
          anoConstrucao: (imovel?.caracteristicas as any)?.anoConstrucao || new Date().getFullYear(),
          estagioConstrucao: values.status || "Pronto para morar",
          // Preservar outras propriedades que possam existir
          ...(typeof imovel?.caracteristicas === 'object' && !Array.isArray(imovel.caracteristicas) ? imovel.caracteristicas : {})
        }
      }
      
      // URL e método diferentes para criação e edição
      const url = modoEdicao ? `/api/imoveis/${imovel?.id}` : '/api/imoveis'
      const method = modoEdicao ? 'PUT' : 'POST'
      
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
                {/* TIPO DE IMÓVEL COM SOLUÇÃO DEFINITIVA */}
                <FormField
                  control={form.control}
                  name="tipoImovel"
                  render={({ field }) => {
                    // Estado local para controlar o valor do select
                    const [selecionado, setSelecionado] = useState(tipoImovelSalvo || "Terreno");
                    
                    // Forçar valor correto em todas as camadas, a cada renderização
                    useEffect(() => {
                      console.log("REFORÇANDO TIPO DE IMÓVEL:", selecionado);
                      
                      // Atualizar o formulário
                      field.onChange(selecionado);
                      
                      // Atualizar state global
                      setTipoImovelSalvo(selecionado);
                      
                      // Forçar no localStorage
                      if (modoEdicao && imovel?.id) {
                        try {
                          localStorage.setItem(`tipo_imovel_${imovel.id}`, selecionado);
                        } catch (e) {}
                      }
                      
                      // Forçar diretamente no DOM
                      setTimeout(() => {
                        try {
                          const elementos = document.querySelectorAll('select[name="tipoImovel"]');
                          if (elementos && elementos.length > 0) {
                            for (let i = 0; i < elementos.length; i++) {
                              (elementos[i] as HTMLSelectElement).value = selecionado;
                            }
                            console.log("DOM ATUALIZADO COM SUCESSO:", selecionado);
                          }
                        } catch (e) {}
                      }, 100);
                    }, [selecionado]);
                    
                    return (
                      <FormItem className="w-full">
                        <FormLabel>Tipo de Imóvel</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            console.log('MUDOU O TIPO DE IMÓVEL PARA:', value);
                            
                            // Atualizar o state local
                            setSelecionado(value);
                            
                            // Garantir que o formulário também seja atualizado
                            field.onChange(value);
                            
                            // Atualizar todos os states para máxima redundância
                            setTipoImovelSalvo(value);
                            
                            // Hack extremo: mudar a URL da página para forçar atualização no futuro
                            if (modoEdicao && imovel?.id) {
                              history.replaceState({}, "", window.location.href + "?tipo=" + value);
                              localStorage.setItem(`tipo_salvo_${imovel.id}`, value);
                            }
                          }}
                          // Forçar valor definido: SEMPRE usar selecionado que tem prioridade máxima
                          value={selecionado}
                          defaultValue={selecionado}
                        >
                          <FormControl>
                            <SelectTrigger className="capitalize font-medium">
                              <SelectValue placeholder="Selecione o tipo de imóvel" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Apartamento">Apartamento</SelectItem>
                            <SelectItem value="Casa">Casa</SelectItem>
                            <SelectItem value="Terreno">Terreno</SelectItem>
                            <SelectItem value="Imóvel Comercial">Imóvel Comercial</SelectItem>
                            <SelectItem value="Imóvel Rural">Imóvel Rural</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="font-medium text-primary">
                          Tipo atual: {field.value || tipoImovelSalvo || "Terreno"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
              
              {/* Destaque na Página Inicial */}
              <FormField
                control={form.control}
                name="destaque"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Destacar na página inicial</FormLabel>
                      <FormDescription>
                        Este imóvel aparecerá em destaque na página inicial do site
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Campo Ativo */}
              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-1">
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
