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
  
  // Função para obter imóveis do banco de dados
  async function obterImoveisDoDb() {
    try {
      const response = await fetch('/api/imoveis');
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      return [];
    }
  }
  
  useEffect(() => {
    // Buscar imóveis do banco de dados
    const buscarImoveis = async () => {
      setCarregando(true);
      try {
        // Tentar obter imóveis do banco de dados
        const imoveisData = await obterImoveisDoDb();
        
        if (imoveisData && imoveisData.length > 0) {
          console.log('Imóveis encontrados no banco:', imoveisData.length);
          
          // Converter os dados do banco para o formato esperado pelo componente
          const imoveisReais: PinItem[] = imoveisData.map((imovel, index) => ({
            id: imovel.id,
            titulo: imovel.titulo,
            preco: imovel.preco,
            destaque: index < 3 ? true : false, // Primeiros 3 são destaques
            matchPercentage: index < 3 ? 95 - (index * 5) : 70 - (index * 3),
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
            indisponivel: index >= 3 // Pins não destacados são indisponíveis
          }));
          
          // Adicionar pins cinzas ilustrativos para preencher o mapa
          const pinsIlustrativos: PinItem[] = [];
          for (let i = 0; i < 8; i++) {
            // Usar posições de pin que não estão sendo usadas pelos imóveis reais
            const posIndex = imoveisReais.length + i;
            if (posIndex >= pinPositions.length) break;
            
            pinsIlustrativos.push({
              id: `ilustrativo-${i}`,
              titulo: `Imóvel Ilustrativo ${i+1}`,
              preco: 350000 + (i * 75000),
              destaque: false,
              matchPercentage: 50 - (i * 2),
              thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop",
              caracteristicas: {
                quartos: 1 + Math.floor(i/3),
                banheiros: 1 + Math.floor(i/4),
                area: 60 + (i * 10),
                vagas: Math.floor(i/2)
              },
              position: pinPositions[posIndex],
              indisponivel: true // Todos os pins ilustrativos são indisponíveis (cinzas)
            });
          }
          
          // Combinar imóveis reais com pins ilustrativos
          const todosPins = [...imoveisReais, ...pinsIlustrativos];
          
          // Definir no estado
          setPins(todosPins);
          console.log('Imóveis reais carregados:', imoveisReais.length);
        } else {
          console.warn('Nenhum imóvel encontrado no banco. Usando mocks como fallback.');
          // Fallback para pins simulados caso não haja dados reais
          const pinsMock = gerarPinsMock();
          setPins(pinsMock);
        }
      } catch (error) {
        console.error('Erro ao carregar imóveis:', error);
        // Fallback para pins simulados em caso de erro
        const pinsMock = gerarPinsMock();
        setPins(pinsMock);
      } finally {
        setCarregando(false);
      }
    };
    
    // Função para gerar pins mockados caso não haja dados reais
    const gerarPinsMock = () => {
      const novosImoveis: PinItem[] = [];
      for (let i = 0; i < pinPositions.length; i++) {
        const matchValue = i < 3 ? 90 - (i * 5) : 70 - (i * 2);
        novosImoveis.push({
          id: `imovel-${i}`,
          titulo: `Apartamento ${i < 3 ? 'Premium' : 'Padrão'} ${i+1}`,
          preco: 500000 + (i * 100000),
          destaque: i < 3,
          matchPercentage: matchValue,
          thumbnail: i % 3 === 0 
            ? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop"
            : i % 3 === 1
            ? "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop"
            : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop",
          caracteristicas: {
            quartos: 2 + Math.floor(i/3),
            banheiros: 1 + Math.floor(i/4),
            area: 80 + (i * 15),
            vagas: 1 + Math.floor(i/3)
          },
          position: pinPositions[i],
          indisponivel: i >= 3 // Pins não destacados são indisponíveis
        });
      }
      return novosImoveis;
    };
    
    buscarImoveis();
  }, []);
  
  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full h-full relative">
        {/* Background map image */}
        <div className="absolute inset-0 bg-gray-200/40"></div>
        
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
                        className="w-full text-sm font-medium bg-[#fe4f17] text-white hover:bg-[#fe4f17]/90 gap-1.5 shadow-sm"
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
