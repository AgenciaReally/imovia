"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  Mail, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Star,
  TrendingUp,
  Heart,
  Building,
  Loader2,
  CheckCircle,
  X,
  Phone
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ImovelMatch {
  id: string
  titulo: string
  preco: number
  matchPercentage: number
  telefoneContato: string
  thumbnail: string
  caracteristicas: {
    quartos: number
    banheiros: number
    area: number
    vagas: number
  }
  endereco?: string
  construtora?: string
  motivos?: string[]
}

interface RelatorioModalProps {
  isOpen: boolean
  onClose: () => void
  imoveis: ImovelMatch[]
  nomeCliente?: string
  emailCliente?: string
  respostas?: any[]
}

export function RelatorioModal({ 
  isOpen, 
  onClose, 
  imoveis, 
  nomeCliente = "Cliente", 
  emailCliente = "",
  respostas = []
}: RelatorioModalProps) {
  const { toast } = useToast()
  const [enviandoEmail, setEnviandoEmail] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState(false)
  const [baixandoRelatorio, setBaixandoRelatorio] = useState(false)

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const enviarPorEmail = async () => {
    setEnviandoEmail(true)
    
    try {
      // Chamar API para enviar relatório por email com dados reais
      const response = await fetch('/api/relatorio/enviar-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailCliente,
          nomeCliente,
          imoveis,
          respostas,
          dataAnalise: new Date().toISOString()
        })
      })

      if (response.ok) {
        setEmailEnviado(true)
        toast({
          title: "📧 Relatório enviado!",
          description: "O relatório personalizado foi enviado para seu email",
        })
      } else {
        throw new Error('Erro ao enviar email')
      }
    } catch (error) {
      toast({
        title: "❌ Erro ao enviar",
        description: "Não foi possível enviar o relatório. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setEnviandoEmail(false)
    }
  }

  const baixarRelatorio = async () => {
    setBaixandoRelatorio(true)
    
    try {
      // Gerar PDF do relatório com dados reais
      const response = await fetch('/api/relatorio/gerar-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nomeCliente,
          imoveis,
          respostas,
          dataAnalise: new Date().toISOString()
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `relatorio-imoveis-${nomeCliente.toLowerCase().replace(/\s/g, '-')}-${new Date().getTime()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        
        toast({
          title: "📁 Download iniciado!",
          description: "O relatório está sendo baixado",
        })
      } else {
        throw new Error('Erro ao gerar PDF')
      }
    } catch (error) {
      toast({
        title: "❌ Erro no download",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setBaixandoRelatorio(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#fe4f17] rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              Relatório Personalizado de Imóveis
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
            <p>Análise gerada em: <span className="font-medium">{dataAtual}</span></p>
            <Badge variant="secondary" className="bg-[#fe4f17]/10 text-[#fe4f17]">
              {imoveis.length} imóveis selecionados
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Header do Cliente */}
            <div className="bg-gradient-to-r from-[#fe4f17]/5 to-orange-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Olá, {nomeCliente}! 👋
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Com base nas suas preferências e necessidades, nossa inteligência artificial 
                analisou centenas de imóveis e selecionou os <strong> 3 melhores matches</strong> 
                 para seu perfil. Cada propriedade foi cuidadosamente avaliada considerando 
                seus critérios específicos.
              </p>
            </div>

            {/* Resumo da Análise */}
            <Card className="p-6 border-l-4 border-l-[#fe4f17]">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#fe4f17]" />
                Resumo da Análise Inteligente
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#fe4f17]">
                    {Math.round(imoveis.reduce((acc, curr) => acc + curr.matchPercentage, 0) / imoveis.length)}%
                  </div>
                  <div className="text-sm text-gray-600">Match Médio</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#fe4f17]">
                    {respostas.length}
                  </div>
                  <div className="text-sm text-gray-600">Critérios Analisados</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#fe4f17]">100%</div>
                  <div className="text-sm text-gray-600">Dados Reais</div>
                </div>
              </div>
            </Card>

            {/* Seção de Imóveis - 3 Mini Cards Clean */}
            <div>
              <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <Building className="w-5 h-5 text-[#fe4f17]" />
                Suas Melhores Opções
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {imoveis.map((imovel, index) => (
                  <motion.div
                    key={imovel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#fe4f17]/30 transition-all duration-300 hover:-translate-y-2">
                      {/* Imagem */}
                      <div className="relative h-40 overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${imovel.thumbnail || '/placeholder-image.jpg'})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2">
                          <div className="bg-[#fe4f17] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            #{index + 1}
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="bg-white/95 backdrop-blur text-[#fe4f17] text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            {imovel.matchPercentage}%
                          </div>
                        </div>
                        
                        {/* Preço */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="text-lg font-bold text-white drop-shadow-lg">
                            {new Intl.NumberFormat('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(imovel.preco)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/90 mt-1">
                            {imovel.caracteristicas?.area && (
                              <div className="flex items-center gap-1">
                                <Square className="w-3 h-3" />
                                <span>{imovel.caracteristicas.area}m²</span>
                              </div>
                            )}
                            {imovel.caracteristicas?.banheiros && (
                              <div className="flex items-center gap-1">
                                <Bath className="w-3 h-3" />
                                <span>{imovel.caracteristicas.banheiros}b</span>
                              </div>
                            )}
                            {imovel.caracteristicas?.vagas && (
                              <div className="flex items-center gap-1">
                                <Car className="w-3 h-3" />
                                <span>{imovel.caracteristicas.vagas}v</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Botão WhatsApp abaixo de cada imóvel */}
                      <div className="p-4">
                        <h4 className="font-bold text-gray-800 mb-1 truncate">{imovel.titulo}</h4>
                        <p className="text-sm text-gray-600 mb-3 truncate">{imovel.construtora}</p>
                        
                        <Button
                          size="sm"
                          className="w-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 gap-2 shadow-lg rounded-full py-3 transition-all duration-200 hover:scale-105"
                          onClick={() => {
                            const detalhes = [
                              `🏠 Título: ${imovel.titulo}`,
                              `🆔 ID: ${imovel.id}`,
                              `💰 Preço: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(imovel.preco)}`,
                              imovel.caracteristicas?.quartos ? `🛏️ Quartos: ${imovel.caracteristicas.quartos}` : '',
                              imovel.caracteristicas?.banheiros ? `🚿 Banheiros: ${imovel.caracteristicas.banheiros}` : '',
                              imovel.caracteristicas?.area ? `📐 Área: ${imovel.caracteristicas.area}m²` : '',
                              imovel.caracteristicas?.vagas ? `🚗 Vagas: ${imovel.caracteristicas.vagas}` : '',
                              imovel.construtora ? `🏢 Construtora: ${imovel.construtora}` : '',
                              imovel.thumbnail ? `📸 Foto: ${imovel.thumbnail}` : ''
                            ].filter(Boolean).join('\n');
                            
                            const mensagem = `Olá, vim através do app iMovia e gostaria de obter mais informações sobre este imóvel:\n\n${detalhes}`;
                            window.open(`https://wa.me/554192223032?text=${encodeURIComponent(mensagem)}`, '_blank');
                          }}
                        >
                          <Phone className="h-4 w-4" />
                          Atendimento direto
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer com botões de ação */}
        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
          <div className="flex gap-3 justify-center">
            <Button
              onClick={enviarPorEmail}
              disabled={enviandoEmail || emailEnviado}
              className="bg-[#fe4f17] hover:bg-[#e63e0f] text-white px-6 rounded-full"
            >
              {enviandoEmail ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : emailEnviado ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              {enviandoEmail 
                ? "Enviando..." 
                : emailEnviado 
                ? "Email Enviado!" 
                : "Enviar por Email"
              }
            </Button>
            
            <Button
              onClick={baixarRelatorio}
              disabled={baixandoRelatorio}
              variant="outline"
              className="border-[#fe4f17] text-[#fe4f17] hover:bg-[#fe4f17]/10 px-6 rounded-full"
            >
              {baixandoRelatorio ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {baixandoRelatorio ? "Baixando..." : "Baixar PDF"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
