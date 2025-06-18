"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { User, Shield } from "lucide-react"
import { PerfilForm } from "@/components/cliente/perfil-form"
import { SegurancaForm } from "@/components/cliente/seguranca-form"

export default function PerfilClientePage() {
  const [loading, setLoading] = useState(true)
  const [usuario, setUsuario] = useState<any>(null)
  
  // Carregar dados do usuário
  useEffect(() => {
    const carregarUsuario = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/cliente/perfil')
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do perfil')
        }
        
        const data = await response.json()
        setUsuario(data)
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar seus dados. Tente novamente mais tarde.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    carregarUsuario()
  }, [])
  
  // Função para salvar informações pessoais
  const handleSavePerfil = async (data: any) => {
    try {
      const response = await fetch('/api/cliente/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil')
      }
      
      const dadosAtualizados = await response.json()
      setUsuario(dadosAtualizados)
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar suas informações. Tente novamente.",
        variant: "destructive"
      })
      throw error
    }
  }
  
  // Função para atualizar senha
  const handleSaveSeguranca = async (data: any) => {
    try {
      const response = await fetch('/api/cliente/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          senhaAtual: data.senhaAtual,
          novaSenha: data.novaSenha
        })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar senha')
      }
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao atualizar senha:', error)
      toast({
        title: "Erro ao atualizar senha",
        description: "Não foi possível atualizar sua senha. Verifique se a senha atual está correta.",
        variant: "destructive"
      })
      throw error
    }
  }
  
  return (
    <DashboardLayout userRole="cliente" userName="Cliente">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Visualize e edite suas informações pessoais
          </p>
        </div>
        
        <Tabs defaultValue="informacoes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="informacoes" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Informações Pessoais
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="informacoes">
            {loading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Atualize suas informações pessoais e de contato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PerfilForm initialData={usuario} onSave={handleSavePerfil} />
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="seguranca">
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Altere sua senha de acesso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SegurancaForm onSave={handleSaveSeguranca} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
