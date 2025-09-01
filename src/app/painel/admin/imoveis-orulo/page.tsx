'use client';

import { useEffect, useState } from 'react';
import { OruloBuilding, OruloAddress, OruloDefaultImage } from '@/types/orulo';
import { motion } from 'framer-motion';
import {
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw, Info, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { formatarPreco } from '@/utils/format';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Skeleton } from '@/components/ui/skeleton';
import { ImovelOruloModal } from '@/components/dashboard/imovel/imovel-orulo-modal';
import { useToast } from '@/components/ui/use-toast';

// Componente para exibir estado vazio (sem imóveis ou erro)
function EmptyStateImoveis({ mensagem, onReload }: { mensagem: string, onReload: () => void }) {
  return (
    <div className="text-center py-16 bg-muted/30 rounded-xl">
      <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-xl font-medium">{mensagem}</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
        Não encontramos imóveis. Tente recarregar os dados.
      </p>
      <Button 
        variant="default" 
        size="lg"
        onClick={onReload}
        className="gap-2"
      >
        <RefreshCcw className="h-4 w-4" />
        Recarregar imóveis
      </Button>
    </div>
  );
}

// Helper para obter a URL da imagem com segurança
function getImageUrl(defaultImage: string | OruloDefaultImage | undefined): string | null {
  if (!defaultImage) return null;
  
  if (typeof defaultImage === 'string') {
    return defaultImage;
  }
  
  // Se for um objeto, tente obter uma das imagens disponíveis
  return (
    defaultImage['1024x1024'] || 
    defaultImage['800x600'] || 
    defaultImage['520x280'] || 
    Object.values(defaultImage)[0] || 
    null
  );
}

// Helper para obter informações de endereço com segurança
function getAddressInfo(address: string | OruloAddress | undefined): {
  city: string;
  state: string;
  neighborhood: string;
} {
  const defaultValue = { city: '', state: '', neighborhood: '' };
  
  if (!address) return defaultValue;
  
  if (typeof address === 'string') {
    return defaultValue;
  }
  
  return {
    city: address.city || '',
    state: address.state || '',
    neighborhood: address.neighborhood || ''
  };
}

