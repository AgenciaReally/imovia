"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Moon, Sun, Bell, BellOff } from "lucide-react"

interface ConfiguracoesUsuario {
  temaEscuro: boolean
  notificacoesEmail: boolean
  notificacoesNovoImovel: boolean
  notificacoesAtualizacoes: boolean
}

export default function ConfiguracoesClientePage() {
  const [loading, setLoading] = useState(true)
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesUsuario>({
    temaEscuro: false,
    notificacoesEmail: true,
    notificacoesNovoImovel: true,
    notificacoesAtualizacoes: true
  })
  const [userName, setUserName] = useState("Cliente")
  
  // Carregar configurações do usuário e informações do perfil
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true)
      
      // Buscar informações do usuário para a topbar
      try {
        const userResponse = await fetch('/api/cliente/dashboard')
        if (userResponse.ok) {
          const { data } = await userResponse.json()
          // Atualizar o nome do usuário com o retornado pela API
          if (data?.userName) {
            setUserName(data.userName)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error)
      }
      
      // Buscar configurações
      try {
        const response = await fetch('/api/cliente/configuracoes')
        
        if (!response.ok) {
          throw new Error('Erro ao buscar configurações')
        }
        
        const data = await response.json()
        setConfiguracoes(data)
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
        toast({
          title: "Erro ao carregar configurações",
          description: "Não foi possível carregar suas configurações. Usando valores padrão.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    carregarDados()
  }, [])
  
  // Atualizar configuração
  const atualizarConfiguracao = async (chave: keyof ConfiguracoesUsuario, valor: boolean) => {
    // Atualizar estado local primeiro para feedback imediato
    setConfiguracoes(prev => ({
      ...prev,
      [chave]: valor
    }))
    
    try {
      const response = await fetch('/api/cliente/configuracoes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [chave]: valor
        })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar configuração')
      }
      
      toast({
        title: "Configuração atualizada",
        description: "Sua configuração foi salva com sucesso.",
      })
      
      // Se for o tema, aplicar mudança
      if (chave === 'temaEscuro') {
        // Aqui você pode implementar a lógica para mudar o tema
        document.documentElement.classList.toggle('dark', valor)
      }
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error)
      
      // Reverter mudança em caso de erro
      setConfiguracoes(prev => ({
        ...prev,
        [chave]: !valor
      }))
      
      toast({
        title: "Erro ao atualizar configuração",
        description: "Não foi possível salvar sua configuração. Tente novamente.",
        variant: "destructive"
      })
    }
  }
  
  return (
    <DashboardLayout userRole="cliente" userName={userName}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações
          </p>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Configurações de aparência */}
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência da interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      {configuracoes.temaEscuro ? (
                        <Moon className="h-5 w-5 text-primary" />
                      ) : (
                        <Sun className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="tema-escuro" className="font-medium">
                        Tema escuro
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Ative o tema escuro para reduzir o cansaço visual
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="tema-escuro"
                    checked={configuracoes.temaEscuro}
                    onCheckedChange={(checked) => atualizarConfiguracao('temaEscuro', checked)}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Configurações de notificações */}
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Gerencie como você recebe notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      {configuracoes.notificacoesEmail ? (
                        <Bell className="h-5 w-5 text-primary" />
                      ) : (
                        <BellOff className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="notificacoes-email" className="font-medium">
                        Notificações por email
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações importantes por email
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="notificacoes-email"
                    checked={configuracoes.notificacoesEmail}
                    onCheckedChange={(checked) => atualizarConfiguracao('notificacoesEmail', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notificacoes-imovel" className="font-medium">
                      Novos imóveis
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Seja notificado quando novos imóveis compatíveis com seu perfil forem adicionados
                    </p>
                  </div>
                  <Switch
                    id="notificacoes-imovel"
                    checked={configuracoes.notificacoesNovoImovel}
                    onCheckedChange={(checked) => atualizarConfiguracao('notificacoesNovoImovel', checked)}
                    disabled={!configuracoes.notificacoesEmail}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notificacoes-atualizacoes" className="font-medium">
                      Atualizações do sistema
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba informações sobre novas funcionalidades e melhorias
                    </p>
                  </div>
                  <Switch
                    id="notificacoes-atualizacoes"
                    checked={configuracoes.notificacoesAtualizacoes}
                    onCheckedChange={(checked) => atualizarConfiguracao('notificacoesAtualizacoes', checked)}
                    disabled={!configuracoes.notificacoesEmail}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
