"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Building, Home, Phone, Bed, Bath, Square, Car, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SemImoveisAlerta } from '@/components/mapa/SemImoveisAlerta';
// Importar tipos compartilhados
import { Imovel, PinItem } from "@/types/imovel";
// Importar utilitários de preço
import { formatarPreco } from "@/utils/preco-utils";

// Componente interno que usa useSearchParams
function MapaInterativoContent() {
  const searchParams = useSearchParams();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Função para calcular a posição do card de forma que ele não saia do mapa
  const getCardPosition = (leftPos: string, topPos: string) => {
    // Converter valores percentuais para números
    const left = parseFloat(leftPos);
    const top = parseFloat(topPos);
    
    // Definir margens seguras em percentual
    const SAFE_MARGIN = 15; // 15% de margem segura de cada lado
    const BOTTOM_SAFE_MARGIN = 25; // Margem maior para a parte inferior
    
    // Base - posicionar acima do pin
    let transformValue = 'translate(-50%, -120%)';
    
    // Ajustar quando está perto da borda esquerda
    if (left < SAFE_MARGIN) {
      transformValue = 'translate(0%, -120%)';
    }
    // Ajustar quando está perto da borda direita
    else if (left > (100 - SAFE_MARGIN)) {
      transformValue = 'translate(-100%, -120%)';
    }
    
    // Ajustar quando está perto da borda superior
    if (top < SAFE_MARGIN) {
      transformValue = transformValue.replace('-120%', '20%');
    }
    // Ajustar quando está perto da borda inferior
    else if (top > (100 - BOTTOM_SAFE_MARGIN)) {
      transformValue = transformValue.replace('-120%', '-220%');
    }
    
    return {
      left: leftPos,
      top: topPos,
      transform: transformValue
    };
  };
  
  // Localizações fixas dos pins (nas laterais)
  const pinPositions = [
    { left: "15%", top: "35%" },  // Superior esquerdo
    { left: "10%", top: "45%" },  // Superior esquerdo 2
    { left: "20%", top: "55%" },  // Meio esquerdo superior
    { left: "15%", top: "65%" },  // Meio esquerdo
    { left: "10%", top: "75%" },  // Meio esquerdo inferior
    { left: "20%", top: "85%" },  // Inferior esquerdo
    
    { left: "85%", top: "35%" },  // Superior direito
    { left: "90%", top: "45%" },  // Superior direito 2
    { left: "80%", top: "55%" },  // Meio direito superior
    { left: "85%", top: "65%" },  // Meio direito
    { left: "90%", top: "75%" },  // Meio direito inferior
    { left: "80%", top: "85%" },  // Inferior direito
  ];
  
  // Função para gerar posições aleatórias para pins
  const gerarPosicoesAleatorias = (quantidade: number, area: string = "central") => {
    const posicoes = [];
    
    for (let i = 0; i < quantidade; i++) {
      let left, top;
      
      // Diferentes áreas do mapa para distribuição
      switch(area) {
        case "central":
          // Área central (25% a 75%)
          left = Math.floor(Math.random() * 50) + 25 + "%";
          top = Math.floor(Math.random() * 50) + 25 + "%";
          break;
        case "superior":
          // Área superior (10% a 40% de altura)
          left = Math.floor(Math.random() * 80) + 10 + "%";
          top = Math.floor(Math.random() * 30) + 10 + "%";
          break;
        case "inferior":
          // Área inferior (60% a 90% de altura)
          left = Math.floor(Math.random() * 80) + 10 + "%";
          top = Math.floor(Math.random() * 30) + 60 + "%";
          break;
        case "esquerda":
          // Lado esquerdo
          left = Math.floor(Math.random() * 30) + 5 + "%";
          top = Math.floor(Math.random() * 70) + 15 + "%";
          break;
        case "direita":
          // Lado direito
          left = Math.floor(Math.random() * 30) + 65 + "%";
          top = Math.floor(Math.random() * 70) + 15 + "%";
          break;
        default:
          // Distribuição completa (5% a 95%)
          left = Math.floor(Math.random() * 90) + 5 + "%";
          top = Math.floor(Math.random() * 90) + 5 + "%";
      }
      
      posicoes.push({ left, top });
    }
    
    return posicoes;
  };
  
  // Gerar posições aleatórias para diferentes tipos de pins
  const pinPosicoesLaranja = gerarPosicoesAleatorias(5, "completa"); // Posições para pins laranja
  const pinPosicoesCinza = gerarPosicoesAleatorias(15, "central"); // Posições para pins cinza centrais
  const pinPosicoesCinzaExtra = [
    ...gerarPosicoesAleatorias(5, "superior"),
    ...gerarPosicoesAleatorias(5, "inferior"),
    ...gerarPosicoesAleatorias(3, "esquerda"),
    ...gerarPosicoesAleatorias(3, "direita")
  ]; // Posições extras para mais pins cinza
  
  // Tipos já importados no início do arquivo
  
  const [pins, setPins] = useState<PinItem[]>([]);
  const [pinAtivo, setPinAtivo] = useState<string | null>(null);
  
  // Estado para controlar carregamento de dados
  const [carregando, setCarregando] = useState<boolean>(true);
  
  // Estado para filtros atuais
  const [filtrosAtuais, setFiltrosAtuais] = useState<{
    cidade: string | null;
    bairro: string | null;
  }>({ cidade: null, bairro: null });
  
  // Estado para indicar se não foram encontrados imóveis com os filtros atuais
  const [semImoveis, setSemImoveis] = useState<boolean>(false);
  
  // Função para limpar filtros de localização
  const limparFiltrosLocalizacao = () => {
    // Criar uma nova URL sem os parâmetros de cidade e bairro
    const url = new URL(window.location.href);
    url.searchParams.delete('cidade');
    url.searchParams.delete('bairro');
    
    // Navegar para a nova URL
    window.location.href = url.toString();
  };
  
  // Função para obter imóveis do banco de dados com filtros opcionais
  async function obterImoveisDoDb(filtros?: Record<string, any>) {
    try {
      // Construir URL com parâmetros de filtro
      let url = '/api/imoveis';
      
      if (filtros && Object.keys(filtros).length > 0) {
        const params = new URLSearchParams();
        
        // Adicionar filtros específicos baseados nas respostas
        if (filtros.quartos) {
          params.append('quartos', filtros.quartos.toString());
        }
        
        if (filtros.banheiros) {
          params.append('banheiros', filtros.banheiros.toString());
        }
        
        // SEMPRE PASSAR FILTROS DE PREÇO - PRIORIDADE ABSOLUTA
        // Verificar se há um valor máximo definido (forma direta)
        if (filtros.valorMaximo) {
          params.append('valorMaximo', filtros.valorMaximo.toString());
          console.log('\u2757\ufe0f APLICANDO FILTRO DE VALOR MÁXIMO DIRETO:', filtros.valorMaximo);
        }
        
        // Verificar se existe um objeto preco com limites
        if (filtros.preco) {
          if (filtros.preco.lte && !params.has('valorMaximo')) {
            params.append('valorMaximo', filtros.preco.lte.toString());
            console.log('Aplicando filtro de valor máximo via preco.lte:', filtros.preco.lte);
          }
          if (filtros.preco.gte) {
            params.append('valorMinimo', filtros.preco.gte.toString());
          }
        }
        
        // Adicionando valor mínimo tradicional se estiver definido
        if (filtros.valorMinimo && !params.has('valorMinimo')) {
          params.append('valorMinimo', filtros.valorMinimo.toString());
        }
        
        if (filtros.area) {
          params.append('area', filtros.area.toString());
        }
        
        if (filtros.cidade) {
          params.append('cidade', filtros.cidade);
          console.log('Aplicando filtro de cidade:', filtros.cidade);
        }
        
        if (filtros.bairro) {
          params.append('bairro', filtros.bairro);
        }
        
        if (filtros.tipoImovel) {
          params.append('tipoImovel', filtros.tipoImovel);
        }
        
        // Adicionar parâmetro para filtrar apenas imóveis ativos
        params.append('ativo', 'true');
        
        url = `${url}?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar imóveis: ${response.statusText}`);
      }
      
      const imoveis = await response.json();
      console.log(`Encontrados ${imoveis.length} imóveis com os filtros aplicados:`, filtros);
      return imoveis;
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      return [];
    }
  }
  
  // Função para extrair filtros das respostas de URL
  const extrairFiltrosDeURL = () => {
    const filtros: Record<string, any> = {};
    
    // Extrair filtros dos parâmetros de URL
    const quartos = searchParams.get('quartos');
    const banheiros = searchParams.get('banheiros');
    const valorMinimo = searchParams.get('valorMinimo');
    const valorMaximo = searchParams.get('valorMaximo');
    const area = searchParams.get('area');
    const cidade = searchParams.get('cidade');
    const bairro = searchParams.get('bairro');
    const tipoImovel = searchParams.get('tipoImovel');
    const ativo = searchParams.get('ativo');
    
    console.log('Parâmetros de URL recebidos BRUTOS:', { 
      valorMaximo: searchParams.get('valorMaximo'),
      cidade: searchParams.get('cidade'),
      todos: Object.fromEntries([...searchParams.entries()])
    });
    
    // Adicionar apenas os parâmetros que existem
    if (quartos) filtros.quartos = parseInt(quartos, 10);
    if (banheiros) filtros.banheiros = parseInt(banheiros, 10);
    
    // Forçar valor máximo se estiver definido
    if (valorMaximo) {
      const valor = parseFloat(valorMaximo);
      console.log('⭐ Valor máximo do imóvel definido:', valor);
      filtros.valorMaximo = valor;
    }
    
    // Configuração de preço para API
    filtros.preco = {};
    if (valorMinimo) filtros.preco.gte = parseFloat(valorMinimo);
    if (valorMaximo) filtros.preco.lte = parseFloat(valorMaximo);
    
    if (area) filtros.area = parseInt(area, 10);
    if (cidade) filtros.cidade = cidade;
    if (bairro) filtros.bairro = bairro;
    if (tipoImovel) filtros.tipoImovel = tipoImovel;
    
    // Sempre filtrar apenas imóveis ativos
    filtros.ativo = true;
    
    // Adicionar modo matches para priorização especial
    const modo = searchParams.get('modo');
    if (modo === 'matches') {
      filtros.modoMatches = true;
    }
    
    console.log('Filtros extraídos para API de imóveis:', filtros);
    return filtros;
  };
  
  // Função para calcular a porcentagem de match entre o imóvel e os filtros
  const calcularMatchPercentage = (imovel: any, filtros: Record<string, any>) => {
    let pontos = 0;
    let totalPossivel = 0;
    
    // Critérios de match com pesos
    const criterios = [
      { campo: 'quartos', peso: 25 },
      { campo: 'banheiros', peso: 15 },
      { campo: 'area', peso: 20 },
      { campo: 'preco', peso: 30 },
      { campo: 'bairro', peso: 10 }
    ];
    
    // Verificar cada critério
    criterios.forEach(criterio => {
      totalPossivel += criterio.peso;
      
      switch (criterio.campo) {
        case 'quartos':
          if (filtros.quartos && imovel.quartos) {
            // Match exato = 100%, 1 a mais ou a menos = 50%
            const diff = Math.abs(filtros.quartos - imovel.quartos);
            if (diff === 0) pontos += criterio.peso;
            else if (diff === 1) pontos += criterio.peso * 0.5;
          }
          break;
          
        case 'banheiros':
          if (filtros.banheiros && imovel.banheiros) {
            const diff = Math.abs(filtros.banheiros - imovel.banheiros);
            if (diff === 0) pontos += criterio.peso;
            else if (diff === 1) pontos += criterio.peso * 0.5;
          }
          break;
          
        case 'area':
          if (filtros.area && imovel.area) {
            // Aceitar até 20% de diferença
            const areaDiff = Math.abs(filtros.area - imovel.area) / filtros.area;
            if (areaDiff <= 0.2) {
              pontos += criterio.peso;
            }
          }
          break;
          
        case 'preco':
          if (filtros.valorMaximo && imovel.preco) {
            // Preço deve estar dentro do orçamento especificado
            if (imovel.preco <= filtros.valorMaximo) {
              pontos += criterio.peso;
            }
            // Não dar pontos para imóveis acima do orçamento
          }
          break;
      }
    });
    
    // Adicionar pontos para imóveis em destaque
    if (imovel.destaque) {
      pontos += 10;
      totalPossivel += 10;
    }
    
    // Calcular porcentagem final
    return Math.min(Math.round((pontos / totalPossivel) * 100), 98); // Limitar a 98% para sempre ter espaço para melhorias
  };
  
  useEffect(() => {
    // Comunicação entre o iframe e a página pai
    const handleMessage = (event: MessageEvent) => {
      // Verificar origem da mensagem (opcional, para segurança)
      
      if (event.data === 'enviarImoveisSelecionados') {
        // A página pai está solicitando os imóveis selecionados (destacados)
        // Filtrar apenas os pins que são destaques (pins laranjas)
        const pinsDestacados = pins.filter(pin => pin.destaque === true);
        console.log(`📍 Enviando ${pinsDestacados.length} pins destacados para página principal`);
        
        // Adicionar log detalhado para debugging
        pinsDestacados.forEach((pin, index) => {
          console.log(`📌 Pin destacado ${index + 1}:`, 
            `ID: ${pin.id}`, 
            `Título: ${pin.titulo}`,
            `Match: ${pin.matchPercentage || 0}%`,
            `Destaque: ${pin.destaque}`
          );
        });
        
        // Enviar pins destacados para a página principal
        if (window.parent && window.parent !== window) {
          try {
            // Criar objetos simplificados com destaque=true explícito para garantir consistência
            const imoveisParaEnviar = pinsDestacados.map(pin => ({
              id: pin.id,
              titulo: pin.titulo,
              preco: pin.preco,
              destaque: true, // Garantir que esta propriedade está explicitamente definida
              matchPercentage: pin.matchPercentage,
              telefoneContato: pin.telefoneContato,
              thumbnail: pin.thumbnail,
              caracteristicas: pin.caracteristicas,
              quartos: pin.caracteristicas?.quartos,
              banheiros: pin.caracteristicas?.banheiros,
              area: pin.caracteristicas?.area,
              vagas: pin.caracteristicas?.vagas
            }));
            
            // Chamar a função na página pai com os objetos formatados
            (window.parent as any).receberPinsDestacados?.(imoveisParaEnviar);
            console.log('✅ Imóveis destacados enviados com sucesso para a página pai');
          } catch (error) {
            console.error('Erro ao enviar pins destacados:', error);
          }
        }
      }
    };
    
    // Adicionar listener
    window.addEventListener('message', handleMessage);
    
    // Enviar pinos destacados assim que o componente montar e os pins forem carregados
    if (pins.length > 0) {
      const pinsDestacados = pins.filter(pin => pin.destaque === true);
      if (pinsDestacados.length > 0 && window.parent && window.parent !== window) {
        try {
          console.log(`📍 Enviando automaticamente ${pinsDestacados.length} pins destacados`);
          
          // Criar objetos simplificados para envio
          const imoveisParaEnviar = pinsDestacados.map(pin => ({
            id: pin.id,
            titulo: pin.titulo,
            preco: pin.preco,
            destaque: true,
            matchPercentage: pin.matchPercentage,
            telefoneContato: pin.telefoneContato,
            thumbnail: pin.thumbnail,
            caracteristicas: pin.caracteristicas,
            quartos: pin.caracteristicas?.quartos,
            banheiros: pin.caracteristicas?.banheiros,
            area: pin.caracteristicas?.area,
            vagas: pin.caracteristicas?.vagas
          }));
          
          // Chamar a função na página pai
          (window.parent as any).receberPinsDestacados?.(imoveisParaEnviar);
        } catch (error) {
          console.error('Erro ao enviar pins destacados iniciais:', error);
        }
      }
    }
    
    // Remover listener quando componente for desmontado
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [pins]);

  useEffect(() => {
    // Verificar se temos dados de matches diretos na URL (método antigo)
    const matchesParam = searchParams.get('matches');
    const matchesId = searchParams.get('matchesId');
    
    let matches = null;
    
    if (matchesId) {
      // Novo método: buscar dados do localStorage
      try {
        const matchesData = localStorage.getItem(matchesId);
        if (matchesData) {
          matches = JSON.parse(matchesData);
          // Limpar localStorage após uso
          localStorage.removeItem(matchesId);
          console.log('🎯 Recebidos matches do localStorage:', matches);
        }
      } catch (e) {
        console.error('Erro ao ler matches do localStorage:', e);
      }
    } else if (matchesParam) {
      // Método antigo: ler da URL (pode causar erro 431)
      try {
        matches = JSON.parse(decodeURIComponent(matchesParam));
        console.log('🎯 Recebidos matches da URL:', matches);
      } catch (e) {
        console.error('Erro ao parsear matches da URL:', e);
      }
    }
    
    if (matches) {
      try {
        // Converter matches para formato de pins
        const pinsDoMatches = matches.map((match: any, index: number) => ({
          id: match.id,
          latitude: parseFloat(match.latitude) || 0,
          longitude: parseFloat(match.longitude) || 0,
          titulo: match.titulo,
          preco: match.preco,
          valor: match.preco,
          endereco: match.endereco,
          quartos: match.quartos,
          banheiros: match.banheiros,
          vagas: match.vagas,
          area: match.area,
          telefone: match.telefoneContato,
          construtora: match.construtora,
          images: match.galeriaFotos || [match.fotoPrincipal || '/placeholder-image.jpg'],
          thumbnail: match.thumbnail || match.fotoPrincipal || '/placeholder-image.jpg',
          destaque: true,
          matchPercentage: Math.round(match.score || match.matchPercentage || 85 + (index * 5)),
          // IMPORTANTE: Adicionar position para renderização no mapa
          position: {
            left: `${20 + (index * 25)}%`, // Distribuir horizontalmente
            top: `${30 + (index * 15)}%`   // Distribuir verticalmente
          }
        }));
        
        setPins(pinsDoMatches);
        setCarregando(false);
        return;
      } catch (e) {
        console.error('Erro ao parsear matches:', e);
      }
    }
    
    // Buscar imóveis usando análise Deepseek
    const buscarImoveisComDeepseek = async () => {
      try {
        setCarregando(true);
        setSemImoveis(false);
        
        // Extrair respostas dos parâmetros de URL
        const respostasParam = searchParams.get('respostas');
        let respostas = [];
        
        if (respostasParam) {
          try {
            respostas = JSON.parse(decodeURIComponent(respostasParam));
          } catch (e) {
            console.error('Erro ao parsear respostas da URL:', e);
          }
        }
        
        // Se não temos respostas, extrair filtros básicos da URL
        if (respostas.length === 0) {
          const filtros = extrairFiltrosDeURL();
          
          // Converter filtros em formato de respostas
          if (filtros.quartos) {
            respostas.push({
              pergunta: { texto: 'Quantos quartos você deseja?', categoria: 'caracteristicas' },
              resposta: filtros.quartos.toString()
            });
          }
          if (filtros.valorMaximo) {
            respostas.push({
              pergunta: { texto: 'Qual o valor máximo que você pode investir?', categoria: 'financeiro' },
              resposta: `R$ ${filtros.valorMaximo.toLocaleString('pt-BR')}`
            });
          }
          if (filtros.cidade) {
            respostas.push({
              pergunta: { texto: 'Em qual cidade você gostaria de morar?', categoria: 'localizacao' },
              resposta: filtros.cidade
            });
          }
        }
        
        console.log('🤖 Iniciando busca com Deepseek, respostas:', respostas.length);
        
        // Chamar API do mapa com análise Deepseek
        const response = await fetch('/api/mapa-imoveis-deepseek', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ respostas })
        });
        
        if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.pins && data.pins.length > 0) {
          console.log('✅ Pins recebidos da análise Deepseek:', data.pins.length);
          console.log('📊 Método de análise:', data.metodoAnalise);
          console.log('💡 Análise:', data.analise);
          
          // Usar diretamente os pins da análise Deepseek
          const pinsDoDeepseek: PinItem[] = data.pins.map((pin: any) => ({
            id: pin.id,
            titulo: pin.titulo,
            preco: pin.preco,
            destaque: pin.destaque || false,
            matchPercentage: pin.matchPercentage || 50,
            telefoneContato: pin.telefoneContato || '',
            thumbnail: pin.thumbnail || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop",
            caracteristicas: pin.caracteristicas || {
              quartos: 2,
              banheiros: 1, 
              area: 80,
              vagas: 1
            },
            position: pin.position,
            indisponivel: pin.indisponivel || false,
            endereco: pin.endereco,
            construtora: pin.construtora,
            motivos: pin.motivos || []
          }));
          
          console.log('📍 Pins processados do Deepseek:', pinsDoDeepseek.length);
          console.log('🟠 Pins laranja (destaques):', pinsDoDeepseek.filter(p => p.destaque).length);
          console.log('⚫ Pins cinzas:', pinsDoDeepseek.filter(p => p.indisponivel).length);
          
          // Definir os pins finais
          setPins(pinsDoDeepseek);
          
          // Ativar automaticamente o primeiro pin de destaque
          const pinDestaque = pinsDoDeepseek.find(p => p.destaque);
          if (pinDestaque) {
            setPinAtivo(pinDestaque.id);
            console.log('🎯 Pin ativo definido:', pinDestaque.titulo);
          }
          
        } else {
          console.warn('❌ Nenhum pin recebido da análise Deepseek');
          setSemImoveis(true);
          setPins([]);
        }
      } catch (error) {
        console.error('❌ Erro ao buscar imóveis com Deepseek:', error);
        setSemImoveis(true);
        setPins([]);
      } finally {
        setCarregando(false);
      }
    };
    
    buscarImoveisComDeepseek();
  }, [searchParams]);
  
  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-orange-50 to-white">
      <div className="w-full h-full relative">
        {/* Background estilizado simulando um mapa em tons de cinza */}
        <div className="absolute inset-0">
          {/* Base do mapa */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"></div>
          
          {/* Grade simulando ruas */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
          
          {/* Ruas principais */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/70"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/70"></div>
          
          {/* Áreas de "parques" */}
          <div className="absolute top-[20%] left-[20%] w-[15%] h-[15%] rounded-full bg-gray-300/30"></div>
          <div className="absolute bottom-[20%] right-[20%] w-[20%] h-[10%] rounded-full bg-gray-300/30"></div>
          
          {/* "Lago" */}
          <div className="absolute top-[40%] right-[30%] w-[10%] h-[25%] rounded-full bg-gray-400/20"></div>
        </div>
        
        {/* Overlay com efeito suave para dar destaque aos pins */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 pointer-events-none"></div>
        
        {/* Título do mapa */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-orange-100">
          <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#fe4f17] rounded-full animate-pulse"></div>
            Mapa de Imóveis {filtrosAtuais.cidade ? `- ${filtrosAtuais.cidade}` : '- Curitiba'}
          </h1>
        </div>
        
        {/* Alerta quando não há imóveis para a cidade selecionada */}
        {semImoveis && (
          <div className="absolute top-20 left-4 right-4 z-50 max-w-2xl mx-auto">
            <SemImoveisAlerta 
              cidade={filtrosAtuais.cidade} 
              bairro={filtrosAtuais.bairro}
              onLimparFiltros={limparFiltrosLocalizacao}
            />
          </div>
        )}
        
        {/* Card centralizado no meio do mapa */}
        <AnimatePresence>              
          {pinAtivo && (
            <motion.div 
              key="modal-container"
              className="fixed inset-0 z-[150] flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Overlay escuro semi-transparente */}
              <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setPinAtivo(null)}
              />
              
              {/* Card centralizado */}
              {pins.filter(p => p.id === pinAtivo).map(pin => (
                <motion.div 
                  key={pin.id}
                  className="relative z-10 p-2 max-w-[95vw] mx-auto"
                  initial={{ scale: 0.9, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 10, opacity: 0 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                  }}
                >
                  {/* Verificar se é realmente um pin indisponível (não pode ser um destaque) */}
                  {pin.indisponivel && !pin.destaque ? (
                    // Card de imóvel indisponível redesenhado para pins cinza
                    <Card className="overflow-hidden shadow-xl border-0 bg-white/95 backdrop-blur-md w-80">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">
                            <X className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="font-semibold text-base text-gray-700">Imóvel Indisponível</span>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 my-3">
                          <p className="text-gray-600 text-sm">
                            Este imóvel não está disponível para visualização detalhada no momento.
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50/50">
                        <div className="flex justify-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-300 text-gray-600 hover:bg-gray-100"
                            onClick={() => setPinAtivo(null)}
                          >
                            Fechar
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[#fe4f17] hover:text-[#fe4f17]/90 hover:bg-[#fe4f17]/10"
                            onClick={() => {
                              setPinAtivo(null);
                              // Aqui poderia mostrar imóveis similares
                            }}
                          >
                            Ver Similares
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    // Card redesenhado para imóveis disponíveis (pins laranja/destaques)
                    <Card 
                      className="overflow-hidden shadow-xl border-0 bg-white w-80 backdrop-blur-sm"
                    >
                      {/* Botão para fechar no canto superior direito */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full z-10"
                        onClick={() => setPinAtivo(null)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                      
                      {/* Imagem de destaque com efeito de gradiente */}
                      <div className="relative h-40 w-full overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-center bg-cover" 
                          style={{ backgroundImage: `url(${pin.thumbnail})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm py-1 px-2 rounded-full shadow-sm">
                          <p className="text-[#fe4f17] text-xs font-semibold">{pin.titulo}</p>
                        </div>
                        
                        {/* Preço em destaque na parte inferior da imagem */}
                        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm py-1 px-2 rounded-lg shadow-sm">
                          <p className="text-sm font-bold text-gray-800">
                            {formatarPreco(pin.preco)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        {/* Barra de progressão de match */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-medium text-gray-600">Match com seu perfil</span>
                            <span className="text-xs font-bold text-[#fe4f17]">{pin.matchPercentage || 0}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#fe4f17] rounded-full" 
                              style={{ width: `${pin.matchPercentage || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Características em linha com ícones mais estilizados */}
                        <div className="grid grid-cols-4 gap-1 text-xs mb-3 bg-gray-50 rounded-lg p-2">
                          <div className="flex flex-col items-center gap-1 justify-center">
                            <div className="bg-[#fe4f17]/10 w-8 h-8 rounded-full flex items-center justify-center">
                              <Bed className="h-4 w-4 text-[#fe4f17]" />
                            </div>
                            <span className="font-medium">{pin.caracteristicas?.quartos || pin.quartos || 0}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 justify-center">
                            <div className="bg-[#fe4f17]/10 w-8 h-8 rounded-full flex items-center justify-center">
                              <Bath className="h-4 w-4 text-[#fe4f17]" />
                            </div>
                            <span className="font-medium">{pin.caracteristicas?.banheiros || pin.banheiros || 0}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 justify-center">
                            <div className="bg-[#fe4f17]/10 w-8 h-8 rounded-full flex items-center justify-center">
                              <Square className="h-4 w-4 text-[#fe4f17]" />
                            </div>
                            <span className="font-medium">{pin.caracteristicas?.area || pin.area || 0}m²</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 justify-center">
                            <div className="bg-[#fe4f17]/10 w-8 h-8 rounded-full flex items-center justify-center">
                              <Car className="h-4 w-4 text-[#fe4f17]" />
                            </div>
                            <span className="font-medium">{pin.caracteristicas?.vagas || pin.vagas || 0}</span>
                          </div>
                        </div>
                        
                        {/* Botão de contato mais destacado */}
                        <Button 
                          size="sm" 
                          className="w-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 gap-2 shadow-lg rounded-full py-3 transition-all duration-200 hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            
                            // Criar mensagem com todos os imóveis visíveis (SEM ENDEREÇO - COM DETALHES)
                            const imoveisInfo = pins.filter(p => !p.indisponivel).slice(0, 3).map((imovel, index) => {
                              const detalhes = [
                                `${index + 1}. 🏠 ${imovel.titulo}`,
                                `🆔 ID: ${imovel.id}`,
                                `💰 Preço: ${formatarPreco(imovel.preco)}`,
                                imovel.quartos ? `🛏️ Quartos: ${imovel.quartos}` : '',
                                imovel.banheiros ? `🚿 Banheiros: ${imovel.banheiros}` : '',
                                imovel.area ? `📐 Área: ${imovel.area}m²` : '',
                                imovel.vagas ? `🚗 Vagas: ${imovel.vagas}` : '',
                                imovel.construtora ? `🏢 Construtora: ${imovel.construtora}` : '',
                                imovel.thumbnail ? `📸 Foto: ${imovel.thumbnail}` : ''
                              ].filter(Boolean).join('\n');
                              return detalhes;
                            }).join('\n\n');
                            
                            const mensagem = `Olá, vim através do app iMovia e gostaria de obter mais informações desses imóveis:\n\n${imoveisInfo}`;
                            
                            // Número fixo do WhatsApp
                            window.open(`https://wa.me/554192223032?text=${encodeURIComponent(mensagem)}`, '_blank');
                          }}
                        >
                          <Phone className="h-4 w-4" />
                          Atendimento direto
                        </Button>
                      </div>
                    </Card>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pins */}
        {pins.map((pin, index) => (
          <div
            key={pin.id}
            className="absolute cursor-pointer z-50"
            style={{
              left: pin.position.left,
              top: pin.position.top,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => setPinAtivo(pin.id === pinAtivo ? null : pin.id)}
          >
            <div className="relative">
              <div 
                className={`relative w-10 h-10 ${pin.destaque ? 
                  'bg-[#fe4f17]' : 
                  'bg-gradient-to-br from-gray-300 to-gray-400'} 
                  rounded-full flex items-center justify-center shadow-lg`}
                style={{
                  boxShadow: pin.destaque ? 
                    '0 0 0 4px rgba(254, 79, 23, 0.3), 0 0 16px rgba(254, 79, 23, 0.6)' : 
                    '0 0 0 2px rgba(255, 255, 255, 0.4)'
                }}
              >
                {pin.destaque ? (
                  <Home className="w-4 h-4 text-white" />
                ) : (
                  <MapPin className="w-4 h-4 text-gray-600" />
                )}
                
                {pin.destaque && (
                  <span className="absolute inset-0 rounded-full animate-ping-slow bg-[#fe4f17]/70 opacity-50" />
                )}
              </div>
              
              {/* Match percentage */}
              {pin.destaque && (
                <span 
                  className="absolute -top-2 -right-2 min-w-[24px] h-6 flex items-center justify-center 
                           bg-white text-xs font-bold text-orange-600 rounded-full shadow-md"
                  style={{ padding: '0 6px' }}
                >
                  {pin.matchPercentage || 0}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente principal envolvido em Suspense
export default function MapaInterativoPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Carregando mapa...</div>}>
      <MapaInterativoContent />
    </Suspense>
  );
}
