"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

// Interface para as propriedades do componente
interface ClienteDesativarProps {
  cliente: {
    id: string
    name: string
    status?: 'ativo' | 'inativo' | 'pendente'
  }
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  modo?: 'desativar' | 'excluir'
}

export function ClienteDesativar({ 
  cliente, 
  isOpen, 
  onClose, 
  onSuccess,
  modo = 'desativar'
}: ClienteDesativarProps) {
  const [processando, setProcessando] = useState(false)
  
  // Função para desativar ou excluir o cliente
  const confirmarAcao = async () => {
    if (processando) return
    
    try {
      setProcessando(true)
      
      // No modo excluir, usamos DELETE, no modo desativar usamos PATCH
      const method = modo === 'excluir' ? 'DELETE' : 'PATCH'
      const endpoint = `/api/admin/clientes/${cliente.id}`
      
      // Corpo da requisição para desativar
      const body = modo === 'desativar' 
        ? JSON.stringify({ status: 'inativo' }) 
        : undefined
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(body ? { body } : {})
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Falha ao ${modo === 'excluir' ? 'excluir' : 'desativar'} cliente`)
      }
      
      // Sucesso
      toast.success(
        modo === 'excluir' 
          ? `Cliente ${cliente.name} excluído com sucesso` 
          : `Cliente ${cliente.name} desativado com sucesso`
      )
      
      // Callback de sucesso
      if (onSuccess) onSuccess()
      
      // Fechar o dialog
      onClose()
    } catch (error) {
      console.error(`Erro ao ${modo} cliente:`, error)
      toast.error(error instanceof Error ? error.message : `Erro ao ${modo === 'excluir' ? 'excluir' : 'desativar'} cliente`)
    } finally {
      setProcessando(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {modo === 'excluir' ? 'Excluir' : 'Desativar'} Cliente
          </AlertDialogTitle>
          <AlertDialogDescription>
            {modo === 'excluir' 
              ? `Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente ${cliente.name} e todos os seus dados.`
              : `Esta ação desativará o cliente ${cliente.name}. O cliente não poderá mais acessar o sistema até que seja reativado.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault()
              confirmarAcao()
            }}
            className={modo === 'excluir' ? 'bg-destructive hover:bg-destructive/90' : ''}
          >
            {processando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              modo === 'excluir' ? 'Excluir' : 'Desativar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
