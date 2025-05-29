"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { 
  ChevronLeft, 
  LayoutDashboard, 
  Building, 
  Home, 
  Users, 
  MessageSquare, 
  BrainCircuit, 
  Settings, 
  PieChart, 
  Database, 
  FileText,
  Eye,
  BarChart,
  SunMedium,
  Moon,
  ShieldCheck,
  Globe
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

// Tipos para os itens de menu
type MenuItem = {
  icon: React.ReactNode
  label: string
  href: string
  badge?: string | number
  badgeVariant?: string
}

type MenuSection = {
  title: string
  items: MenuItem[]
}

// Tipo para as propriedades do componente
interface LeftBarProps {
  userRole?: "admin" | "construtora"
  userName?: string
}

export function LeftBar({ userRole = "admin", userName }: LeftBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  
  // Menu para admins com seções
  const adminMenuSections: MenuSection[] = [
    {
      title: "PAINEL PRINCIPAL",
      items: [
        { 
          icon: <LayoutDashboard className="h-5 w-5" />,
          label: "Visão Geral",
          href: "/painel/admin",
        },
        { 
          icon: <Home className="h-5 w-5" />,
          label: "Imóveis Imovia",
          href: "/painel/admin/imoveis",
        },
        { 
          icon: <Globe className="h-5 w-5" />,
          label: "Imóveis Orulo",
          href: "/painel/admin/imoveis-orulo",
        },
        { 
          icon: <BrainCircuit className="h-5 w-5" />,
          label: "Imovi I.A",
          href: "/painel/admin/imovia",
          badge: "I.A",
          badgeVariant: "destructive",
        },
        { 
          icon: <Building className="h-5 w-5" />,
          label: "Construtoras",
          href: "/painel/admin/construtoras",
        },
        
        { 
          icon: <Users className="h-5 w-5" />,
          label: "Clientes",
          href: "/painel/admin/clientes",
        },
        { 
          icon: <ShieldCheck className="h-5 w-5" />,
          label: "Admins",
          href: "/painel/admin/admins",
        }
      ]
    },
    {
      title: "IA & ANÁLISES",
      items: [
        { 
          icon: <MessageSquare className="h-5 w-5" />,
          label: "Perguntas",
          href: "/painel/admin/perguntas",
          badge: "Novo",
          badgeVariant: "destructive",
        },
        { 
          icon: <BrainCircuit className="h-5 w-5" />,
          label: "Respostas",
          href: "/painel/admin/respostas",
          badge: "Novo",
          badgeVariant: "success",
        },
        { 
          icon: <BarChart className="h-5 w-5" />,
          label: "Relatórios",
          href: "/painel/admin/relatorios",
        }
      ]
    },
    {
      title: "SISTEMA",
      items: [
        { 
          icon: <Database className="h-5 w-5" />,
          label: "Integrações",
          href: "/painel/admin/integracoes",
          badge: "API",
        },
        { 
          icon: <Settings className="h-5 w-5" />,
          label: "Configurações",
          href: "/painel/admin/configuracoes",
        }
      ]
    }
  ]
  
  // Menu para construtoras com seções
  const construtorMenuSections: MenuSection[] = [
    {
      title: "PAINEL PRINCIPAL",
      items: [
        { 
          icon: <LayoutDashboard className="h-5 w-5" />,
          label: "Visão Geral",
          href: "/painel/construtora",
        },
        { 
          icon: <Home className="h-5 w-5" />,
          label: "Imóveis",
          href: "/painel/construtora/imoveis",
          badge: "12",
        },
        { 
          icon: <Users className="h-5 w-5" />,
          label: "Clientes",
          href: "/painel/construtora/clientes",
          badge: "28",
        }
      ]
    },
    {
      title: "ANÁLISES",
      items: [
        { 
          icon: <FileText className="h-5 w-5" />,
          label: "Relatórios",
          href: "/painel/construtora/relatorios",
        },
        { 
          icon: <PieChart className="h-5 w-5" />,
          label: "Estatísticas",
          href: "/painel/construtora/estatisticas",
        },
        { 
          icon: <Eye className="h-5 w-5" />,
          label: "Dúvidas",
          href: "/painel/construtora/duvidas",
        }
      ]
    },
    {
      title: "SISTEMA",
      items: [
        { 
          icon: <Settings className="h-5 w-5" />,
          label: "Configurações",
          href: "/painel/construtora/configuracoes",
        }
      ]
    }
  ]
  
  // Selecionando as seções de menu corretas com base na role
  const menuSections = userRole === "admin" ? adminMenuSections : construtorMenuSections

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <TooltipProvider>
    <div className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] ${theme === "dark" ? "bg-zinc-900" : "bg-white"} border-r transition-all duration-300 ease-in-out ${isCollapsed ? "w-[70px]" : "w-[260px]"}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className={`text-xs font-medium text-muted-foreground ${isCollapsed ? "hidden" : "block"}`}>Imovia</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(prev => !prev)}
          className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
        </Button>
      </div>
      
      <div className="flex flex-col h-[calc(100%-8rem)]">
        {menuSections.map((section, sectionIndex) => (
          <div key={`section-${sectionIndex}`} className="flex flex-col py-2">
            {!isCollapsed && (
              <h3 className="text-xs font-medium text-muted-foreground px-4 py-2">
                {section.title}
              </h3>
            )}
            
            <nav className="space-y-1 px-2">
              {section.items.map((item, index) => {
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={`${section.title}-${index}`}
                    href={item.href}
                    className={`
                      flex items-center py-2 px-3 ${isCollapsed ? 'justify-center' : ''}
                      ${isActive ? "border-l-4 border-primary text-primary bg-primary/5" : "border-l-4 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"}
                      transition-colors group
                    `}
                  >
                    <div className={`${isActive ? "text-primary" : "text-muted-foreground"}`}>
                      {item.icon}
                    </div>
                    
                    {!isCollapsed && (
                      <span className="ml-3 font-medium text-sm">
                        {item.label}
                      </span>
                    )}

                    {!isCollapsed && item.badge && (
                      <Badge 
                        variant={item.badgeVariant === "destructive" ? "destructive" : "outline"}
                        className={`ml-auto ${item.badgeVariant === "destructive" ? "bg-red-100 text-red-800 hover:bg-red-100" : "bg-primary/10 text-primary hover:bg-primary/10"}`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 border-t p-4 space-y-2">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-xs text-muted-foreground">
              {theme === "dark" ? "Modo escuro" : "Modo claro"}
            </span>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`${isCollapsed ? "mx-auto" : ""} w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800`}
          >
            {theme === "dark" ? (
              <SunMedium className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {!isCollapsed && userName && (
          <div className="px-3 py-2 text-xs text-muted-foreground rounded-md">
            <span className="block opacity-70">Logado como</span>
            <span className="font-medium">{userName}</span>
          </div>
        )}
      </div>
    </div>
    </TooltipProvider>
  )
}
