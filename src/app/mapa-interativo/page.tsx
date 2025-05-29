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
  
  // Gerar pins simulados
  interface PinItem {
    id: string;
    titulo: string;
    preco: number;
    destaque: boolean;
    matchPercentage: number;
    thumbnail: string;
    telefoneContato?: string; // Telefone de contato para WhatsApp
    caracteristicas: {
      quartos: number;
      banheiros: number;
      area: number;
      vagas: number;
    };
    position: {
      left: string;
      top: string;
    };
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
        
        // Tratar filtros de preço (pode vir como valorMaximo/valorMinimo ou como preco.lte/preco.gte)
        if (filtros.preco) {
          if (filtros.preco.lte) {
            params.append('valorMaximo', filtros.preco.lte.toString());
          }
          if (filtros.preco.gte) {
            params.append('valorMinimo', filtros.preco.gte.toString());
          }
        } else {
          // Manter compatibilidade com versão antiga
          if (filtros.valorMaximo) {
            params.append('valorMaximo', filtros.valorMaximo.toString());
          }
          if (filtros.valorMinimo) {
            params.append('valorMinimo', filtros.valorMinimo.toString());
          }
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
    
    // Adicionar apenas os parâmetros que existem
    if (quartos) filtros.quartos = parseInt(quartos, 10);
    if (banheiros) filtros.banheiros = parseInt(banheiros, 10);
    
    // Tratar valores mínimos e máximos
    if (valorMinimo || valorMaximo) {
      filtros.preco = {};
      if (valorMinimo) filtros.preco.gte = parseFloat(valorMinimo);
      if (valorMaximo) filtros.preco.lte = parseFloat(valorMaximo);
    } else if (valorMaximo) {
      // Manter compatibilidade com versão antiga que só usava valorMaximo
      filtros.preco = { lte: parseFloat(valorMaximo) };
    }
    
    if (area) filtros.area = parseInt(area, 10);
    if (bairro) filtros.bairro = bairro;
    if (tipoImovel) filtros.tipoImovel = tipoImovel;
    
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
          
          // Converter os dados do banco para o formato esperado pelo componente
          const imoveisReais: PinItem[] = imoveisData.map((imovel, index) => {
            // Calcular porcentagem de match para cada imóvel usando a função
            const matchPercentage = Object.keys(filtros).length > 0 
              ? calcularMatchPercentage(imovel, filtros)
              : index < 3 ? 95 - (index * 5) : 70 - (index * 3); // Fallback se não houver filtros
            
            return {
              id: imovel.id,
              titulo: imovel.titulo,
              preco: imovel.preco,
              destaque: matchPercentage >= 80, // Imóveis com match alto são destaques
              matchPercentage,
              telefoneContato: imovel.telefoneContato, // Usar apenas o telefone do próprio imóvel
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
              indisponivel: matchPercentage < 70 // Pins com match baixo são indisponíveis
            };
          });
          
          // Definir no estado - usar apenas os imóveis reais
          setPins(imoveisReais);
          console.log('Imóveis reais carregados:', imoveisReais.length);
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
                {pin.indisponivel ? (
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
