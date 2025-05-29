// Definições de tipos para a API Orulo
export interface OruloAddress {
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postal_code?: string;
}

export interface OruloImage {
  id?: number;
  url?: string;
  description?: string;
  order?: number;
  [key: string]: any;
}

export interface OruloDefaultImage {
  [size: string]: string;
}

export interface OruloCharacteristic {
  id: number;
  name: string;
  description?: string;
}

export interface OruloBuilding {
  id: number;
  name: string;
  description?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_area?: number;
  max_area?: number;
  address?: OruloAddress | string;
  images?: (OruloImage | string)[];
  default_image?: string | OruloDefaultImage;
  updated_at?: string;
  
  // Propriedades adicionais para exibição
  area_total?: number;
  dormitories?: number;
  bathrooms?: number;
  parking_spots?: number;
  characteristics?: OruloCharacteristic[];
}
