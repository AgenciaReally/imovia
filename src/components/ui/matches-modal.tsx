"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Ruler, 
  Bed, 
  Bath, 
  Car, 
  Star,
  TrendingUp,
  Brain,
  Heart,
  X,
  ExternalLink
} from "lucide-react"

interface ImovelMatch {
  id: string
  titulo: string
  descricao?: string
  preco: number
  area?: number
  quartos?: number
  banheiros?: number
  vagas?: number
  endereco?: string
  cidade?: string
  bairro?: string
  imagem?: string
  construtora?: string
  score: number // 0-100
  insights: string[]
  razoesCombinou: string[]
  pontosFracos?: string[]
}

interface MatchesModalProps {
  isOpen: boolean
  onClose: () => void
  matches: ImovelMatch[]
  loading?: boolean
  totalAnalizado: number
}

export function MatchesModal({ 
  isOpen, 
  onClose, 
  matches, 
  loading = false,
  totalAnalizado 
}: MatchesModalProps) {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-200"
    if (score >= 55) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-gray-600 bg-gray-50 border-gray-200"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excelente Match"
    if (score >= 70) return "Bom Match"
    if (score >= 55) return "Match Razoável"
    return "Match Fraco"
  }

  const formatPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(preco)
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <Brain className="h-12 w-12 text-orange-500" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Analisando Compatibilidade</h3>
            <p className="text-gray-600 text-center mb-4">
              Nossa IA está comparando suas respostas com {totalAnalizado} imóveis disponíveis...
            </p>
            <Progress value={75} className="w-64" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Home className="h-5 w-5 text-orange-500" />
                iMovia - Encontre seu imóvel ideal
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {matches.length} imóveis compatíveis encontrados de {totalAnalizado} analisados
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              IA Deepseek
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum match encontrado
              </h3>
              <p className="text-gray-600">
                Não encontramos imóveis que correspondam às suas preferências no momento.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {matches.map((imovel, index) => (
                <motion.div
                  key={imovel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{imovel.titulo}</CardTitle>
                          {imovel.endereco && (
                            <CardDescription className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3" />
                              {imovel.endereco}
                              {imovel.bairro && `, ${imovel.bairro}`}
                              {imovel.cidade && ` - ${imovel.cidade}`}
                            </CardDescription>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getScoreColor(imovel.score)}`}>
                            {imovel.score}% Match
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {getScoreLabel(imovel.score)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Informações básicas */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium">{formatPreco(imovel.preco)}</span>
                        </div>
                        {imovel.area && (
                          <div className="flex items-center gap-1">
                            <Ruler className="h-4 w-4" />
                            <span>{imovel.area}m²</span>
                          </div>
                        )}
                        {imovel.quartos && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{imovel.quartos} {imovel.quartos > 1 ? 'quartos' : 'quarto'}</span>
                          </div>
                        )}
                        {imovel.banheiros && (
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{imovel.banheiros} {imovel.banheiros > 1 ? 'banheiros' : 'banheiro'}</span>
                          </div>
                        )}
                        {imovel.vagas && (
                          <div className="flex items-center gap-1">
                            <Car className="h-4 w-4" />
                            <span>{imovel.vagas} {imovel.vagas > 1 ? 'vagas' : 'vaga'}</span>
                          </div>
                        )}
                      </div>

                      {/* Por que combinou */}
                      {imovel.razoesCombinou.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                            <Heart className="h-4 w-4 text-red-500" />
                            Por que combinou com você:
                          </h4>
                          <div className="space-y-1">
                            {imovel.razoesCombinou.map((razao, idx) => (
                              <div key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                <span>{razao}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Insights da IA */}
                      {imovel.insights.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                            <Brain className="h-4 w-4 text-purple-500" />
                            Insights da IA:
                          </h4>
                          <div className="space-y-1">
                            {imovel.insights.map((insight, idx) => (
                              <div key={idx} className="text-sm text-gray-700 bg-purple-50 px-2 py-1 rounded text-xs">
                                {insight}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pontos fracos */}
                      {imovel.pontosFracos && imovel.pontosFracos.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                            Pontos de atenção:
                          </h4>
                          <div className="space-y-1">
                            {imovel.pontosFracos.map((ponto, idx) => (
                              <div key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                <span>{ponto}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        {imovel.construtora && (
                          <span className="text-xs text-gray-500">
                            Por {imovel.construtora}
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            Tenho Interesse
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            Análise realizada por IA • Resultados atualizados em tempo real
          </div>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
