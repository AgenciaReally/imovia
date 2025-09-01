"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { MapPin, Bed, Bath, Square, Car, Calendar, Eye, ExternalLink } from 'lucide-react'
import { OruloBuilding } from '@/app/api/orulo/route'
import { formatCurrency } from '@/lib/formatters'

interface ImovelCardOruloProps {
  imovel: OruloBuilding
}

export function ImovelCardOrulo({ imovel }: ImovelCardOruloProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  
  // Manipular endereço que pode ser objeto ou string
  const enderecoFormatado = () => {
    if (typeof imovel.address === 'string') {
      return imovel.address
    } else if (imovel.address) {
      return `${imovel.address.neighborhood}, ${imovel.address.city} - ${imovel.address.state}`
    } else if (imovel.neighborhood || imovel.city) {
      return `${imovel.neighborhood || ''}, ${imovel.city || ''} ${imovel.state ? `- ${imovel.state}` : ''}`
    }
    return 'Endereço não disponível'
  }
  
  // Pegar a imagem atual
  // Processar imagens que podem vir em diferentes formatos
  const getImageUrl = () => {
    // Se temos um array de imagens
    if (Array.isArray(imovel.images) && imovel.images.length > 0) {
      const currentImg = imovel.images[currentImageIndex];
      // Imagem pode ser um objeto com url ou uma string
      return typeof currentImg === 'object' && currentImg.url ? currentImg.url : 
             typeof currentImg === 'string' ? currentImg : '/placeholder-imovel.jpg';
    }
    // Se temos default_image como objeto com urls em diferentes tamanhos
    else if (imovel.default_image && typeof imovel.default_image === 'object') {
      // Tentar diferentes propriedades de tamanho que podem existir
      const sizes = ['1024x1024', 'large', '520x280', 'featured_modern_without_watermark', '200x140', 'thumb'];
      for (const size of sizes) {
        if (imovel.default_image[size]) return imovel.default_image[size];
      }
      return '/placeholder-imovel.jpg';
    }
    // Se default_image é uma string direta
    else if (typeof imovel.default_image === 'string') {
      return imovel.default_image;
    }
    
    return '/placeholder-imovel.jpg';
  };
  
  const currentImage = getImageUrl()
  
  // Determinar o status do imóvel
  let statusColor = 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
  if (imovel.status?.toLowerCase().includes('lançamento')) {
    statusColor = 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
  } else if (imovel.status?.toLowerCase().includes('pronto')) {
    statusColor = 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  } else if (imovel.status?.toLowerCase().includes('obra')) {
    statusColor = 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
  }
  
  // Formatar preço como faixa
  const precoFormatado = () => {
    if (imovel.price_from && imovel.price_to) {
      return `${formatCurrency(imovel.price_from)} - ${formatCurrency(imovel.price_to)}`
    } else if (imovel.price_from || imovel.min_price) {
      return `A partir de ${formatCurrency(imovel.price_from || imovel.min_price || 0)}`
    }
    return 'Consulte'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 } 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full"
    >
      <Card className="overflow-hidden border-0 shadow-md h-full flex flex-col">
        {/* Badge Orulo */}
        <div className="absolute top-3 right-3 z-10">
          <Badge 
            variant="outline" 
            className="bg-blue-50/90 text-blue-700 dark:bg-blue-900/80 dark:text-blue-300 backdrop-blur-sm"
          >
            Orulo
          </Badge>
        </div>
        
        {/* Galeria de imagens */}
        <div className="relative h-52 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/20 z-10"></div>
          
          <Image
            src={currentImage}
            alt={imovel.name}
            className="object-cover transition-transform duration-300 w-full h-full"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            width={400}
            height={225}
            priority={false}
          />
          
          {/* Navegação da galeria */}
          {Array.isArray(imovel.images) && imovel.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
              {imovel.images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/80"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(index)
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Badge de status */}
          {imovel.status && (
            <div className="absolute top-3 left-3 z-10">
              <Badge 
                className={cn(
                  "font-medium",
                  statusColor
                )}
              >
                {imovel.status}
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4 flex flex-col flex-grow">
          {/* Título e endereço */}
          <div className="mb-2 flex-grow">
            <h3 className="font-semibold text-base line-clamp-2">{imovel.name}</h3>
            <div className="flex items-center text-muted-foreground mt-1 text-sm">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">{enderecoFormatado()}</span>
            </div>
          </div>
          
          {/* Preço */}
          <div className="my-2">
            <div className="text-sm text-muted-foreground">Preço</div>
            <div className="font-bold text-base text-primary">
              {precoFormatado()}
            </div>
          </div>
          
          {/* Características */}
          <div className="grid grid-cols-4 gap-2 py-3 border-t border-b my-2">
            <div className="flex flex-col items-center">
              <Bed className="h-4 w-4 text-muted-foreground mb-1" />
              <span className="text-xs text-center">
                {imovel.min_bedrooms || imovel.max_bedrooms 
                  ? `${imovel.min_bedrooms || '0'}-${imovel.max_bedrooms || '0'}`
                  : '-'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Bath className="h-4 w-4 text-muted-foreground mb-1" />
              <span className="text-xs text-center">
                {imovel.min_bathrooms || imovel.max_bathrooms 
                  ? `${imovel.min_bathrooms || '0'}-${imovel.max_bathrooms || '0'}`
                  : '-'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Car className="h-4 w-4 text-muted-foreground mb-1" />
              <span className="text-xs text-center">
                {imovel.min_parking || imovel.max_parking 
                  ? `${imovel.min_parking || '0'}-${imovel.max_parking || '0'}`
                  : '-'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Square className="h-4 w-4 text-muted-foreground mb-1" />
              <span className="text-xs text-center">
                {imovel.min_area || imovel.max_area 
                  ? `${imovel.min_area || '0'}-${imovel.max_area || '0'}m²`
                  : '-'}
              </span>
            </div>
          </div>
          
          {/* Construtora */}
          {imovel.developer && (
            <div className="mb-3 text-xs">
              <span className="text-muted-foreground">Construtora: </span>
              <span className="font-medium">{imovel.developer.name}</span>
            </div>
          )}
          
          {/* Botões de ação */}
          <div className="mt-auto space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href={imovel.orulo_url || `https://www.orulo.com.br/imovel/${imovel.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button 
                      variant="default" 
                      size="sm"
                      className="w-full flex gap-2 items-center"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Ver na Orulo</span>
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  Abrir na plataforma Orulo
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex gap-2 items-center" 
              onClick={() => window.open(`/painel/admin/imoveis/${imovel.id}`, "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Mais Detalhes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
