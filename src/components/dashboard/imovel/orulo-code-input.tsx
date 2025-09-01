"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface OruloCodeInputProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function OruloCodeInput({ open, onClose, onSuccess }: OruloCodeInputProps) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({
        title: "Código é obrigatório",
        description: "Por favor insira o código de autorização da Orulo",
        variant: "destructive"
      })
      return
    }
    
    setLoading(true)
    
    try {
      // Enviar o código para a API
      const response = await fetch('/api/orulo/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code }),
      })
      
      if (!response.ok) {
        throw new Error("Falha ao trocar código por token")
      }
      
      const data = await response.json()
      
      toast({
        title: "Autenticação concluída",
        description: "Código de autorização validado com sucesso!"
      })
      
      onSuccess()
      onClose()
      
    } catch (error) {
      console.error("Erro ao processar código:", error)
      toast({
        title: "Erro na autenticação",
        description: error instanceof Error ? error.message : "Não foi possível validar o código",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inserir código de autorização</DialogTitle>
          <DialogDescription>
            Cole o código de autorização que você recebeu após fazer login na Orulo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Cole o código aqui..."
            className="w-full font-mono"
          />
          
          <div className="mt-4 text-sm bg-amber-50 border border-amber-200 p-3 rounded-md">
            <p className="font-medium text-amber-800">Como obter o código:</p>
            <ol className="mt-2 text-amber-700 space-y-1 pl-5 list-decimal">
              <li>Vá para <a href="https://www.orulo.com.br/oauth/authorize?client_id=NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code&scope=public" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">orulo.com.br</a> e faça login</li>
              <li>Após o login, você verá uma tela com um código de autorização</li>
              <li>Copie esse código e cole-o no campo acima</li>
            </ol>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : "Validar código"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
