"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ImovelDisplay } from '@/services/imovel-service'
import { 
  Home, 
  MapPin, 
  Ruler, 
  BedDouble, 
  Bath, 
  Car, 
  Building, 
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ImovelDialogDetalhes } from './imovel-dialog-detalhes'
import { ImovelFormModal } from './imovel-form-modal'

// Formatador de números para moeda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

interface ImovelCardProps {
  imovel: ImovelDisplay
  className?: string
  onDelete?: (id: string) => void
  onToggleStatus?: (id: string, currentStatus: boolean) => void
}

export function ImovelCard({ imovel, className, onDelete, onToggleStatus }: ImovelCardProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false)
  
  // Define a imagem para exibição: Usar a foto principal primeiro
  // Se não houver foto principal, usar a primeira da galeria
  // Se não houver nenhuma, usar um placeholder
  const imageSrc = imovel.fotoPrincipal && imovel.fotoPrincipal.trim() !== ''
    ? imovel.fotoPrincipal
    : (imovel.imagens && 
       imovel.imagens.length > 0 && 
       imovel.imagens[currentImage] && 
       typeof imovel.imagens[currentImage] === 'string' && 
       imovel.imagens[currentImage].trim() !== ''
       ? imovel.imagens[currentImage]
       : `https://picsum.photos/seed/${imovel.id}/800/600`)

  // Indicadores de status com cores
  const statusColors: Record<string, string> = {
    'Disponível': 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800',
    'Vendido': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    'Reservado': 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    'Em obras': 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    'Lançamento': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    'Pronto para morar': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
  }
  
  const statusColor = statusColors[imovel.status] || 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800'
  
  // Avança para a próxima imagem
  const nextImage = () => {
    if (imovel.imagens && imovel.imagens.length > 0) {
      setCurrentImage((prev) => (prev + 1) % imovel.imagens.length)
    }
  }
  
  // Retorna para a imagem anterior
  const prevImage = () => {
    if (imovel.imagens && imovel.imagens.length > 0) {
      setCurrentImage((prev) => (prev - 1 + imovel.imagens.length) % imovel.imagens.length)
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn("h-full", className)}
    >
      <Card className="overflow-hidden h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Imagem do imóvel com navegação */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageSrc}
            alt={imovel.titulo}
            className="object-cover transition-transform duration-500"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
            fill
          />
          
          {/* Overlay de gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Badge de status */}
          <Badge 
            className={cn(
              "absolute top-2 right-2 uppercase text-xs font-semibold px-2.5 py-1 rounded border", 
              statusColor
            )}
          >
            {imovel.status}
          </Badge>
          
          {/* Preço */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
            <h3 className="text-white font-bold text-lg truncate shadow-text">
              {formatCurrency(imovel.preco)}
            </h3>
            
            {imovel.imagens && imovel.imagens.length > 1 && (
              <div className="flex gap-1">
                <Button 
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full bg-black/40 text-white hover:bg-black/60"
                  onClick={(e) => { e.preventDefault(); prevImage(); }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full bg-black/40 text-white hover:bg-black/60"
                  onClick={(e) => { e.preventDefault(); nextImage(); }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Faixa da construtora */}
          <div className="absolute top-2 left-0 bg-primary text-primary-foreground text-xs font-medium py-1 px-2 shadow-md">
            <Link href={`/painel/admin/construtoras/${imovel.construtoraId}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                <span className="truncate max-w-[120px]">{imovel.construtora}</span>
              </div>
            </Link>
          </div>
        </div>
          
        <CardContent className="p-4">
          {/* Título e localização */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg leading-tight line-clamp-1">{imovel.titulo}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">{imovel.endereco || `${imovel.bairro}, ${imovel.cidade}`}</span>
            </div>
          </div>
          
          {/* Características em grid */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-3 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-blue-50 dark:bg-blue-900/20">
                <Ruler className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <span>{imovel.area} m²</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-900/20">
                <BedDouble className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span>{imovel.quartos} {imovel.quartos === 1 ? 'quarto' : 'quartos'}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-violet-50 dark:bg-violet-900/20">
                <Bath className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              </div>
              <span>{imovel.banheiros} {imovel.banheiros === 1 ? 'banheiro' : 'banheiros'}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-pink-50 dark:bg-pink-900/20">
                <Car className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
              </div>
              <span>{imovel.vagas} {imovel.vagas === 1 ? 'vaga' : 'vagas'}</span>
            </div>
          </div>
          
          {/* Status de ativo/inativo e ações */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-muted-foreground">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 text-xs px-2 ${imovel.ativo !== false ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleStatus) {
                    // Passar o status atual para a função de toggle
                    onToggleStatus(imovel.id, imovel.ativo !== false);
                  }
                }}
              >
                {imovel.ativo !== false ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    <span>Ativo</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5 text-red-600" />
                    <span>Inativo</span>
                  </>
                )}
              </Button>
            </div>
            
            {/* Botões de ação */}
            <div className="space-y-2 mt-auto">
              <div className="flex gap-1">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1 text-xs gap-2"
                  onClick={() => setModalEdicaoAberto(true)}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Editar Imóvel
                </Button>
                
                {onDelete && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Tem certeza que deseja excluir o imóvel ${imovel.titulo}?`)) {
                        onDelete(imovel.id);
                      }
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog de detalhes do imóvel */}
      <ImovelDialogDetalhes 
        imovel={imovel}
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
      />
      
      {/* Modal para edição do imóvel */}
      {modalEdicaoAberto && (
        <ImovelFormModal 
          imovel={imovel} 
          onSuccess={() => {
            setModalEdicaoAberto(false);
            if (onToggleStatus) {
              // Atualizar a listagem de imóveis
              onToggleStatus(imovel.id, imovel.ativo !== false);
            }
          }}
        />
      )}
    </motion.div>
  )
}
