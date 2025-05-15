"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { ativarConstrutora, desativarConstrutora } from "@/services/construtora-service"

interface ConstrutorStatusButtonProps {
  id: string
  nome: string
  status: 'ativa' | 'inativa' | 'pendente'
  onStatusChange?: () => void
}

export function ConstrutorStatusButton({ id, nome, status, onStatusChange }: ConstrutorStatusButtonProps) {
  const [loading, setLoading] = useState(false)
  
  const isAtiva = status === 'ativa'
  
  const handleStatusToggle = async () => {
    setLoading(true)
    try {
      let success = false
      
      if (isAtiva) {
        // Desativar construtora
        success = await desativarConstrutora(id)
        if (success) {
          toast({
            title: "Construtora desativada",
            description: `${nome} foi desativada com sucesso.`,
          })
        }
      } else {
        // Ativar construtora
        success = await ativarConstrutora(id)
        if (success) {
          toast({
            title: "Construtora ativada",
            description: `${nome} foi ativada com sucesso.`,
          })
        }
      }
      
      if (success && onStatusChange) {
        onStatusChange()
      }
    } catch (error) {
      console.error(`Erro ao ${isAtiva ? 'desativar' : 'ativar'} construtora:`, error)
      toast({
        title: `Erro ao ${isAtiva ? 'desativar' : 'ativar'} construtora`,
        description: `Ocorreu um erro ao tentar ${isAtiva ? 'desativar' : 'ativar'} a construtora.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`w-full flex gap-2 items-center ${
            isAtiva 
              ? "text-amber-500 hover:text-amber-600 hover:bg-amber-50 border-amber-200" 
              : "text-green-500 hover:text-green-600 hover:bg-green-50 border-green-200"
          }`}
        >
          {isAtiva ? (
            <>
              <XCircle className="h-3.5 w-3.5" />
              <span>Desativar Construtora</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Ativar Construtora</span>
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            {isAtiva ? (
              <>
                Desativar a construtora <span className="font-semibold">{nome}</span> irá 
                impedir que ela apareça em listagens públicas e suas operações ficarão limitadas.
              </>
            ) : (
              <>
                Ativar a construtora <span className="font-semibold">{nome}</span> permitirá 
                que ela apareça em listagens públicas e tenha acesso a todas as funcionalidades.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleStatusToggle}
            disabled={loading}
            className={isAtiva ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600"}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading 
              ? (isAtiva ? "Desativando..." : "Ativando...") 
              : (isAtiva ? "Sim, desativar" : "Sim, ativar")
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
