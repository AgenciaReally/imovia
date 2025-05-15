"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Phone, MapPin, MapPinned, Building, Home, Navigation, X, LockKeyhole } from "lucide-react";
import { obterImoveisDoDb } from "@/services/imovel-service";

// Definição das interfaces
interface Localizacao {
  lat: number;
  lng: number;
}

interface Imovel {
  id: string;
  titulo: string;
  preco: number;
  caracteristicas: {
    quartos: number;
    banheiros: number;
    area: number;
    vagas?: number;
  };
  localizacao: Localizacao;
  thumbnail?: string;
  matchPercentage?: number;
  destaque?: boolean;
  telefone?: string;
  indisponivel?: boolean; // Propriedade para marcar imóveis indisponíveis (pins cinzas)
}

interface MapaImoveisProps {
  id?: string;
  respostas: Record<string, any>;
  progresso: number;
  perguntaRespondida: string | null;
  onImoveisDestaqueChange?: (imoveis: Imovel[]) => void;
  modoMapa?: "semPins" | "pinsGerais" | "pinsDestaque" | "matchesOnly";
  imoveisSimulados?: Imovel[];
}

// Função para criar coordenadas relativas para posicionar os pins no mapa
// VERSÃO CORRIGIDA: Distribuição apenas nas laterais (evitando centro onde fica o formulário)
const gerarCoordenadas = () => {
  // Definir zonas APENAS NAS LATERAIS para não interferir com o formulário centralizado
  const zonas = [
    // LADO ESQUERDO - 3 zonas verticais
    { xMin: 5, xMax: 25, yMin: 30, yMax: 45 },  // Superior esquerdo
    { xMin: 5, xMax: 25, yMin: 55, yMax: 70 },  // Meio esquerdo
    { xMin: 5, xMax: 25, yMin: 80, yMax: 95 },  // Inferior esquerdo
    
    // LADO DIREITO - 3 zonas verticais
    { xMin: 75, xMax: 95, yMin: 30, yMax: 45 },  // Superior direito
    { xMin: 75, xMax: 95, yMin: 55, yMax: 70 },  // Meio direito
    { xMin: 75, xMax: 95, yMin: 80, yMax: 95 },  // Inferior direito
  ];
  
  // Para cada zona, criar entre 2-4 pins aleatórios dentro da área
  const pontosSelecionados: Array<{x: number, y: number}> = [];
  
  zonas.forEach(zona => {
    // 2 a 4 pins por zona, garantindo boa densidade sem sobrecarga
    const numPins = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numPins; i++) {
      // Posição aleatória dentro da zona
      const x = zona.xMin + Math.random() * (zona.xMax - zona.xMin);
      const y = zona.yMin + Math.random() * (zona.yMax - zona.yMin);
      
      pontosSelecionados.push({ x, y });
    }
  });
  
  // Arrays vazios pois agora usamos apenas os pontos selecionados
  const areas = [];
  
  // Coordenadas APENAS NAS LATERAIS para não interferir com o formulário
  const coordenadas: {x: string, y: string}[] = [
    // LADO ESQUERDO - vertical
    { x: "15%", y: "35%" },  // Superior esquerdo
    { x: "10%", y: "45%" },  // Superior esquerdo 2
    { x: "20%", y: "55%" },  // Meio esquerdo superior
    { x: "15%", y: "65%" },  // Meio esquerdo
    { x: "10%", y: "75%" },  // Meio esquerdo inferior
    { x: "20%", y: "85%" },  // Inferior esquerdo
    
    // LADO DIREITO - vertical
    { x: "85%", y: "35%" },  // Superior direito
    { x: "90%", y: "45%" },  // Superior direito 2
    { x: "80%", y: "55%" },  // Meio direito superior
    { x: "85%", y: "65%" },  // Meio direito
    { x: "90%", y: "75%" },  // Meio direito inferior
    { x: "80%", y: "85%" },  // Inferior direito
  ];
  
  // Adicionar os pontos aleatórios gerados pelas zonas
  pontosSelecionados.forEach(ponto => {
    coordenadas.push({ x: `${ponto.x}%`, y: `${ponto.y}%` });
  });
  
  // Remover duplicatas muito próximas
  return coordenadas.filter((coord, index) => {
    if (index === 0) return true;
    
    for (let i = 0; i < index; i++) {
      const prev = coordenadas[i];
      const distX = Math.abs(parseFloat(coord.x) - parseFloat(prev.x));
      const distY = Math.abs(parseFloat(coord.y) - parseFloat(prev.y));
      
      if (distX < 5 && distY < 5) return false; // Muito próximo
    }
    
    return true;
  });
};

const mapaCoordenadasRelativas = gerarCoordenadas();

