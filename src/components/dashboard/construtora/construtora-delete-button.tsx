"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
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

interface ConstrutorDeleteButtonProps {
  id: string
  nome: string
  onDelete?: () => void
}

export function ConstrutorDeleteButton({ id, nome, onDelete }: ConstrutorDeleteButtonProps) {
  const [loading, setLoading] = useState(false)
  
  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/construtoras/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Erro ao excluir construtora')
      }
      
      toast({
        title: "Construtora excluída",
        description: `${nome} foi removida com sucesso.`,
      })
      
      if (onDelete) {
        onDelete()
      }
    } catch (error) {
      console.error('Erro ao excluir construtora:', error)
      toast({
        title: "Erro ao excluir construtora",
        description: "Ocorreu um erro ao tentar excluir a construtora.",
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
          className="w-full flex gap-2 items-center text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Excluir Construtora</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente a construtora 
            <span className="font-semibold"> {nome} </span>
            e todos os dados associados a ela.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Excluindo..." : "Sim, excluir construtora"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
