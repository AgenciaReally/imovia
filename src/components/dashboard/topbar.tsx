"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Maximize, 
  Minimize, 
  Menu, 
  User, 
  LogOut, 
  Settings,
  ChevronDown,
  Check,
  CheckCircle,
  X,
  AlertTriangle,
  XCircle,
  Building,
  Users,
  FileText
} from "lucide-react"

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { buscarNotificacoes, marcarNotificacaoComoLida, formatarTempoRelativo } from "@/services/notificacao-service"
import { Notification } from "@/app/api/notificacoes/route"

// Interface para as notificações já definida no arquivo @/app/api/notificacoes/route

// Interface para as propriedades do Topbar
interface TopbarProps {
  userRole?: "admin" | "construtora" | "cliente"
  userName?: string
}

export function Topbar({ userRole = "admin", userName = "Admin" }: TopbarProps) {
  const { theme, setTheme } = useTheme()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const notificationMenuRef = useRef<HTMLDivElement>(null)

  // Função para alternar entre modo tela cheia
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erro ao entrar em modo tela cheia: ${err.message}`)
      })
      setIsFullScreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullScreen(false)
      }
    }
  }

  // Carregar notificações do servidor
  const carregarNotificacoes = async () => {
    try {
      setIsLoadingNotifications(true);
      const { notificacoes, unreadCount: novasNaoLidas } = await buscarNotificacoes({ limit: 10 });
      setNotifications(notificacoes);
      setUnreadCount(novasNaoLidas);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // Efeito para carregar notificações quando o componente montar
  useEffect(() => {
    carregarNotificacoes();
    
    // Atualizar notificações a cada 2 minutos
    const interval = setInterval(() => {
      if (!notificationsOpen) { // Só atualiza se o menu não estiver aberto
        carregarNotificacoes();
      }
    }, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [notificationsOpen]);

  // Marcar notificação como lida
  const markAsRead = async (id: string) => {
    try {
      const success = await marcarNotificacaoComoLida(id);
      
      if (success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
        
        // Atualizar contagem de não lidas
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }

  // Marcar todas as notificações como lidas
  const markAllAsRead = async () => {
    try {
      // Para cada notificação não lida, marcar como lida
      const naoLidas = notifications.filter(n => !n.read);
      
      // Criar um array de promessas para marcar todas como lidas
      const promessas = naoLidas.map(n => marcarNotificacaoComoLida(n.id));
      
      // Executar todas as promessas
      await Promise.all(promessas);
      
      // Atualizar estado local
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      
      // Zerar contagem de não lidas
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
    }
  }

  // Efeito para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Efeito para detectar cliques fora do menu de notificações
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Obtém as iniciais do nome do usuário para o avatar
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <TooltipProvider>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 h-16 bg-background z-40 transition-all duration-200 border-b flex items-center justify-between px-4",
          isScrolled && "shadow-sm"
        )}
    >
      {/* Logo e título */}
      <div className="flex items-center">
        <Link href="/painel/admin" className="flex items-center space-x-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center w-20 h-20 overflow-hidden"
          >
            <img src="/logo.webp" alt="Imovia Logo" className="w-full h-full object-contain" />
          </motion.div>
        </Link>
        
        <span className="ml-8 text-muted-foreground hidden md:block">|</span>
        
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="ml-8 font-medium hidden md:block"
        >
          {userRole === "admin" ? "Painel do Administrador" : userRole === "cliente" ? "Painel do Cliente" : "Painel da Construtora"}
        </motion.span>
      </div>

      {/* Ações e perfil */}
      <div className="flex items-center space-x-2">
        {/* Barra de pesquisa */}
       
        {/* Toggle de tema (Light/Dark) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 relative overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme === "dark" ? "dark" : "light"}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {theme === "dark" ? "Modo claro" : "Modo escuro"}
          </TooltipContent>
        </Tooltip>

        {/* Botão de tela cheia */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullScreen}
              className="h-9 w-9 relative overflow-hidden hidden sm:flex"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isFullScreen ? "minimize" : "maximize"}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isFullScreen ? "Sair da tela cheia" : "Tela cheia"}
          </TooltipContent>
        </Tooltip>

        {/* Dropdown de notificações */}
        <div className="relative" ref={notificationMenuRef}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="h-9 w-9 relative"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-[10px]">{unreadCount}</span>
                  </motion.div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Notificações</TooltipContent>
          </Tooltip>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-md shadow-lg border overflow-hidden z-50"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold">Notificações</h3>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead} 
                      className="text-xs text-primary hover:text-primary"
                    >
                      Marcar todas como lidas
                    </Button>
                  )}
                </div>
                
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Bell className="h-10 w-10 mx-auto mb-2 opacity-20" />
                      <p>Nenhuma notificação</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-3 border-b transition-colors last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start">
                          <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                            notification.type === 'success' && "bg-green-100",
                            notification.type === 'info' && "bg-blue-100",
                            notification.type === 'warning' && "bg-amber-100",
                            notification.type === 'error' && "bg-red-100",
                            !notification.type && "bg-gray-100",
                          )}>
                            {notification.type === 'success' && (
                              notification.entityType === 'construtora' ? (
                                <Building className="h-4 w-4 text-green-600" />
                              ) : notification.entityType === 'usuario' ? (
                                <Users className="h-4 w-4 text-green-600" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )
                            )}
                            {notification.type === 'info' && (
                              notification.entityType === 'resposta' ? (
                                <FileText className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Bell className="h-4 w-4 text-blue-600" />
                              )
                            )}
                            {notification.type === 'warning' && (
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                            )}
                            {notification.type === 'error' && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            {!notification.type && (
                              <Bell className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className={`text-sm font-medium ${!notification.read ? 'text-primary' : ''}`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-muted-foreground ml-2">
                                {formatarTempoRelativo(notification.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
                
                <div className="p-3 border-t text-center">
                  <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                    <Link href="/painel/admin/notificacoes">Ver todas as notificações</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Menu de usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 pl-2 pr-3 ml-1 flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={userRole === "admin" ? "/avatars/admin.png" : userRole === "cliente" ? "/avatars/cliente.png" : "/avatars/construtora.png"} onError={(e) => {
                  // Quando a imagem não existir, usar apenas o fallback
                  e.currentTarget.style.display = 'none';
                }} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getUserInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left hidden sm:flex">
                <span className="text-sm font-medium leading-none">{userName}</span>
                <span className="text-xs text-muted-foreground">
                  {userRole === "admin" ? "Administrador" : userRole === "cliente" ? "Cliente" : "Construtora"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/painel/${userRole}/perfil`} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/painel/${userRole}/configuracoes`} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={async () => {
                try {
                  // Chamar a API de logout
                  await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  // Redirecionar para a página de login
                  window.location.href = '/auth/login';
                } catch (error) {
                  console.error('Erro ao fazer logout:', error);
                  // Mesmo em caso de erro, redirecionar para login
                  window.location.href = '/auth/login';
                }
              }}
              className="text-red-500 focus:text-red-500 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    </TooltipProvider>
  )
}
