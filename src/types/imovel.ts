// Interface compartilhada para os imóveis do sistema
export interface ImovelBase {
  id: string;
  idExterno?: string | null;
  titulo: string;
  descricao?: string;
  preco: number;
  area?: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  imagens?: string[];
  fotos?: string[];
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
  fotoPrincipal?: string;
  construtora?: string;
  construtoraId?: string;
  thumbnail?: string;
  tipoImovel?: string;
  tipoImovelId?: string;
  status?: string;
  dataAtualizacao?: string;
  telefoneContato?: string;
  matchPercentage?: number;
  dentroOrcamento?: boolean;
  destaque?: boolean;
  destacado?: boolean;
  indisponivel?: boolean;
  ativo?: boolean;
  caracteristicas?: {
    quartos?: number;
    banheiros?: number;
    area?: number;
    vagas?: number;
  };
}

// Interface específica para os pins do mapa
export interface PinItem extends ImovelBase {
  position: { left: string; top: string };
}

// Re-exportação do tipo ImovelBase como Imovel para compatibilidade
export type Imovel = ImovelBase;
