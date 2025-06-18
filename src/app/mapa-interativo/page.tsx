"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Building, Home, Phone, Bed, Bath, Square, Car, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Componente interno que usa useSearchParams
function MapaInterativoContent() {
  const searchParams = useSearchParams();
  
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
  
  // Tipagem dos imóveis que vem da API
  interface Imovel {
    id: string;
    idExterno?: string | null;
    titulo: string;
    descricao: string;
    preco: number;
    area: number;
    quartos: number;
    banheiros: number;
    vagas: number;
    endereco: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    latitude?: number;
    longitude?: number;
    imagens: string[];
    fotoPrincipal?: string;
    construtora?: string;
    construtoraId?: string;
    tipoImovel?: string;
    tipoImovelId?: string;
    status?: string;
    dataAtualizacao?: string;
    caracteristicas?: string[];
    destaque?: boolean;
    ativo?: boolean;
    telefoneContato?: string;
    matchPercentage?: number; // Campo adicional para armazenar o percentual de match
    dentroOrcamento?: boolean; // Indica se o imóvel está dentro do orçamento do usuário
    destacado?: boolean; // Indica se o imóvel deve ser destacado no mapa (pin laranja)
  }
  
  // Gerar pins simulados
  interface PinItem {
    id: string;
    titulo: string;
    descricao: string;
    preco: number;
    area: number;
    quartos: number;
    banheiros: number;
    vagas: number;
    imagens: string[];
    fotoPrincipal: string;
    tipoImovel: string;
    position: { left: string; top: string };
    matchPercentage: number;
    dentroOrcamento?: boolean; // Indica se o imóvel está dentro do orçamento do usuário
    destaque?: boolean; // Indica se o imóvel deve ser destacado no mapa (pin laranja)
    indisponivel?: boolean; // Propriedade para marcar pins indisponíveis (pins cinzas)
  }
  
  const [pins, setPins] = useState<PinItem[]>([]);
  const [pinAtivo, setPinAtivo] = useState<string | null>(null);
  
  // Estado para controlar carregamento de dados
  const [carregando, setCarregando] = useState<boolean>(true);
  
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
    const bairro = searchParams.get('bairro');
    const tipoImovel = searchParams.get('tipoImovel');
    const ativo = searchParams.get('ativo');
    
    console.log('Parâmetros de URL recebidos BRUTOS:', { 
      valorMaximo: searchParams.get('valorMaximo'),
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
            if (areaDiff <= 0.1) pontos += criterio.peso;
            else if (areaDiff <= 0.2) pontos += criterio.peso * 0.7;
            else if (areaDiff <= 0.3) pontos += criterio.peso * 0.4;
          }
          break;
          
        case 'preco':
          if (filtros.valorMaximo && imovel.preco) {
            // Preço deve ser até 10% acima do orçamento
            if (imovel.preco <= filtros.valorMaximo) {
              pontos += criterio.peso;
            } else {
              const diff = (imovel.preco - filtros.valorMaximo) / filtros.valorMaximo;
              if (diff <= 0.1) pontos += criterio.peso * 0.7;
              else if (diff <= 0.2) pontos += criterio.peso * 0.3;
            }
          }
          break;
          
        case 'bairro':
          if (filtros.bairro && imovel.bairro) {
            if (imovel.bairro.toLowerCase().includes(filtros.bairro.toLowerCase())) {
              pontos += criterio.peso;
            }
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
    // Buscar imóveis do banco de dados
    const buscarImoveis = async () => {
      setCarregando(true);
      try {
        // Extrair filtros dos parâmetros de URL
        const filtros = extrairFiltrosDeURL();
        console.log('Filtros extraídos da URL:', filtros);
        
        // Tentar obter imóveis do banco de dados com os filtros
        const imoveisData = await obterImoveisDoDb(filtros);
        
        if (imoveisData && imoveisData.length > 0) {
          console.log('Imóveis encontrados no banco:', imoveisData.length);
          
          // Calcular porcentagem de match para cada imóvel
          const imoveisComMatch = imoveisData.map((imovel: any) => {
            const matchPercentage = Object.keys(filtros).length > 0 
              ? calcularMatchPercentage(imovel, filtros)
              : Math.floor(Math.random() * 30) + 70; // Fallback se não houver filtros (70-99%)
            
            return { ...imovel, matchPercentage };
          });
          
          // Ordenar imóveis pelo percentual de match (maior para menor)
          imoveisComMatch.sort((a: any, b: any) => b.matchPercentage - a.matchPercentage);
          
          // Converter os dados do banco para o formato esperado pelo componente
          let imoveisReais: PinItem[] = imoveisComMatch.map((imovel, index) => {
            // Determinar se é um destaque baseado na posição do ranking (TOP 3) e percentual de match
            // Os 3 primeiros imóveis com match acima de 80% são destacados em laranja
            const destaque = index < 3 && imovel.matchPercentage >= 80;
            
            // Determinar se é um imóvel indisponível (pin cinza) - quando o match é baixo
            const indisponivel = imovel.matchPercentage < 70;
            
            return {
              id: imovel.id,
              titulo: imovel.titulo || `Imóvel ${index + 1}`,
              preco: imovel.preco || 200000,
              destaque: destaque, // TOP 3 em laranja
              matchPercentage: imovel.matchPercentage,
              telefoneContato: imovel.telefoneContato || '', // Verificar se tem telefone
              thumbnail: imovel.imagens && imovel.imagens.length > 0 
                ? imovel.imagens[0]
                : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop",
              caracteristicas: {
                quartos: imovel.quartos || 2,
                banheiros: imovel.banheiros || 1,
                area: imovel.area || 80,
                vagas: imovel.vagas || 1
              },
              position: pinPositions[Math.min(index, pinPositions.length - 1)],
              indisponivel: indisponivel // Pins cinzas para imóveis que não atendem às necessidades
            };
          });
          
          // Garantir que temos os 3 melhores imóveis (pins laranjas) e mais alguns imóveis que não atendem às necessidades (pins cinzas)
          // Os 3 primeiros serão os melhores matches, e o resto serã uma mistura de bons e ruins para dar contraste
          
          console.log('Quantidade de imóveis encontrados:', imoveisReais.length);
          
          // IDENTIFICAR imóveis dentro e fora do orçamento (sem remover os fora do orçamento)
          let valorMaximoImovel = 0;
          
          // Verificar todas as formas possíveis de definir o valor máximo
          if (filtros.valorMaximo) {
            valorMaximoImovel = parseFloat(filtros.valorMaximo);
          } else if (filtros.preco?.lte) {
            valorMaximoImovel = parseFloat(filtros.preco.lte);
          } else {
            // Verificar nos search params diretamente
            const valorMaximoParam = searchParams.get('valorMaximo');
            if (valorMaximoParam) {
              valorMaximoImovel = parseFloat(valorMaximoParam);
            }
          }
          
          console.log('\n\n\u2757\ufe0f FILTRO DE VALOR MÁXIMO DEFINIDO:', valorMaximoImovel);
          
          // Se temos um valor máximo definido
          if (valorMaximoImovel > 0) {
            console.log('TOTAL DE IMÓVEIS:', imoveisReais.length);
            
            // Marcar cada imóvel como dentro ou fora do orçamento
            const imoveisDentroOrcamento = [];
            const imoveisDentroPorPreco = [];
            const imoveisDentroPorMatch = [];
            
            imoveisReais.forEach(imovel => {
              // Adicionar marcação se está dentro do orçamento
              imovel.dentroOrcamento = imovel.preco <= valorMaximoImovel;
              
              if (imovel.dentroOrcamento) {
                imoveisDentroOrcamento.push(imovel);
                console.log(`\u2705 ${imovel.titulo}: R$ ${imovel.preco.toLocaleString('pt-BR')} (DENTRO do limite de R$ ${valorMaximoImovel.toLocaleString('pt-BR')})`);
              } else {
                console.log(`\u26A0\ufe0f ${imovel.titulo}: R$ ${imovel.preco.toLocaleString('pt-BR')} (EXCEDE LIMITE de R$ ${valorMaximoImovel.toLocaleString('pt-BR')})`);
              }
            });
            
            console.log(`IMÓVEIS DENTRO DO ORÇAMENTO: ${imoveisDentroOrcamento.length} de ${imoveisReais.length}`);
            
            // Se houver imóveis dentro do orçamento
            if (imoveisDentroOrcamento.length > 0) {
              // Ordenar imóveis dentro do orçamento por match percentage (decrescente)
              imoveisDentroOrcamento.sort((a, b) => b.matchPercentage - a.matchPercentage);
              
              // Selecionar os 3 melhores imóveis dentro do orçamento para destacar (laranja)
              const topImoveisDentroOrcamento = imoveisDentroOrcamento.slice(0, 3);
              
              // Marcar os top 3 imóveis como destacados
              topImoveisDentroOrcamento.forEach(imovel => {
                imovel.destacado = true;
              });
              
              console.log('TOP 3 IMÓVEIS DESTACADOS:');
              topImoveisDentroOrcamento.forEach(imovel => {
                console.log(`- ${imovel.titulo}: Match ${imovel.matchPercentage}%, Preço: R$ ${imovel.preco.toLocaleString('pt-BR')}`);
              });
            } else {
              console.warn('\u26A0\ufe0f NENHUM IMÓVEL DENTRO DO VALOR MÁXIMO ESPECIFICADO');
              // Se não tiver nenhum imóvel dentro do orçamento, destacar os 3 mais baratos
              imoveisReais.sort((a, b) => a.preco - b.preco);
              
              // Pegar os 3 mais baratos
              const imoveisMaisBaratos = imoveisReais.slice(0, 3);
              
              // Marcar como destacados
              imoveisMaisBaratos.forEach(imovel => {
                imovel.destacado = true;
              });
              
              console.log('MOSTRANDO 3 IMÓVEIS MAIS BARATOS (MESMO FORA DO ORÇAMENTO):');
              imoveisMaisBaratos.forEach(imovel => {
                console.log(`- ${imovel.titulo}: R$ ${imovel.preco.toLocaleString('pt-BR')}`);
              });
            }
          }
          
          console.log('Imóveis após filtro de valor:', imoveisReais.length);
          
          // HARD RESET - Garantir que sempre teremos exatamente 3 imóveis de destaque (pins laranjas)
          // Mesmo que não encontremos nenhum imóvel com match alto
          
          // VERIFICAR VALOR MÁXIMO DO IMÓVEL
          // Usar o valorMaximoImovel que já foi definido anteriormente (ou zero se não foi definido)
          
          console.log('\n\n\u2757\ufe0f VALOR MÁXIMO DEFINIDO:', valorMaximoImovel);
          
          // Marcar imóveis como dentro ou fora do orçamento
          if (valorMaximoImovel > 0) {
            // Verificar e marcar cada imóvel
            imoveisReais.forEach(imovel => {
              // Verificar se está dentro do orçamento
              const dentroOrcamento = imovel.preco <= valorMaximoImovel;
              imovel.dentroOrcamento = dentroOrcamento;
              
              console.log(`${dentroOrcamento ? '\u2705' : '\u26A0\ufe0f'} ${imovel.titulo}: R$ ${imovel.preco.toLocaleString('pt-BR')} ${dentroOrcamento ? '(DENTRO do limite)' : '(EXCEDE LIMITE)'}`);
            });
            
            // Separar imóveis dentro e fora do orçamento
            const imoveisDentroOrcamento = imoveisReais.filter(imovel => imovel.dentroOrcamento);
            const imoveisFora = imoveisReais.filter(imovel => !imovel.dentroOrcamento);
            
            console.log(`IMÓVEIS DENTRO DO ORÇAMENTO: ${imoveisDentroOrcamento.length} de ${imoveisReais.length}`);
            
            // Preparar array de imóveis destaques (TOP 3 DENTRO DO ORÇAMENTO)
            let imoveisDestaqueForce: PinItem[] = [];
            
            // Se temos imóveis dentro do orçamento para destacar
            if (imoveisDentroOrcamento.length > 0) {
              // Ordenar os imóveis dentro do orçamento por match percentage
              imoveisDentroOrcamento.sort((a, b) => b.matchPercentage - a.matchPercentage);
              
              // Pegar até 3 imóveis DENTRO do orçamento
              const topDentroOrcamento = imoveisDentroOrcamento.slice(0, 3);
              
              // Map para o formato de pins destacados
              imoveisDestaqueForce = topDentroOrcamento.map((imovel, idx) => ({
                ...imovel,
                destaque: true, // SEMPRE true para imóveis dentro do orçamento
                matchPercentage: Math.max(imovel.matchPercentage, 90 - (idx * 5)),
                position: pinPosicoesLaranja[idx % pinPosicoesLaranja.length] // Usar posições aleatórias para pins laranja
              }));
            }
            
            // Se não temos 3 imóveis dentro do orçamento, completar com os mais baratos fora do orçamento
            if (imoveisDestaqueForce.length < 3 && imoveisFora.length > 0) {
              // Ordenar imóveis fora do orçamento pelo preço (mais baratos primeiro)
              imoveisFora.sort((a, b) => a.preco - b.preco);
              
              // Quantos faltam para completar 3 destaques
              const faltam = 3 - imoveisDestaqueForce.length;
              
              // Pegar os N mais baratos
              const topMaisBaratos = imoveisFora.slice(0, faltam);
              
              // Adicionar aos destaques com match mais baixo
              const maisBaratosDestaques = topMaisBaratos.map((imovel, idx) => ({
                ...imovel,
                destaque: true, // MESMO estando fora do orçamento, destacamos os mais baratos
                matchPercentage: 70 - (idx * 5), // Começa em 70% e diminui
                position: pinPosicoesLaranja[(imoveisDestaqueForce.length + idx) % pinPosicoesLaranja.length] // Usar posições aleatórias para pins laranja
              }));
              
              // Juntar com os destaques que já temos
              imoveisDestaqueForce = [...imoveisDestaqueForce, ...maisBaratosDestaques];
            }
          } 
          // Se não temos valor máximo definido, usar lógica original
          else {
            // Preparar array de imóveis destaques (TOP 3)
            let imoveisDestaqueForce: PinItem[] = [];
            
            // Se temos imóveis suficientes para destacar 3
            if (imoveisReais.length >= 3) {
              // Pegar os 3 primeiros e forçar como destaques
              imoveisDestaqueForce = imoveisReais.slice(0, 3).map((imovel, idx) => ({
                ...imovel,
                destaque: true, // SEMPRE true para os 3 primeiros
                matchPercentage: Math.max(imovel.matchPercentage, 90 - (idx * 5)),
                position: pinPosicoesLaranja[idx % pinPosicoesLaranja.length] // Usar posições aleatórias para pins laranja
              }));
            } 
            // Se temos menos de 3 imóveis
            else if (imoveisReais.length > 0) {
              // Usar os que temos e forçar como destaques
              imoveisDestaqueForce = imoveisReais.map((imovel, idx) => ({
                ...imovel,
                destaque: true,
                matchPercentage: Math.max(imovel.matchPercentage, 90 - (idx * 5)),
                position: pinPosicoesLaranja[idx % pinPosicoesLaranja.length] // Usar posições aleatórias para pins laranja
              }));
            }
          }
          
          // Inicializar a variável de imóveis destacados
          let imoveisDestaque: PinItem[] = [];
          
          // Verificar quais imóveis têm a propriedade destaque=true
          imoveisReais.forEach(imovel => {
            if (imovel.destaque) {
              imoveisDestaque.push(imovel);
            }
          });
          
          // Se não temos pelo menos 3 imóveis destacados, forçar os 3 primeiros como destaque
          if (imoveisDestaque.length < 3 && imoveisReais.length > 0) {
            // Ordenar por match ou preço se valorMaximoImovel estiver definido
            if (valorMaximoImovel > 0) {
              // Primeiro verificar imóveis dentro do orçamento
              const dentroOrcamento = imoveisReais.filter(i => i.preco <= valorMaximoImovel);
              
              if (dentroOrcamento.length > 0) {
                // Destacar até 3 imóveis dentro do orçamento
                dentroOrcamento.sort((a, b) => b.matchPercentage - a.matchPercentage);
                imoveisDestaque = dentroOrcamento.slice(0, 3).map((imovel, idx) => ({
                  ...imovel,
                  destaque: true,
                  matchPercentage: Math.max(imovel.matchPercentage, 90 - (idx * 5)),
                  position: pinPosicoesLaranja[idx % pinPosicoesLaranja.length] // Usar posições aleatórias para pins laranja
                }));
              } else {
                // Se não há imóveis dentro do orçamento, usar os mais baratos
                const ordenados = [...imoveisReais].sort((a, b) => a.preco - b.preco);
                imoveisDestaque = ordenados.slice(0, 3).map((imovel, idx) => ({
                  ...imovel,
                  destaque: true,
                  matchPercentage: 70 - (idx * 5),
                  position: pinPosicoesLaranja[idx % pinPosicoesLaranja.length] // Usar posições aleatórias para pins laranja
                }));
              }
            } else {
              // Sem filtro de valor, usar os com melhor match
              const ordenados = [...imoveisReais].sort((a, b) => b.matchPercentage - a.matchPercentage);
              imoveisDestaque = ordenados.slice(0, 3).map((imovel, idx) => ({
                ...imovel,
                destaque: true,
                matchPercentage: Math.max(imovel.matchPercentage, 90 - (idx * 5)),
                position: pinPosicoesLaranja[idx % pinPosicoesLaranja.length] // Usar posições aleatórias para pins laranja
              }));
            }
          }
          
          console.log('Imóveis destaque:', imoveisDestaque.length);
          console.log('Destaque 1:', imoveisDestaque[0]?.destaque);
          
          // Depois, selecionar alguns imóveis indisponíveis (pins cinzas) - Começando do índice 3 se tivermos mais de 3 imóveis
          const startIndex = Math.min(3, imoveisReais.length);
          const imoveisIndisponiveis = imoveisReais.length > startIndex ?
            imoveisReais.slice(startIndex, startIndex + 5).map((imovel, idx) => ({
              ...imovel,
              destaque: false, // Garantir que não é destaque
              indisponivel: true, // Forçar indisponível para os próximos 5 imóveis
              position: pinPosicoesCinza[idx % pinPosicoesCinza.length] // Usar posições aleatórias para pins cinza
            })) : [];
            
          // Criar pins cinza adicionais com posições aleatórias
          const pinsGrayAdicionais = [];
          const quantidadePinsAdicionais = 15; // Aumentado para 15 pins cinza adicionais
          
          for (let i = 0; i < quantidadePinsAdicionais; i++) {
            // Usar imóveis existentes como base ou criar novos se não houver suficientes
            const imovelBase = imoveisReais[i % imoveisReais.length] || imoveisReais[0];
            
            if (imovelBase) {
              // Determinar qual conjunto de posições usar
              const positionSet = i < 10 ? pinPosicoesCinza : pinPosicoesCinzaExtra;
              const positionIndex = i < 10 ? i : i - 10;
              
              pinsGrayAdicionais.push({
                ...imovelBase,
                id: `pin-gray-${i}`, // ID único para evitar conflitos
                destaque: false,
                indisponivel: true,
                matchPercentage: Math.floor(Math.random() * 30) + 40, // Match entre 40-69%
                position: positionSet[positionIndex % positionSet.length] // Usar posições aleatórias
              });
            }
          }
          
          // Combinar os três grupos, garantindo que os destaques venham primeiro
          const todosImoveis = [...imoveisDestaque, ...imoveisIndisponiveis, ...pinsGrayAdicionais];
          
          // Para garantir que temos pins suficientes, adicionar mais imóveis se necessário
          if (todosImoveis.length < 6 && imoveisReais.length > todosImoveis.length) {
            // Adicionar imóveis que ainda não foram selecionados
            const imoveisFaltantes = imoveisReais.filter(i => 
              !todosImoveis.some(selected => selected.id === i.id)
            ).slice(0, 8 - todosImoveis.length);
            
            todosImoveis.push(...imoveisFaltantes);
          }
          
          // Definir no estado todos os imóveis selecionados
          setPins(todosImoveis);
          console.log(`Mostrando ${todosImoveis.length} imóveis: ${imoveisDestaque.length} destaques, ${imoveisIndisponiveis.length} indisponíveis e ${pinsGrayAdicionais.length} pins cinza adicionais`);
          
          // Ativar automaticamente o primeiro pin (melhor match)
          if (imoveisDestaque.length > 0) {
            setPinAtivo(imoveisDestaque[0].id);
          }
        } else {
          console.warn('Nenhum imóvel encontrado no banco.');
          // Mostrar lista vazia se não houver imóveis
          setPins([]);
        }
      } catch (error) {
        console.error('Erro ao carregar imóveis:', error);
        // Mostrar lista vazia em caso de erro
        setPins([]);
      } finally {
        setCarregando(false);
      }
    };
    
    // Buscar imóveis apenas do banco de dados
    
    buscarImoveis();
  }, []);
  
  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
          <h1 className="text-lg font-medium text-gray-800">Mapa de Imóveis - Curitiba</h1>
        </div>
        
        {/* Mini cards dos imóveis sobre os pins */}
        <AnimatePresence>              
          {pins.map(pin => (
            pinAtivo === pin.id && (
              <motion.div 
                key={pin.id}
                className="absolute z-[150] w-48"
                style={{
                  left: pin.position.left,
                  top: pin.position.top,
                  transform: 'translate(-50%, -120%)'
                }}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 500,
                  damping: 30
                }}
              >
                {/* Verificar se é realmente um pin indisponível (não pode ser um destaque) */}
                {pin.indisponivel && !pin.destaque ? (
                  // Card de imóvel indisponível redesenhado para pins cinza
                  <Card className="overflow-hidden shadow-xl border-0 bg-white/95 backdrop-blur-md w-64">
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
                  <Card className="overflow-hidden shadow-xl border-0 bg-white w-64 backdrop-blur-sm">
                    {/* Imagem de destaque com efeito de gradiente */}
                    <div className="relative h-32 w-full overflow-hidden">
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
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pin.preco)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      {/* Barra de progressão de match */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-medium text-gray-600">Match com seu perfil</span>
                          <span className="text-xs font-bold text-[#fe4f17]">{pin.matchPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#fe4f17] rounded-full" 
                            style={{ width: `${pin.matchPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Características em linha com ícones mais estilizados */}
                      <div className="grid grid-cols-4 gap-1 text-xs mb-3 bg-gray-50 rounded-lg p-2">
                        <div className="flex flex-col items-center gap-1 justify-center">
                          <div className="bg-[#fe4f17]/10 w-8 h-8 rounded-full flex items-center justify-center">
                            <Bed className="h-4 w-4 text-[#fe4f17]" />
                          </div>
                          <span className="font-medium">{pin.caracteristicas.quartos}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 justify-center">
                          <div className="bg-[#fe4f17]/10 w-8 h-8 rounded-full flex items-center justify-center">
                            <Bath className="h-4 w-4 text-[#fe4f17]" />
                          </div>
                          <span className="font-medium">{pin.caracteristicas.banheiros}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 justify-center">
                          <div className="bg-[#fe4f17]/10 w-8 h-8 rounded-full flex items-center justify-center">
                            <Square className="h-4 w-4 text-[#fe4f17]" />
                          </div>
                          <span className="font-medium">{pin.caracteristicas.area}m²</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 justify-center">
                          <div className="bg-[#fe4f17]/10 w-8 h-8 rounded-full flex items-center justify-center">
                            <Car className="h-4 w-4 text-[#fe4f17]" />
                          </div>
                          <span className="font-medium">{pin.caracteristicas.vagas}</span>
                        </div>
                      </div>
                      
                      {/* Botão de contato mais destacado */}
                      <Button 
                        size="sm" 
                        className="w-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 gap-1.5 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Verificar se o imóvel tem telefone de contato
                          if (!pin.telefoneContato) {
                            alert('Este imóvel não possui telefone de contato cadastrado.');
                            return;
                          }
                          
                          // Formatar o número de telefone para o WhatsApp (remover caracteres não numéricos)
                          const telefoneFormatado = pin.telefoneContato.replace(/\D/g, '');
                          // Mensagem pré-definida para o WhatsApp
                          const mensagem = `Olá! Vi o imóvel ${pin.titulo} no sistema iMovia e gostaria de mais informações.`;
                          // Abrir WhatsApp com o número e mensagem
                          window.open(`https://wa.me/55${telefoneFormatado}?text=${encodeURIComponent(mensagem)}`, '_blank');
                        }}
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Atendimento direto
                      </Button>
                    </div>
                  </Card>
                )}
              </motion.div>
            )
          ))}
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
                  {pin.matchPercentage}%
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
