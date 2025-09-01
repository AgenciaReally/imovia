'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OruloBuilding } from '@/types/orulo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { formatarPreco } from '@/utils/format';
import { InputMask } from '@react-input/mask';

// Schema para validação do formulário de metadados
const metadataSchema = z.object({
  telefone: z.string().min(14, 'Telefone deve estar completo'),
  observacoes: z.string().optional(),
  construtoraId: z.string().optional(),
});

type FormValues = z.infer<typeof metadataSchema>;

// Interface para o tipo Construtora
interface Construtora {
  id: string;
  nome: string;
}

// Interface para os metadados do imóvel
interface ImovelMetadata {
  id?: string;
  imovelIdExterno: string;
  telefone: string;
  observacoes: string;
  construtoraId?: string;
  construtora?: {
    id: string;
    nome: string;
  };
}

interface ImovelOruloModalProps {
  imovel: OruloBuilding | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (metadata: ImovelMetadata) => void;
}

export function ImovelOruloModal({ imovel, isOpen, onClose, onSave }: ImovelOruloModalProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [isSaving, setIsSaving] = useState(false);
  const [metadata, setMetadata] = useState<ImovelMetadata | null>(null);
  const [construtoras, setConstrutoras] = useState<Construtora[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);

  // Formulário de metadados
  const form = useForm<FormValues>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      telefone: '',
      observacoes: '',
      construtoraId: '',
    },
  });

  // Buscar construtoras
  useEffect(() => {
    const fetchConstrutoras = async () => {
      try {
        const response = await fetch('/api/construtoras');
        if (response.ok) {
          const data = await response.json();
          // Usar o formato correto da resposta (campo construtoras)
          if (data.construtoras && Array.isArray(data.construtoras)) {
            setConstrutoras(data.construtoras);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar construtoras:', error);
      }
    };
    
    fetchConstrutoras();
  }, []);

  // Buscar metadados quando o modal abrir
  useEffect(() => {
    if (isOpen && imovel?.id) {
      // Reiniciar para a aba de informações sempre que o modal abrir
      setActiveTab('info');
      setMetadataError(null);
      
      const fetchMetadata = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/imoveis-metadata?imovelIdExterno=${imovel.id}`);
          if (response.ok) {
            const data = await response.json();
            setMetadata(data);
            
            // Preencher o formulário com os dados existentes
            form.reset({
              telefone: data?.telefone || '',
              observacoes: data?.observacoes || '',
              construtoraId: data?.construtoraId || '',
            });
          }
        } catch (error) {
          console.error('Erro ao carregar metadados:', error);
          setMetadataError('Não foi possível carregar os metadados do imóvel');
        } finally {
          setIsLoading(false);
        }
      };

      fetchMetadata();
    }
  }, [isOpen, imovel?.id, form]);

  // Se não tiver imóvel, não exibir o modal
  if (!imovel) return null;

  // Função para salvar os metadados
  const onSubmit = async (values: FormValues) => {
    if (!imovel) return;

    setIsSaving(true);
    try {
      const payload = {
        ...(metadata?.id ? { id: metadata.id } : {}),
        imovelIdExterno: imovel.id,
        telefone: values.telefone,
        observacoes: values.observacoes || '',
        construtoraId: values.construtoraId === 'null' ? null : values.construtoraId,
      };

      const response = await fetch('/api/imoveis-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const savedData = await response.json();
        setMetadata(savedData);
        toast.success('Metadados salvos com sucesso!');
        
        // Chamar callback de salvamento se existir
        if (onSave) {
          onSave(savedData);
        }
        
        // Voltar para a aba de informações
        setActiveTab('info');
      } else {
        toast.error('Erro ao salvar metadados');
      }
    } catch (error) {
      console.error('Erro ao salvar metadados:', error);
      toast.error('Erro ao salvar metadados');
    } finally {
      setIsSaving(false);
    }
  };

  // Formatar características do imóvel de forma segura
  const formatarCaracteristicas = () => {
    try {
      if (!imovel.features) return 'Nenhuma característica informada';
      
      // Verificar se features é um array
      if (!Array.isArray(imovel.features)) {
        // Se for uma string, retornar como está
        if (typeof imovel.features === 'string') return imovel.features;
        
        // Se for um objeto com name, pode ser um array de objetos com propriedade name
        if (imovel.building_features && Array.isArray(imovel.building_features)) {
          return imovel.building_features.map((f: any) => f.name || '').filter(Boolean).join(', ') || 'Nenhuma característica informada';
        }
        
        return 'Nenhuma característica informada';
      }
      
      // Se é um array vazio
      if (imovel.features.length === 0) return 'Nenhuma característica informada';
      
      // Se é um array de strings
      return imovel.features.join(', ');
    } catch (error) {
      console.error('Erro ao formatar características:', error);
      return 'Nenhuma característica informada';
    }
  };

  // Obter endereço formatado de forma segura
  const endereco = (() => {
    try {
      if (!imovel.address) return 'Endereço não disponível';
      
      // Garantir que estamos tratando um objeto e não uma string
      if (typeof imovel.address === 'string') return imovel.address;
      
      // Compor o endereço com valores seguros
      return `${imovel.address.street_type || ''} ${imovel.address.street || ''}, ${imovel.address.number || ''} ${imovel.address.area ? `- ${imovel.address.area}` : ''}, ${imovel.address.city || ''} ${imovel.address.state ? `- ${imovel.address.state}` : ''}`;
    } catch (error) {
      console.error('Erro ao formatar endereço:', error);
      return 'Endereço não disponível';
    }
  })();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{imovel.name || `Imóvel ${imovel.id}`}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="editar">Editar Metadados</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 pt-4">
            {/* Imagem principal */}
            <div className="mb-4 h-[300px] rounded-lg overflow-hidden bg-gray-100">
              {(() => {
                try {
                  if (!imovel.default_image) {
                    return (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">Imagem não disponível</span>
                      </div>
                    );
                  }
                  
                  // Verificar se default_image é um objeto com URLs
                  if (typeof imovel.default_image === 'object') {
                    const imageUrl = imovel.default_image['1024x1024'] || 
                                    imovel.default_image['520x280'] || 
                                    (typeof imovel.default_image === 'string' ? imovel.default_image : null);
                    
                    if (imageUrl) {
                      return (
                        <img
                          src={imageUrl}
                          alt={imovel.name || 'Imóvel'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '';
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><span class="text-gray-400">Erro ao carregar imagem</span></div>';
                          }}
                        />
                      );
                    }
                  }
                  
                  // Fallback
                  return (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">Imagem não disponível</span>
                    </div>
                  );
                } catch (error) {
                  console.error('Erro ao renderizar imagem:', error);
                  return (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">Erro ao carregar imagem</span>
                    </div>
                  );
                }
              })()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Detalhes do Imóvel</h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Preço: </span>
                    <span>
                      {(() => {
                        try {
                          return imovel.min_price ? formatarPreco(imovel.min_price) : 'Não informado';
                        } catch (error) {
                          return 'Não informado';
                        }
                      })()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Área: </span>
                    <span>
                      {(() => {
                        try {
                          const minArea = imovel.min_area;
                          const maxArea = imovel.max_area;
                          
                          if (!minArea) return 'Não informada';
                          
                          let areaText = `${minArea}m²`;
                          if (maxArea && maxArea !== minArea) {
                            areaText += ` até ${maxArea}m²`;
                          }
                          
                          return areaText;
                        } catch (error) {
                          return 'Não informada';
                        }
                      })()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Quartos: </span>
                    <span>
                      {(() => {
                        try {
                          const minBedrooms = imovel.min_bedrooms;
                          const maxBedrooms = imovel.max_bedrooms;
                          
                          if (!minBedrooms && minBedrooms !== 0) return 'Não informado';
                          
                          let bedroomsText = `${minBedrooms}`;
                          if (maxBedrooms && maxBedrooms !== minBedrooms) {
                            bedroomsText += ` a ${maxBedrooms}`;
                          }
                          
                          return bedroomsText;
                        } catch (error) {
                          return 'Não informado';
                        }
                      })()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Banheiros: </span>
                    <span>
                      {(() => {
                        try {
                          const minBathrooms = imovel.min_bathrooms;
                          const maxBathrooms = imovel.max_bathrooms;
                          
                          if (!minBathrooms && minBathrooms !== 0) return 'Não informado';
                          
                          let bathroomsText = `${minBathrooms}`;
                          if (maxBathrooms && maxBathrooms !== minBathrooms) {
                            bathroomsText += ` a ${maxBathrooms}`;
                          }
                          
                          return bathroomsText;
                        } catch (error) {
                          return 'Não informado';
                        }
                      })()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Vagas: </span>
                    <span>
                      {(() => {
                        try {
                          const minParking = imovel.min_parking;
                          const maxParking = imovel.max_parking;
                          
                          if (!minParking && minParking !== 0) return 'Não informado';
                          
                          let parkingText = `${minParking}`;
                          if (maxParking && maxParking !== minParking) {
                            parkingText += ` a ${maxParking}`;
                          }
                          
                          return parkingText;
                        } catch (error) {
                          return 'Não informado';
                        }
                      })()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Status: </span>
                    <span>{imovel.status || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Tipo: </span>
                    <span>{imovel.type || 'Não informado'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Informações Adicionais</h3>
                
                {metadata && (
                  <div className="mb-6 p-4 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Metadados</h4>
                    <div className="space-y-1 text-sm">
                      {metadata.telefone && (
                        <div>
                          <span className="font-medium">Telefone: </span>
                          <span>{metadata.telefone}</span>
                        </div>
                      )}
                      {metadata.construtora && (
                        <div>
                          <span className="font-medium">Construtora: </span>
                          <span>{metadata.construtora.nome}</span>
                        </div>
                      )}
                      {metadata.observacoes && (
                        <div>
                          <span className="font-medium">Observações: </span>
                          <span>{metadata.observacoes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <h3 className="text-lg font-semibold mb-2">Endereço</h3>
                <p className="mb-4">{endereco}</p>

                <h3 className="text-lg font-semibold mb-2 mt-4">Descrição</h3>
                <p className="text-sm text-muted-foreground">{imovel.description || 'Sem descrição disponível'}</p>

                <h3 className="text-lg font-semibold mb-2 mt-4">Características</h3>
                <p className="text-sm text-muted-foreground">{formatarCaracteristicas()}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="editar" className="pt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <p>Carregando dados...</p>
              </div>
            ) : metadataError ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-md">
                <p>{metadataError}</p>
                <Button 
                  onClick={() => setActiveTab('info')} 
                  variant="outline" 
                  className="mt-4"
                >
                  Voltar para informações
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone de contato</FormLabel>
                        <FormControl>
                          <InputMask
                            component={Input}
                            mask="(99) 99999-9999"
                            replacement={{ 9: /[0-9]/ }}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="(99) 99999-9999"
                          />
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
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma construtora" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="null">Nenhuma</SelectItem>
                            {construtoras.map((construtora) => (
                              <SelectItem key={construtora.id} value={construtora.id}>
                                {construtora.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações adicionais sobre o imóvel"
                            className="resize-none h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab('info')}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSaving}
                    >
                      {isSaving ? 'Salvando...' : 'Salvar alterações'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
