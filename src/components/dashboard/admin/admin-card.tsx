"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MoreHorizontal, CheckCircle, XCircle, Trash2, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { AdminDashboard, alterarStatusAdmin, deletarAdmin } from "@/services/admin-service"
import { AdminFormModal } from "./admin-form-modal"

interface AdminCardProps {
  admin: AdminDashboard
  onDelete: () => void
  onStatusChange: () => void
  className?: string
}

export function AdminCard({ admin, onDelete, onStatusChange, className }: AdminCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [loading, setLoading] = useState(false)

  // Tradução dos status
  const statusText = {
    ativo: "Ativo",
    inativo: "Inativo",
    pendente: "Pendente"
  }
  
  // Tradução dos perfis
  const perfilText = {
    super: "Super Admin",
    admin: "Admin",
    gerente: "Gerente"
  }

  // Mudar status do administrador
  const handleStatusChange = async (novoStatus: 'ativo' | 'inativo' | 'pendente') => {
    setLoading(true)
    try {
      const success = await alterarStatusAdmin(admin.id, novoStatus)
      if (success) {
        toast({
          title: "Status alterado",
          description: `Administrador ${admin.nome} agora está ${statusText[novoStatus].toLowerCase()}.`,
        })
        onStatusChange()
      }
    } catch (error) {
      console.error("Erro ao mudar status:", error)
    } finally {
      setLoading(false)
    }
  }

  // Deletar administrador
  const handleDelete = async () => {
    setLoading(true)
    try {
      const success = await deletarAdmin(admin.id)
      if (success) {
        toast({
          title: "Administrador removido",
          description: `${admin.nome} foi removido com sucesso.`,
        })
        setConfirmDelete(false)
        onDelete()
      }
    } catch (error) {
      console.error("Erro ao deletar:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className={cn("transition-all duration-200 hover:shadow-md overflow-hidden", className)}>
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20 opacity-60" />
          <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/40 h-24" />
          
          <div className="absolute -bottom-10 left-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-700 border-4 border-white overflow-hidden">
                {admin.imagemUrl ? (
                  <img 
                    src={admin.imagemUrl} 
                    alt={admin.nome}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-orange-100 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-orange-500">
                      {admin.nome.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="absolute -bottom-1 -right-1">
                <div className={`w-4 h-4 rounded-full border-2 border-white 
                  ${admin.status === 'ativo' ? 'bg-green-500' : 
                    admin.status === 'inativo' ? 'bg-gray-400' : 'bg-yellow-500'}`} 
                />
              </div>
            </div>
          </div>
          
          <div className="absolute top-2 right-2 flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${admin.perfil === 'super' ? 'bg-orange-100 text-orange-600' : 
                admin.perfil === 'admin' ? 'bg-blue-100 text-blue-600' : 
                'bg-green-100 text-green-600'}`}
            >
              {perfilText[admin.perfil]}
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Opções</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Opção para ativar/desativar */}
                {admin.status !== 'ativo' && (
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange('ativo')}
                    disabled={loading}
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Ativar</span>
                  </DropdownMenuItem>
                )}
                
                {admin.status !== 'inativo' && (
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange('inativo')}
                    disabled={loading}
                  >
                    <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Inativar</span>
                  </DropdownMenuItem>
                )}
                
                {/* Opção para editar */}
                <DropdownMenuItem asChild>
                  <AdminFormModal
                    admin={{
                      id: admin.id,
                      nome: admin.nome,
                      email: admin.email
                    }} 
                    onSuccess={onStatusChange}
                  />
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Opção para remover */}
                <DropdownMenuItem 
                  onClick={() => setConfirmDelete(true)}
                  disabled={loading}
                >
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                  <span className="text-red-500">Remover</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <CardContent className="px-4 pt-12 pb-4">
          <h3 className="font-bold text-lg truncate">{admin.nome}</h3>
          <p className="text-sm text-muted-foreground truncate">{admin.email}</p>
          
          {/* As permissões foram removidas do modelo simplificado */}
          
          <div className="mt-4 pt-3 border-t flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Criado em {format(parseISO(admin.dataCriacao), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
            
            {admin.ultimoAcesso && (
              <span className="text-xs text-muted-foreground">
                Último acesso: {format(parseISO(admin.ultimoAcesso), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de confirmação para remover */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso removerá permanentemente o administrador {admin.nome} do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600"
            >
              {loading ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