export default function ImoveisOruloPage() {
  const [imoveis, setImoveis] = useState<OruloBuilding[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImovel, setSelectedImovel] = useState<OruloBuilding | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const skeletonArray = Array(8).fill(0);
  const { toast } = useToast();
  
  // Função para carregar dados da API
  const loadData = async (forcaRecarga = false, page = 1) => {
    try {
      console.log(`[Orulo] Carregando dados - página ${page}`);
      setLoading(true);
      setErro(null);
      
      const response = await fetch(`/api/orulo?all=true&page=${page}`, {
        cache: forcaRecarga ? 'no-store' : 'default',
        headers: {
          'Cache-Control': forcaRecarga ? 'no-cache' : 'default',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Erro retornado pela API: ${data.error} - ${data.message || ''}`);
      }
      
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Formato de dados inesperado na resposta da API');
      }
      
      console.log(`[Orulo] Total de imóveis recebidos: ${data.results.length}`);
      console.log(`[Orulo] Total geral: ${data.count}, Páginas: ${data.total_pages}`);
      
      setImoveis(data.results);
      setTotal(data.count || data.results.length);
      setTotalPages(data.total_pages || 1);
    } catch (error: any) {
      const mensagemErro = `Erro ao carregar dados: ${error.message || 'Erro desconhecido'}`;
      console.error(`[Orulo] ${mensagemErro}`);
      setErro(mensagemErro);
      setImoveis([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar dados ao montar o componente ou mudar de página
  useEffect(() => {
    loadData(false, currentPage);
  }, [currentPage]);
  
  // Função para recarregar os dados
  const handleReload = () => {
    loadData(true, currentPage);
  };
  
  // Função para abrir o modal de detalhes
  const handleOpenModal = (imovel: OruloBuilding) => {
    setSelectedImovel(imovel);
    setIsModalOpen(true);
  };
  
  // Função para salvar os metadados
  const handleSaveMetadata = () => {
    toast({
      title: "Metadados atualizados",
      description: "As informações do imóvel foram atualizadas com sucesso",
    });
  };
  
  // Renderiza uma paginação simples
  const renderPagination = () => {
    const maxVisiblePages = 5;
    let pages = [];
    
    // Determinar quais páginas mostrar
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajustar se estiver perto do final
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Botão anterior
    pages.push(
      <Button
        key="prev"
        variant="outline"
        size="icon"
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );
    
    // Primeira página
    if (startPage > 1) {
      pages.push(
        <Button
          key="1"
          variant={currentPage === 1 ? "default" : "outline"}
          size="icon"
          onClick={() => setCurrentPage(1)}
          className="h-8 w-8"
        >
          1
        </Button>
      );
      
      // Ellipsis
      if (startPage > 2) {
        pages.push(
          <Button key="ellipsis1" variant="outline" size="icon" disabled className="h-8 w-8">
            ...
          </Button>
        );
      }
    }
    
    // Páginas do meio
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="icon"
          onClick={() => setCurrentPage(i)}
          className="h-8 w-8"
        >
          {i}
        </Button>
      );
    }
    
    // Última página
    if (endPage < totalPages) {
      // Ellipsis
      if (endPage < totalPages - 1) {
        pages.push(
          <Button key="ellipsis2" variant="outline" size="icon" disabled className="h-8 w-8">
            ...
          </Button>
        );
      }
      
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="icon"
          onClick={() => setCurrentPage(totalPages)}
          className="h-8 w-8"
        >
          {totalPages}
        </Button>
      );
    }
    
    // Botão próximo
    pages.push(
      <Button
        key="next"
        variant="outline"
        size="icon"
        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );
    
    return pages;
  };

  return (
    <DashboardLayout>
      <div className="container px-4 py-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Imóveis da Orulo</h1>
          <Button 
            onClick={handleReload} 
            className="gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Atualizar
          </Button>
        </div>
        
        {/* Status loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-primary mb-6">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Carregando imóveis...</span>
          </div>
        )}
        
        {/* Exibir erro se houver */}
        {erro && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-1">Erro ao carregar imóveis</h3>
            <p>{erro}</p>
            <Button 
              variant="outline" 
              className="mt-3 text-destructive" 
              onClick={() => loadData(true)}
            >
              Tentar novamente
            </Button>
          </div>
        )}
        
        {/* Contador de resultados */}
        {!loading && !erro && (
          <div className="text-muted-foreground text-sm mb-6">
            Mostrando {imoveis.length} imóveis encontrados
          </div>
        )}
        
        {/* Lista de imóveis ou mensagem vazia */}
        {!loading && !erro && imoveis.length === 0 ? (
          <EmptyStateImoveis 
            mensagem="Nenhum imóvel encontrado" 
            onReload={handleReload} 
          />
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.05 }
              },
              hidden: {}
            }}
          >
            {loading ? (
              <>
                {skeletonArray.map((_, index) => (
                  <Skeleton key={index} className="h-[350px] w-full rounded-xl" />
                ))}
              </>
            ) : (
              <>
                {imoveis.map((imovel) => (
                  <motion.div
                    key={imovel.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <Card className="overflow-hidden flex flex-col h-full">
                      <div className="h-48 bg-gray-200 relative">
                        {getImageUrl(imovel.default_image) ? (
                          <img 
                            src={getImageUrl(imovel.default_image) as string} 
                            alt={imovel.name || 'Imóvel'} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Em caso de erro, substituir o elemento img por uma div
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const placeholder = document.createElement('div');
                                placeholder.className = 'w-full h-full flex items-center justify-center bg-gray-200';
                                placeholder.innerHTML = '<span class="text-gray-400">Imagem indisponível</span>';
                                parent.replaceChild(placeholder, e.currentTarget);
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400">Sem imagem</span>
                          </div>
                        )}
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-2">{imovel.name || 'Imóvel sem nome'}</CardTitle>
                        <CardDescription>
                          {imovel.address ? (
                            (() => {
                              const address = getAddressInfo(imovel.address);
                              return (
                                <>
                                  {address.city}{address.city && address.state ? ' - ' : ''}
                                  {address.state}
                                  {address.neighborhood && (
                                    <span className="block">{address.neighborhood}</span>
                                  )}
                                </>
                              );
                            })()
                          ) : (
                            'Localização não informada'
                          )}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pb-2 flex-grow">
                        <div className="mb-2">
                          <p className="text-2xl font-bold text-primary">
                            {imovel.min_price ? formatarPreco(imovel.min_price) : 'Preço não informado'}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {imovel.min_area && (
                            <div>
                              <span className="font-semibold">Área:</span> {imovel.min_area}m²
                              {imovel.max_area && imovel.max_area !== imovel.min_area && ` até ${imovel.max_area}m²`}
                            </div>
                          )}
                          
                          {imovel.min_bedrooms && (
                            <div>
                              <span className="font-semibold">Quartos:</span> {imovel.min_bedrooms}
                              {imovel.max_bedrooms && imovel.max_bedrooms !== imovel.min_bedrooms && ` a ${imovel.max_bedrooms}`}
                            </div>
                          )}
                          
                          {imovel.status && (
                            <div className="col-span-2">
                              <span className="font-semibold">Status:</span> {imovel.status}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => handleOpenModal(imovel)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        )}
        
        {/* Paginação */}
        {!loading && !erro && imoveis.length > 0 && (
          <div className="mt-8 flex flex-col items-center space-y-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {imoveis.length} de {total} imóveis - Página {currentPage} de {totalPages}
            </div>
            
            <div className="flex items-center justify-center gap-2">
              {renderPagination()}
            </div>
          </div>
        )}
        
        {/* Modal de detalhes */}
        <ImovelOruloModal 
          imovel={selectedImovel} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMetadata}
        />
      </div>
    </DashboardLayout>
  );
}