// Função para gerar imóveis simulados com base nas características obtidas do DeepSeek
// Em produção, isto seria substituído pela integração real com a API da Orulo
const gerarImoveisSimulados = (quantidadeDesejada: number = 40): Imovel[] => {
  const tipos = ['Apartamento', 'Casa', 'Studio', 'Cobertura', 'Flat', 'Loft', 'Sobrado', 'Kitnet'];
  const adjetivos = ['Moderno', 'Premium', 'Luxuoso', 'Clássico', 'Exclusivo', 'Contemporâneo', 'Elegante', 'Sofisticado'];
  const localizacoes = ['Centro', 'Jardins', 'Itaim', 'Morumbi', 'Pinheiros', 'Vila Madalena', 'Vila Olímpia', 'Brooklin'];
  
  // Gerar percentuais de match aleatórios mas concentrando valores mais altos no início
  const gerarMatch = (index: number, total: number) => {
    const posicaoRelativa = 1 - (index / total); // 1 para o primeiro, 0 para o último
    const baseMatch = 50 + Math.floor(posicaoRelativa * 40); // Entre 50% e 90%
    const variacao = Math.floor(Math.random() * 10) - 5; // -5 a +5
    return Math.min(Math.max(baseMatch + variacao, 50), 98); // Limitar entre 50% e 98%
  };
  
  const imoveis: Imovel[] = [];
  
  for (let i = 0; i < quantidadeDesejada; i++) {
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const adjetivo = adjetivos[Math.floor(Math.random() * adjetivos.length)];
    const localizacao = localizacoes[Math.floor(Math.random() * localizacoes.length)];
    
    const quartos = 1 + Math.floor(Math.random() * 4); // 1 a 4 quartos
    let preco = 0;
    
    // Preço baseado no número de quartos e um pouco de aleatoriedade
    switch(quartos) {
      case 1: preco = 300000 + Math.floor(Math.random() * 200000); break; // 300k-500k
      case 2: preco = 500000 + Math.floor(Math.random() * 300000); break; // 500k-800k
      case 3: preco = 800000 + Math.floor(Math.random() * 700000); break; // 800k-1.5m
      case 4: preco = 1500000 + Math.floor(Math.random() * 1500000); break; // 1.5m-3m
    }
    
    // Características baseadas no número de quartos
    const banheiros = Math.max(1, Math.floor(quartos * 0.7) + (Math.random() > 0.7 ? 1 : 0));
    const area = (quartos * 30) + Math.floor(Math.random() * 50) + 30; // ~30m² por quarto + área comum
    const vagas = Math.max(1, Math.floor(quartos * 0.5) + (Math.random() > 0.7 ? 1 : 0));
    
    // Determinar se é destaque - os primeiros imóveis têm mais chance
    const isDestaque = i < 5 || (i < 10 && Math.random() > 0.7);
    
    // Match percentual - mais alto para os primeiros imóveis
    const matchPercentage = gerarMatch(i, quantidadeDesejada);
    
    imoveis.push({
      id: `imovel-${i+1}`,
      titulo: `${tipo} ${adjetivo} ${isDestaque ? 'em ' + localizacao : ''}`,
      preco,
      caracteristicas: {
        quartos,
        banheiros,
        area,
        vagas
      },
      localizacao: { 
        lat: -23.5505 - (Math.random() * 0.1), 
        lng: -46.6333 - (Math.random() * 0.1) 
      },
      matchPercentage: i < Math.floor(quantidadeDesejada * 0.7) ? matchPercentage : undefined, // Nem todos têm match
      destaque: isDestaque,
      telefone: `119${Math.floor(10000000 + Math.random() * 90000000).toString()}`
    });
  }
  
  // Ordenar por match percentage (os undefined ficam no final)
  return imoveis.sort((a, b) => {
    if (a.matchPercentage && b.matchPercentage) return b.matchPercentage - a.matchPercentage;
    if (a.matchPercentage) return -1;
    if (b.matchPercentage) return 1;
    return 0;
  });
};

// Simulação de resposta que seria retornada pelo DeepSeek para filtrar imóveis
const respostaDeepSeekSimulada = {
  preferencias: {
    orçamento: { min: 400000, max: 1200000 },
    quartos: { min: 2, ideal: 3 },
    tipoImovel: ['Apartamento', 'Casa'],
    caracteristicasImportantes: ['Sacada', 'Piscina', 'Área Gourmet'],
    proximidades: ['Parque', 'Shopping', 'Metrô'],
    match: ['Quartos', 'Localização', 'Preço']
  }
};

// Função para gerar imóveis simulados - usada apenas quando não recebemos imóveis externos

