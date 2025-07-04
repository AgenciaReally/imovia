"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Loader2, Mail, Phone, Send } from "lucide-react"

// Interface para as propriedades do componente
interface ClienteMensagemProps {
  cliente: {
    id: string
    name: string
    email: string
    telefone?: string
  }
  isOpen: boolean
  onClose: () => void
}

export function ClienteMensagem({ cliente, isOpen, onClose }: ClienteMensagemProps) {
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email")
  const [assunto, setAssunto] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [enviando, setEnviando] = useState(false)
  
  // Gerar as iniciais para o avatar
  const getIniciais = (name: string) => {
    if (!name) return "CL"
    const parts = name.split(" ")
    if (parts.length === 1) return name.substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  
  // Função para enviar a mensagem
  const enviarMensagem = async () => {
    // Validações básicas
    if (activeTab === "email" && !assunto.trim()) {
      toast.error("O assunto é obrigatório para emails")
      return
    }
    
    if (!mensagem.trim()) {
      toast.error("A mensagem não pode estar vazia")
      return
    }
    
    if (enviando) return
    
    try {
      setEnviando(true)
      
      // Preparar dados para envio
      const dadosMensagem = {
        clienteId: cliente.id,
        tipo: activeTab,
        assunto: assunto,
        mensagem: mensagem,
        destinatario: activeTab === "email" ? cliente.email : cliente.telefone
      }
      
      // Enviar para a API
      const response = await fetch("/api/admin/mensagens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosMensagem),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Falha ao enviar mensagem")
      }
      
      // Sucesso
      toast.success(`Mensagem enviada com sucesso para ${cliente.name}`)
      
      // Limpar campos e fechar o modal
      setAssunto("")
      setMensagem("")
      onClose()
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao enviar mensagem")
    } finally {
      setEnviando(false)
    }
  }
  
  // Templates pré-definidos para mensagens
  const templates = [
    {
      titulo: "Boas-vindas",
      assunto: "Bem-vindo à iMovia!",
      mensagem: `Olá ${cliente.name},\n\nSeja bem-vindo à iMovia! Estamos felizes em tê-lo como cliente.\n\nEstamos à disposição para ajudá-lo na busca pelo seu imóvel ideal.\n\nAtenciosamente,\nEquipe iMovia`
    },
    {
      titulo: "Agendamento",
      assunto: "Agendar visita ao imóvel",
      mensagem: `Olá ${cliente.name},\n\nGostaria de agendar uma visita a um dos nossos imóveis? Basta responder este email com algumas datas e horários de sua preferência.\n\nEstamos à disposição.\n\nAtenciosamente,\nEquipe imovia`
    },
    {
      titulo: "Novidades",
      assunto: "Novos imóveis disponíveis!",
      mensagem: `Olá ${cliente.name},\n\nTemos novidades para você! Novos imóveis foram adicionados ao nosso catálogo e acreditamos que possam ser de seu interesse.\n\nAcesse nosso site ou entre em contato para mais informações.\n\nAtenciosamente,\nEquipe imovia`
    }
  ]
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enviar Mensagem</DialogTitle>
          <DialogDescription>
            Envie uma mensagem para o cliente por email ou SMS
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://avatar.vercel.sh/${cliente.email}`} alt={cliente.name} />
            <AvatarFallback>{getIniciais(cliente.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{cliente.name}</h3>
            <p className="text-sm text-muted-foreground">{cliente.email}</p>
          </div>
        </div>
        
        <Tabs defaultValue="email" onValueChange={(value) => setActiveTab(value as "email" | "sms")}>
          <TabsList className="mb-4">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger 
              value="sms" 
              className="flex items-center gap-2"
              disabled={!cliente.telefone}
            >
              <Phone className="h-4 w-4" />
              SMS
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4">
            <div className="grid grid-cols-[1fr_auto] gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="assunto">Assunto</Label>
                  <Input
                    id="assunto"
                    placeholder="Assunto do email"
                    value={assunto}
                    onChange={(e) => setAssunto(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="mensagem-email">Mensagem</Label>
                  <Textarea
                    id="mensagem-email"
                    placeholder="Digite sua mensagem..."
                    className="min-h-[200px]"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-40 border-l pl-4">
                <Label className="mb-2 block">Templates</Label>
                <div className="space-y-2">
                  {templates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setAssunto(template.assunto)
                        setMensagem(template.mensagem)
                      }}
                    >
                      {template.titulo}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sms" className="space-y-4">
            <div>
              <Label htmlFor="mensagem-sms">Mensagem SMS</Label>
              <Textarea
                id="mensagem-sms"
                placeholder="Digite sua mensagem SMS..."
                className="min-h-[100px]"
                maxLength={160}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {mensagem.length}/160 caracteres
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={enviarMensagem} disabled={enviando}>
            {enviando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