export const MapaImoveis = ({ 
  id,
  respostas, 
  progresso, 
  perguntaRespondida,
  onImoveisDestaqueChange,
  modoMapa: modoMapaProp,
  imoveisSimulados: imoveisSimuladosExternos
}: MapaImoveisProps) => {
  // Checagem se estamos realmente no final completo do formulário (não apenas de uma etapa)
  // Considerar apenas 99-100% como o verdadeiro final (quando a página de resultado será mostrada)
  const formularioTotalmenteFinalizado = progresso >= 99;
  
  // Gerar imóveis simulados localmente se não recebemos via props
  const imoveisSimuladosGerados = useMemo(() => gerarImoveisSimulados(40), []);
  
  // Usando imóveis externos se fornecidos, ou os gerados localmente
  const imoveisSimulados = useMemo(() => imoveisSimuladosExternos || imoveisSimuladosGerados, [imoveisSimuladosExternos, imoveisSimuladosGerados]);
  
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [imoveisDestaque, setImoveisDestaque] = useState<Imovel[]>([]);
  const [imoveisDoBanco, setImoveisDoBanco] = useState<Imovel[]>([]);
  const [carregandoImoveisDoBanco, setCarregandoImoveisDoBanco] = useState(false);
  // Armazena os 3 melhores imóveis (com maior matchPercentage)
  const [top3Imoveis, setTop3Imoveis] = useState<Imovel[]>([]);
  const [pinAtivo, setPinAtivo] = useState<string | null>(null);
  // Usar o modo passado por props ou o padrão
  const [modoMapa, setModoMapa] = useState<"semPins" | "pinsGerais" | "pinsDestaque" | "matchesOnly">(modoMapaProp || "semPins");
  const [carregando, setCarregando] = useState(false);
  const [linhaAtual, setLinhaAtual] = useState<number>(0);
  const [perguntasFinalizada, setPerguntasFinalizada] = useState<boolean>(false);
  // Array com os IDs dos pins que foram revelados
  const [pinsRevelados, setPinsRevelados] = useState<string[]>([]);
  // Referência para o container do mapa, útil para debug
  const mapaRef = useRef<HTMLDivElement>(null);
  
  // Referência para armazenar o último valor de progresso e detectar transições entre fluxos
  const ultimoProgressoRef = useRef<number>(progresso);
  
  // Função para mostrar os cards dos 3 melhores imóveis
  const mostrarCardsMelhoresImoveis = () => {
    if (top3Imoveis.length > 0 && formularioTotalmenteFinalizado) {
      // Ativa o primeiro dos melhores imóveis para mostrar seu card
      setPinAtivo(top3Imoveis[0].id);
    }
  };
  
  // Efeito para buscar imóveis do banco de dados
  useEffect(() => {
    const buscarImoveisDoBanco = async () => {
      try {
        setCarregandoImoveisDoBanco(true);
        const imoveisData = await obterImoveisDoDb();
        
        // Verificar se realmente temos imóveis no banco
        if (imoveisData && imoveisData.length > 0) {
          console.log('Imóveis encontrados no banco:', imoveisData.length);
          
          // Converter os dados do banco para o formato esperado pelo componente
          const imoveisFormatados: Imovel[] = imoveisData.map(imovel => ({
            id: imovel.id,
            titulo: imovel.titulo,
            preco: imovel.preco,
            caracteristicas: {
              quartos: imovel.quartos,
              banheiros: imovel.banheiros,
              area: imovel.area,
              vagas: imovel.vagas
            },
            localizacao: {
              lat: imovel.latitude,
              lng: imovel.longitude
            },
            thumbnail: imovel.imagens && imovel.imagens.length > 0 ? imovel.imagens[0] : undefined,
            matchPercentage: Math.floor(50 + Math.random() * 45), // Simular match por enquanto
            destaque: imovel.destaque || false,
            telefone: imovel.telefoneContato,
            indisponivel: false // Inicialmente, todos os imóveis estão disponíveis
          }));
          
          console.log('Imóveis formatados do banco:', imoveisFormatados);
          
          // Forçar todos os 3 primeiros imóveis a serem destacados para fins de demonstração
          if (imoveisFormatados.length >= 3) {
            imoveisFormatados[0].destaque = true;
            imoveisFormatados[0].matchPercentage = 95;
            imoveisFormatados[1].destaque = true;
            imoveisFormatados[1].matchPercentage = 85;
            imoveisFormatados[2].destaque = true;
            imoveisFormatados[2].matchPercentage = 80;
          }
          
          // Atualizar diretamente os imóveis e destaques
          setImoveisDoBanco(imoveisFormatados);
          
          // Limpar os imóveis antigos antes de definir os novos
          setImoveis([]);
          setTimeout(() => {
            setImoveis(imoveisFormatados); // Definir os imóveis diretamente
          }, 100);
          
          // Definir imóveis em destaque
          const imoveisDestacados = imoveisFormatados.filter(imovel => imovel.destaque);
          setImoveisDestaque(imoveisDestacados);
          
          // Gerar os top 3 imóveis para exibição
          const top3 = [...imoveisFormatados]
            .filter(imovel => imovel.destaque)
            .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
            .slice(0, 3);
            
          setTop3Imoveis(top3);
          
          console.log('Imóveis reais carregados e aplicados:', imoveisFormatados.length);
          console.log('Imóveis em destaque:', imoveisDestacados.length);
          console.log('Top 3 imóveis:', top3.length);
        } else {
          console.warn('Nenhum imóvel encontrado no banco de dados. Usando mocks como fallback.');
        }
      } catch (erro) {
        console.error('Erro ao buscar imóveis do banco:', erro);
      } finally {
        setCarregandoImoveisDoBanco(false);
      }
    };
    
    // Buscar imóveis do banco quando o componente for montado
    buscarImoveisDoBanco();
  }, []);
  
  // Carregar imóveis baseado nas respostas
  useEffect(() => {
    // Detectar se estamos em uma transição entre fluxos (quando o progresso cai mas não até zero)
    const progressoAnterior = ultimoProgressoRef.current;
    ultimoProgressoRef.current = progresso;
    
    // Verificar se estamos numa transição: progresso caiu mas não muito (não voltou ao início)
    const emTransicaoEntreFluxos = progressoAnterior > progresso && progresso > 30;
    
    // Se estamos em transição e já temos pins revelados, não fazemos nada para preservá-los
    if (emTransicaoEntreFluxos && pinsRevelados.length > 0) {
      // Estamos transitando entre fluxos - não mexer nos pins já revelados
      return;
    }
    
    // Essa função não é mais necessária, pois os imóveis já são carregados no useEffect anterior
    // Mantendo apenas por compatibilidade com o código existente
    const carregarImoveis = async () => {
      // Indicar que está carregando
      setCarregando(true);
      
      // Já devemos ter os imóveis carregados - não fazer nada se já estiverem definidos
      if (imoveis.length > 0) {
        console.log('Imóveis já estão carregados:', imoveis.length);
        setCarregando(false);
        return;
      }
      
      // Preferir imóveis do banco de dados, se disponíveis
      if (imoveisDoBanco.length > 0) {
        console.log('Usando imóveis do banco de dados:', imoveisDoBanco.length);
        // Usar imóveis reais do banco
        setImoveis(imoveisDoBanco);
        setImoveisDestaque(imoveisDoBanco.filter(imovel => imovel.destaque));
      } else {
        console.log('FALLBACK: Usando imóveis simulados porque não há imóveis no banco');
        // Fallback: usar imóveis simulados
        setImoveis(imoveisSimulados);
        setImoveisDestaque(imoveisSimulados.filter(imovel => imovel.destaque));
      }
      
      setCarregando(false);
    };
    
    // Sempre mostrar pins quando tiver respostas
    if (Object.keys(respostas).length > 0) {
      // SEMPRE mostrar pins se tiver qualquer progresso
      // Isso garante que os pins apareçam desde o começo
      if (progresso > 0) {
        setModoMapa("pinsGerais");
      }
      
      // Forçar o carregamento dos imóveis se ainda não foram carregados
      if (imoveis.length === 0) {
        // Aqui seria o ponto onde integraria com a API DeepSeek para filtrar
        // os imóveis com base nas respostas do usuário
        
        // Chamar a função para carregar imóveis (reais ou simulados)
        carregarImoveis();
        
        // Usar apenas os imóveis já definidos ao invés de tentar filtrar novamente
        // Se tivermos imóveis, usamos eles, caso contrário, não fazemos mais nada aqui, 
        // pois os imóveis já devem estar carregados no efeito que busca do banco
        if (imoveis.length === 0) {
          console.log('IMPORTANTE: Nenhum imóvel disponível para filtrar');
          return;
        }
        
        console.log('Aplicando filtros aos imóveis já carregados:', imoveis.length);
        
        // Usar os imóveis já carregados
        const imoveisFiltrados = imoveis.map(imovel => {
          // Simular como o DeepSeek influenciaria os matches
          // Só para fins de visualização - em produção isso viria da API
          let match = imovel.matchPercentage;
          
          // Se tiver respostas específicas, ajustar o match
          if (respostas.tipoImovel && match) {
            if (imovel.titulo.includes(respostas.tipoImovel)) {
              match = Math.min(match + 5, 99);
            } else {
              match = Math.max(match - 5, 50);
            }
          }
          
          return {
            ...imovel,
            matchPercentage: match
          };
        });
        
        // Ordenar por match
        const imoveisOrdenados = [...imoveisFiltrados].sort((a, b) => {
          if (a.matchPercentage && b.matchPercentage) return b.matchPercentage - a.matchPercentage;
          if (a.matchPercentage) return -1;
          if (b.matchPercentage) return 1;
          return 0;
        });
        
        setImoveis(imoveisOrdenados);
        
        // Filtrar imóveis destacados
        const destaques = imoveisOrdenados.filter(imovel => 
          imovel.matchPercentage && imovel.matchPercentage >= 85
        );
        
        // Pegar os 3 melhores imóveis (mesmo se tiver mais de 3 destaques)
        const top3 = imoveisOrdenados.slice(0, 3);
        setTop3Imoveis(top3);
        
        setImoveisDestaque(destaques);
        
        // Notificar o componente pai sobre os imóveis destacados
        if (onImoveisDestaqueChange) {
          // Pegar os 3 melhores imóveis para o relatório
          onImoveisDestaqueChange(top3);
        }
      }
    }
    
    // Avançar o efeito visual de linhas com base no progresso
    if (progresso > 0) {
      setLinhaAtual(Math.min(Math.floor(progresso / 10), 10));
      
      // Revelar pins gradualmente conforme o progresso
      const totalPinsAMostrar = Math.min(
        Math.ceil(progresso / 5), // Revelar mais pins por progresso (1 a cada 5%)
        imoveis.length || imoveisSimulados.length // Nunca tenta mostrar mais pins do que existem
      );
      
      // Criar um array de IDs dos pins que devem estar visíveis
      // Usar os imóveis já carregados se disponíveis, senão usar os simulados
      const imoveisSource = imoveis.length > 0 ? imoveis : imoveisSimulados;
      
      // Pins estratégicos: primeiro os destaques, depois os outros
      let novosPins: string[] = [];
      
      // Adicionar pins de destaque primeiro (se existirem)
      imoveisSource
        .filter(i => i.destaque)
        .slice(0, Math.min(Math.ceil(totalPinsAMostrar * 0.5), 10)) // No máximo 10 destaques
        .forEach(imovel => novosPins.push(imovel.id));
        
      // Completar com pins normais até atingir o total desejado
      if (novosPins.length < totalPinsAMostrar) {
        const pinsRestantes = imoveisSource
          .filter(i => !i.destaque && !novosPins.includes(i.id))
          .slice(0, totalPinsAMostrar - novosPins.length)
          .map(i => i.id);
          
        novosPins = [...novosPins, ...pinsRestantes];
      }
      
      // Só atualiza se for diferente para evitar re-renderizações desnecessárias
      if (JSON.stringify(novosPins) !== JSON.stringify(pinsRevelados)) {
        setPinsRevelados(novosPins);
      }
    }
    
    // Verificar se finalizou as perguntas - considera finalizado quando o progresso é quase 100%
    // Usar 99% como limite para garantir que só fique laranja na última pergunta/tela
    if (progresso >= 99) {
      setPerguntasFinalizada(true);
      // Mostrar todos os pins quando finalizar
      const source = imoveis.length > 0 ? imoveis : imoveisSimulados;
      setPinsRevelados(source.map(imovel => imovel.id));
    } else {
      // Durante o progresso, sempre considerar como não finalizado
      // Isso impede que entre fluxos os pins fiquem laranja
      setPerguntasFinalizada(false);
    }
  }, [progresso, respostas, imoveis.length]);

  // Atualizar linhas entre pins quando uma pergunta for respondida
  useEffect(() => {
    if (perguntaRespondida) {
      // Simular o desenho de uma nova linha entre pins
      setLinhaAtual(prevLinha => {
        // Incrementar a linha atual, mas nunca passar do número de imóveis - 1
        const novaLinha = Math.min(prevLinha + 1, imoveis.length - 1);
        return novaLinha;
      });
      
      // NÃO revelar pins quando estivermos no modo semPins (página principal)
      if (modoMapa !== "semPins") {
        setPinsRevelados(prev => {
          if (prev.length < imoveisSimulados.length) {
            // Adicionar de 1 a 3 pins novos a cada pergunta respondida
            const pinsNovos = [];
            const numNovos = Math.min(3, imoveisSimulados.length - prev.length);
            
            for (let i = 0; i < numNovos; i++) {
              const proximoIndex = prev.length + i;
              if (proximoIndex < imoveisSimulados.length) {
                pinsNovos.push(imoveisSimulados[proximoIndex].id);
              }
            }
            
            // Adicionar novos pins revelados
            return [...prev, ...pinsNovos];
          }
          return prev;
        });
      }
      
      // Nunca mudar o modo do mapa para manter sempre semPins na página principal
    }
  }, [perguntaRespondida, imoveis.length, modoMapa]);

  // Renderizar pins no mapa - versão melhorada
  const renderizarPins = () => {
    // NÃO mostrar pins quando modoMapa for semPins (usado na página principal)
    if (modoMapa === "semPins") return null;
    
    const pinsParaRenderizar = modoMapa === "pinsDestaque" ? 
      imoveisDestaque : 
      imoveis;
      
    return (
      <>
        {pinsParaRenderizar.map((imovel, idx) => {
          if (idx >= mapaCoordenadasRelativas.length) return null;
          
          // Apenas mostrar pins que foram revelados pelo progresso
          if (!pinsRevelados.includes(imovel.id)) return null;
          
          const { x, y } = mapaCoordenadasRelativas[idx];
          
          // Só considerar destaque se o formulário estiver COMPLETAMENTE finalizado (99%+)
          // E apenas se for um dos top 3 imóveis com melhor match
          const isTop3 = top3Imoveis.some(top => top.id === imovel.id);
          const isDestaque = formularioTotalmenteFinalizado ? 
            (pinAtivo === imovel.id || isTop3) : 
            false;
          
          const isActive = pinAtivo === imovel.id;
          const matchLabel = imovel.matchPercentage ? `${Math.round(imovel.matchPercentage)}%` : '';
          
          // Se os pins estiverem colados no topo, vamos forçar posições absolutas com base no índice
          // Essa abordagem garante distribuição uniforme independente das coordenadas
          
          // Calcular posicionamento com base no índice, garantindo distribuição uniforme
          // Arranjo em 4 linhas e 6 colunas
          const linha = Math.floor(idx / 6) % 4; // 0-3 (4 linhas)
          const coluna = idx % 6; // 0-5 (6 colunas)
          
          // Posições em pixels absolutas
          // Colocando em 4 linhas equidistantes (200px, 350px, 500px, 650px do topo)
          const topPx = 200 + (linha * 150); 
          // Colocando em 6 colunas equidistantes
          const containerWidth = 1000; // Largura estimada do container
          const leftPx = (containerWidth / 7) * (coluna + 1); // Dividir em 7 partes e usar posições 1-6
          
          return (
            <motion.div
              key={imovel.id}
              className={`absolute z-[100] cursor-pointer`}
              style={{ 
                left: `${leftPx}px`, 
                top: `${topPx}px`, 
                transform: 'translate(-50%, -50%)', 
                pointerEvents: 'auto' 
              }}
              initial={{ scale: 0, opacity: 0, y: '-20px' }}
              animate={{ 
                scale: isDestaque ? 1.2 : 1, 
                opacity: 1,
                y: 0
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400,
                damping: 15,
                delay: idx * 0.1
              }}
              whileHover={{ 
                scale: 1.3, 
                filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.6))'
              }}
              onClick={() => {
                // Marcar o pin como ativo para exibir o card
                setPinAtivo(imovel.id === pinAtivo ? null : imovel.id);
                
                // Também definir se é um imóvel indisponível (pin cinza) ou disponível (pin laranja)
                if (!(isDestaque && formularioTotalmenteFinalizado)) {
                  // Se for pin cinza, marcar como indisponível
                  imovel.indisponivel = true;
                } else {
                  // Se for pin laranja, garantir que não está marcado como indisponível
                  imovel.indisponivel = false;
                }
              }}
            >
              {/* Container principal do pin */}
              <div className="relative">
                {/* Pin com efeito de pulsação */}
                <div 
                  className={`relative w-10 h-10 ${isDestaque && formularioTotalmenteFinalizado ? 
                    'bg-gradient-to-br from-orange-400 to-orange-600' : 
                    'bg-gradient-to-br from-gray-300 to-gray-400'} 
                    rounded-full flex items-center justify-center shadow-lg`}
                  style={{
                    boxShadow: isDestaque && formularioTotalmenteFinalizado ? 
                      '0 0 0 4px rgba(249, 115, 22, 0.3), 0 0 16px rgba(249, 115, 22, 0.6)' : 
                      '0 0 0 2px rgba(255, 255, 255, 0.4)'
                  }}
                >
                  {/* Ícone dentro do pin */}
                  {isActive ? (
                    <Building className="w-5 h-5 text-white" />
                  ) : isDestaque && formularioTotalmenteFinalizado ? (
                    <Home className="w-4 h-4 text-white" />
                  ) : (
                    <MapPin className="w-4 h-4 text-gray-600" />
                  )}
                  
                  {/* Efeito de pulsação para pins destacados */}
                  {isDestaque && formularioTotalmenteFinalizado && (
                    <span className="absolute inset-0 rounded-full animate-ping-slow bg-orange-400 opacity-50" />
                  )}
                </div>
                
                {/* Badge de match percentage */}
                {imovel.matchPercentage && (
                  <span 
                    className="absolute -top-2 -right-2 min-w-[24px] h-6 flex items-center justify-center 
                              bg-white text-xs font-bold text-orange-600 rounded-full shadow-md"
                    style={{ padding: '0 6px' }}
                  >
                    {matchLabel}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </>
    );
  };

  // Renderizar linhas entre os pins - versão melhorada com curvas e animações
  const renderizarLinhas = () => {
    // Verificar se podemos mostrar linhas
    if (modoMapa === "semPins" || pinsRevelados.length < 2) return null;
    
    // Garantir que o número de linhas seja no máximo o número de pins revelados - 1
    const totalLinhas = Math.min(pinsRevelados.length - 1, linhaAtual + 1);
    
    return Array.from({ length: totalLinhas }).map((_, idx) => {
      const pin1Index = idx;
      const pin2Index = idx + 1;
      
      if (pin1Index >= mapaCoordenadasRelativas.length || 
          pin2Index >= mapaCoordenadasRelativas.length) {
        return null;
      }
      
      const pin1 = mapaCoordenadasRelativas[pin1Index];
      const pin2 = mapaCoordenadasRelativas[pin2Index];
      
      // Determinar se esta linha é uma das 3 últimas (que ficarão laranja ao finalizar)
      const isLastThree = perguntasFinalizada && (totalLinhas - idx <= 3);
      
      // Criar dois pontos de controle para curva Bezier mais sofisticada (curva cúbica)
      // Usando uma função determinística em vez de random() para manter consistência visual
      const seed = pin1Index * 100 + pin2Index; // Seed consistente para este par de pins
      const randOffset1 = Math.sin(seed) * 20;
      const randOffset2 = Math.cos(seed) * 20;
      
      const controlX1 = parseFloat(pin1.x) + (parseFloat(pin2.x) - parseFloat(pin1.x)) * 0.25 + randOffset1;
      const controlY1 = parseFloat(pin1.y) + (parseFloat(pin2.y) - parseFloat(pin1.y)) * 0.25 - Math.abs(randOffset1);
      
      const controlX2 = parseFloat(pin1.x) + (parseFloat(pin2.x) - parseFloat(pin1.x)) * 0.75 + randOffset2;
      const controlY2 = parseFloat(pin1.y) + (parseFloat(pin2.y) - parseFloat(pin1.y)) * 0.75 + Math.abs(randOffset2);
      
      // Construir path SVG usando curva cúbica (mais sofisticada)
      const path = `M ${pin1.x} ${pin1.y} C ${controlX1}% ${controlY1}%, ${controlX2}% ${controlY2}%, ${pin2.x} ${pin2.y}`;
      
      // Calcular comprimento aproximado da linha para animação
      const dx = parseFloat(pin2.x) - parseFloat(pin1.x);
      const dy = parseFloat(pin2.y) - parseFloat(pin1.y);
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Definir cores e efeitos com base no status da linha
      // Linhas cinzas para as normais, laranja para as últimas 3 quando finalizado
      const colorStart = isLastThree ? "#f97316" : "#94a3b8";
      const colorMid = isLastThree ? "#fb923c" : "#cbd5e1";
      const colorEnd = isLastThree ? "#fdba74" : "#e2e8f0";
      
      // Opção de animacao com delay opcional
      const animationDelay = isLastThree ? idx * 0.3 : idx * 0.2;
      
      return (
        <div key={`linha-container-${idx}`} className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          <svg width="100%" height="100%" className="absolute">
            <defs>
              <linearGradient id={`lineGradient-${idx}`} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={colorStart} stopOpacity="0.8" />
                <stop offset="50%" stopColor={colorMid} stopOpacity="0.8" />
                <stop offset="100%" stopColor={colorEnd} stopOpacity="0.6" />
              </linearGradient>
              
              {/* Filtro para brilho/glow - mais intenso para as últimas 3 linhas */}
              <filter id={`glow-${idx}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation={isLastThree ? "3" : "1.5"} result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              
              {/* Filtro de tracejado para linhas mais sofisticadas */}
              <pattern id={`dashPattern-${idx}`} patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="20" y2="0" stroke={isLastThree ? colorMid : "#cbd5e1"} strokeWidth="6" strokeDasharray={isLastThree ? "1, 10" : "1, 12"} />
              </pattern>
            </defs>
            
            {/* Linha de fundo tracejada para efeito decorativo */}
            {!isLastThree && (
              <motion.path
                d={path}
                stroke={`url(#dashPattern-${idx})`}
                strokeWidth="1"
                strokeLinecap="round"
                fill="none"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: animationDelay, ease: "easeOut" }}
              />
            )}
            
            {/* Linha principal com gradiente */}
            <motion.path
              d={path}
              stroke={`url(#lineGradient-${idx})`}
              strokeWidth={isLastThree ? "3" : "2"}
              strokeLinecap="round"
              fill="none"
              filter={`url(#glow-${idx})`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: animationDelay, ease: "easeOut" }}
            />
            
            {/* Partículas animadas se movendo ao longo da linha */}
            {(isLastThree || idx % 3 === 0) && (
              <circle
                r={isLastThree ? "3" : "2"}
                fill={isLastThree ? "#fff" : "#e2e8f0"}
                filter={`url(#glow-${idx})`}
              >
                <animateMotion
                  path={path}
                  dur={isLastThree ? "2s" : "3s"}
                  begin={`${animationDelay + 0.8}s`}
                  fill="freeze"
                  repeatCount="indefinite"
                >
                  <animate 
                    attributeName="opacity"
                    values="0; 0.8; 0"
                    dur={isLastThree ? "2s" : "3s"}
                    repeatCount="indefinite"
                  />
                </animateMotion>
              </circle>
            )}
          </svg>
        </div>
      );
    });
  };

  // Expor a função mostrarCardsMelhoresImoveis para o componente pai
  useEffect(() => {
    // Atribuir a função ao componente para que possa ser acessada externamente
    if (mapaRef.current) {
      // @ts-ignore - adicionando uma propriedade personalizada ao elemento
      mapaRef.current.mostrarCardsMelhoresImoveis = mostrarCardsMelhoresImoveis;
    }
  }, [top3Imoveis, formularioTotalmenteFinalizado]);
  
  // Calculamos o número de pins a revelar com base no progresso
  useEffect(() => {
    // Se estiver no modo matchesOnly, mostrar apenas os pins top3
    if (modoMapa === "matchesOnly") {
      if (top3Imoveis.length > 0) {
        const top3Ids = top3Imoveis.map(i => i.id);
        setPinsRevelados(top3Ids);
      }
    }
    // Se temos progresso, revelar pins gradualmente no modo normal
    else if (progresso > 0 && modoMapa !== "semPins") {
      // Calcular quantos pins mostrar, no máximo o total de pins do mapa
      const maxPins = imoveis.length || imoveisSimulados.length;
      const numPinsToShow = Math.min(
        Math.ceil(progresso / 10), // Aproximadamente 10 pins ao completar 100%
        maxPins
      );
      
      // Selecionar IDs dos pins a serem mostrados
      const imoveisFonte = imoveis.length > 0 ? imoveis : imoveisSimulados;
      // Garantir que só revelamos a quantidade certa de pins
      const newPins = imoveisFonte.slice(0, numPinsToShow).map(i => i.id);
      
      if (JSON.stringify(newPins) !== JSON.stringify(pinsRevelados)) {
        setPinsRevelados(newPins);
      }
    }
  }, [progresso, imoveis, modoMapa, top3Imoveis]);
  
  return (
    <div id={id} ref={mapaRef} className="w-full h-[900px] md:h-[420px]  backdrop-blur-md border border-white/30 relative overflow-hidden" style={{ position: 'relative', pointerEvents: 'all' }}>
      {/* Sistema original de pins - restaurado e corrigido - VISÍVEL APENAS SE NÃO ESTIVER NO MODO SEM PINS */}
      {modoMapa !== "semPins" && (
        <div className="hidden md:block absolute inset-0 z-[200]">
          {renderizarPins()}
        </div>
      )}
      
      {/* Div para capturar os pins - adicionada em camada superior */}
      <div className="absolute inset-0 z-[9999] pointer-events-none" id="pin-overlay"></div>
      {/* Imagem de fundo (mapa) */}
      <div className="absolute inset-0 bg-gray-50/40">
        <div className="w-full h-full relative">
          {carregando && (
            <div className="absolute z-30 inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <div className="animate-spin w-8 h-8 border-2 border-orange-500 rounded-full border-t-transparent" />
            </div>
          )}
          
          {modoMapa === "semPins" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8 backdrop-blur-sm bg-white/60 rounded-xl max-w-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-orange-500" />
                </div>
              
                <div className="flex justify-center mt-4">
                  <div className="relative">
                    <span className="absolute -top-1 -left-1 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
                {/* Renderizar linhas conectando os pins */}
              <svg className="absolute inset-0 w-full h-full overflow-visible z-10 pointer-events-none">
                {pinsRevelados.length >= 2 && pinsRevelados.slice(0, -1).map((pinId, idx) => {
                  if (idx + 1 >= pinsRevelados.length) return null;
                  
                  // Encontrar os índices dos imóveis para estes IDs
                  const imovel1 = imoveis.findIndex(i => i.id === pinId);
                  const imovel2 = imoveis.findIndex(i => i.id === pinsRevelados[idx + 1]);
                  
                  if (imovel1 === -1 || imovel2 === -1) return null;
                  if (imovel1 >= mapaCoordenadasRelativas.length || 
                      imovel2 >= mapaCoordenadasRelativas.length) return null;
                  
                  const pin1 = mapaCoordenadasRelativas[imovel1];
                  const pin2 = mapaCoordenadasRelativas[imovel2];
                  
                  // Determinar se esta linha é uma das 3 últimas (que ficarão laranja ao finalizar)
                  const isLastThree = perguntasFinalizada && (pinsRevelados.length - idx <= 3);
                  const stroke = isLastThree ? "#f97316" : "#94a3b8";
                  const strokeWidth = isLastThree ? 3 : 2;
                  
                  // Criar uma linha curva entre os pins
                  const seed = imovel1 * 100 + imovel2; // Seed consistente para este par de pins
                  const randOffset = Math.sin(seed) * 15;
                  
                  const controlX = (parseFloat(pin1.x) + parseFloat(pin2.x)) / 2 + randOffset;
                  const controlY = (parseFloat(pin1.y) + parseFloat(pin2.y)) / 2 - Math.abs(randOffset);
                  
                  const path = `M ${pin1.x} ${pin1.y} Q ${controlX}% ${controlY}% ${pin2.x} ${pin2.y}`;
                  
                  return (
                    <path 
                      key={`linha-curva-${idx}`}
                      d={path}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
              
              {/* Renderizar as linhas com curvas e efeitos (caso prev. solução não funcione) */}
              <div className="absolute inset-0 z-10 overflow-visible pointer-events-none">
                {renderizarLinhas()}
              </div>
              
              {/* Pins dos imóveis (com z-index maior) - Totalmente ocultos no mobile */}
              <div className="hidden md:block" style={{position: 'relative', zIndex: 9999}}>
                {renderizarPins()}
              </div>
              
              {/* Elementos decorativos do mapa */}
              <motion.div 
                className="absolute left-[30%] top-[30%] w-32 h-32 rounded-full border-2 border-dashed border-orange-200/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1, opacity: [0, 0.5, 0.3] }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <motion.div 
                className="absolute right-[40%] bottom-[20%] w-48 h-48 rounded-full border-2 border-dashed border-orange-200/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1, opacity: [0, 0.5, 0.3] }}
                transition={{ duration: 2, delay: 0.8 }}
              />
              
              {/* Grade do mapa com linhas finas */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 z-0">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={`col-${i}`} className="border-r border-gray-200/20 h-full" />
                ))}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`row-${i}`} className="border-b border-gray-200/20 w-full" />
                ))}
              </div>
              
              {/* Cards de imóveis quando um pin estiver ativo */}
              <AnimatePresence>
                {pinAtivo && imoveis.map(imovel => {
                  if (imovel.id !== pinAtivo) return null;
                  
                  // Encontrar as coordenadas do pin ativo
                  const pinIndex = imoveis.findIndex(i => i.id === pinAtivo);
                  if (pinIndex === -1 || pinIndex >= mapaCoordenadasRelativas.length) return null;
                  
                  const { x, y } = mapaCoordenadasRelativas[pinIndex];
                  
                  // Card de imóvel indisponível para pins cinzas
                  if (imovel.indisponivel) {
                    return (
                      <motion.div
                        key={`indisponivel-card-${imovel.id}`}
                        className="absolute z-[100]"
                        style={{ 
                          left: x, 
                          top: y,
                          transform: 'translate(-50%, -120%)'
                        }}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.3, type: "spring" }}
                      >
                        <Card className="w-72 backdrop-blur-md bg-white/95 shadow-xl border border-gray-200 overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-center justify-center mb-3 text-gray-600">
                              <X className="w-5 h-5 mr-2" />
                              <span className="font-semibold text-lg">Imóvel Indisponível</span>
                            </div>
                            
                            <div className="text-center text-sm text-gray-500 mb-4">
                              Este imóvel não está disponível para visualização detalhada no momento.
                              <br />Por favor, consulte um de nossos imóveis destacados (pins laranja).
                            </div>
                            
                            <div className="flex justify-center mt-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setPinAtivo(null)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                Fechar
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  }
                  
                  {/* Mini-card durante o preenchimento do formulário - sempre mostrar até finalizar 100% */}
                  if (!formularioTotalmenteFinalizado) {
                    return (
                      <motion.div
                        key={`mini-card-${imovel.id}`}
                        className="absolute z-[100]"
                        style={{ 
                          left: x, 
                          top: y,
                          transform: 'translate(-50%, -110%)'
                        }}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.3, type: "spring" }}
                      >
                        <Card className="w-60 backdrop-blur-md bg-white/90 shadow-xl border border-white/40 overflow-hidden">
                          <div className="p-3">
                            <div className="flex items-center justify-center mb-2 text-orange-500">
                              <LockKeyhole className="w-5 h-5 mr-2" />
                              <span className="font-semibold">Imóvel Bloqueado</span>
                            </div>
                            
                            <div className="text-center text-sm text-gray-600 mb-3">
                              Complete as perguntas para desbloquear este imóvel e outros compatíveis com seu perfil.
                            </div>
                            
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                                style={{ width: `${progresso}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 text-center mt-1">
                              {Math.round(progresso)}% concluído
                            </div>
                            
                            {/* Botão para fechar o mini-card */}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setPinAtivo(null);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  }
                  
                  // Card completo após finalizar o formulário
                  return (
                    <motion.div
                      key={`card-${imovel.id}`}
                      className="absolute z-[100]"
                      style={{ 
                        left: x, 
                        top: y,
                        transform: 'translate(-50%, -120%)'
                      }}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.3, type: "spring" }}
                    >
                      <Card className="w-72 backdrop-blur-md bg-white/95 shadow-xl border border-white/40 overflow-hidden">
                        <div className="relative h-32 bg-muted group cursor-pointer overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            {/* Borda pontilhada */}
                            <div className="absolute inset-4 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                              <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-md">
                                <p className="text-muted-foreground text-sm text-center">
                                  {imovel.destaque ? "Imagem disponível após contato" : "Imagem borrada"}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Efeito de hover na imagem */}
                          <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                          
                          {imovel.matchPercentage && (
                            <Badge 
                              className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-3 py-1 rounded-full"
                            >
                              {imovel.matchPercentage}% match
                            </Badge>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="mb-3">
                            {/* Título borrado */}
                            <div className="font-semibold text-lg mb-1 relative overflow-hidden">
                              <div className="filter blur-[3px] text-gray-600 absolute inset-0">
                                {imovel.titulo || "Imóvel exclusivo"}
                              </div>
                              <div className="text-transparent select-none">
                                {imovel.titulo || "Imóvel exclusivo"}
                              </div>
                              <div className="absolute top-0 left-0 bg-gray-200 px-2 py-0.5 rounded text-xs text-gray-700">
                                Título borrado
                              </div>
                            </div>
                            <div className="text-muted-foreground text-xs mb-1">
                              Localização revelada após contato
                            </div>
                            <div className="text-lg font-bold text-primary">
                              {imovel.preco.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                              })}
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-sm my-3 bg-gray-50/50 p-2 rounded-lg">
                            <div className="flex flex-col items-center">
                              <span className="font-medium">{imovel.caracteristicas.quartos}</span>
                              <span className="text-xs text-gray-500">quartos</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="font-medium">{imovel.caracteristicas.banheiros}</span>
                              <span className="text-xs text-gray-500">banh.</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="font-medium">{imovel.caracteristicas.area}</span>
                              <span className="text-xs text-gray-500">m²</span>
                            </div>
                            {imovel.caracteristicas.vagas && (
                              <div className="flex flex-col items-center">
                                <span className="font-medium">{imovel.caracteristicas.vagas}</span>
                                <span className="text-xs text-gray-500">vagas</span>
                              </div>
                            )}
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <Button
                            size="sm"
                            className="w-full mt-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Aqui teria uma ação para entrar em contato
                              window.open(`tel:${imovel.telefone}`, '_blank');
                            }}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Entrar em contato
                          </Button>
                          
                          {/* Botão para fechar o card */}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setPinAtivo(null);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </>
          )}
          
          {/* Legenda do mapa */}
       
          {/* Instrução para clicar nos pins */}
          {modoMapa === "pinsDestaque" && (
            <div className="absolute bottom-3 right-3 backdrop-blur-md bg-white/70 p-3 rounded-xl shadow-lg text-sm border border-white/30 max-w-xs">
              <div className="flex items-center">
             
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
