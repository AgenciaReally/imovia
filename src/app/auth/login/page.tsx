"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { EsqueciSenhaModal } from "@/components/auth/esqueci-senha-modal"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Schema de validação para o formulário de login
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  lembrarMe: z.boolean().default(false),
})

// Tipo inferido do schema de login
type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [esqueciSenhaModalOpen, setEsqueciSenhaModalOpen] = useState(false)
  const router = useRouter()
  
  // Elementos visuais decorativos para o fundo
  const decorativeElements = [
    { id: 1, size: 80, x: '10%', y: '20%', delay: 0 },
    { id: 2, size: 60, x: '85%', y: '15%', delay: 0.2 },
    { id: 3, size: 120, x: '80%', y: '80%', delay: 0.4 },
    { id: 4, size: 40, x: '15%', y: '85%', delay: 0.6 },
    { id: 5, size: 30, x: '45%', y: '90%', delay: 0.8 },
  ]

  // Configuração do formulário com react-hook-form e zod
  const form = useForm({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: "",
      senha: "",
      lembrarMe: false,
    },
  })

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    setError(null)
    
    try {
      // Fazer requisição para a API de login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.senha,
          lembrarMe: data.lembrarMe
        }),
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Falha na autenticação')
      }
      
      // Se autenticado com sucesso, redirecionar baseado na role do usuário
      if (responseData.role === 'ADMIN') {
        router.push('/painel/admin')
      } else if (responseData.role === 'CONSTRUTORA') {
        router.push('/painel/construtora')
      } else if (responseData.role === 'CLIENTE') {
        router.push('/painel/cliente')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      console.error("Erro ao fazer login:", err)
      setError(err.message || "Ocorreu um erro ao tentar fazer login. Verifique suas credenciais.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary relative overflow-hidden flex flex-col justify-center items-center px-4 py-10">
      {/* Elementos decorativos animados */}
      {decorativeElements.map(elem => (
        <motion.div
          key={elem.id}
          className="absolute rounded-full bg-primary/5 z-0"
          style={{ 
            width: elem.size, 
            height: elem.size, 
            left: elem.x, 
            top: elem.y,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: elem.delay, 
            ease: [0.2, 0.65, 0.3, 0.9] 
          }}
        />
      ))}
      {/* Logo e branding animados */}
      <motion.div 
        className="absolute top-8 left-8 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-12 h-12 overflow-hidden">
          <img src="/logo.webp" alt="Imovia Logo" className="w-full h-full object-contain" />
        </div>
      </motion.div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Elemento visual para o card de login */}
        <motion.div
          className="absolute -top-5 -left-5 w-20 h-20 rounded-full bg-primary/10 z-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />
        <motion.div
          className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-primary/10 z-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden relative z-10">
            {/* Elementos decorativos no card */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80"></div>
            <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-primary/10"></div>
            <CardHeader className="space-y-1 pb-2">
              <div className="flex justify-center mb-4">
                <Image 
                  src="/logo.webp" 
                  alt="Imovia Logo" 
                  width={120} 
                  height={120} 
                  className="object-contain"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-800">
                Conectar-se
              </CardTitle>
              <CardDescription className="text-center">
                Entre com suas credenciais para acessar o painel
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data: any) => onSubmit(data))} className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="seu@email.com" 
                            {...field} 
                            disabled={isLoading}
                            className="border-gray-200 focus:border-primary focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="senha"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <FormField
                      control={form.control as any}
                      name="lembrarMe"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="lembrarMe" 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                          <label 
                            htmlFor="lembrarMe" 
                            className="text-sm font-medium leading-none cursor-pointer text-gray-600"
                          >
                            Lembre-me
                          </label>
                        </div>
                      )}
                    />
                    
                    <button
                      type="button"
                      className="text-primary hover:text-primary-600 hover:underline font-medium transition-colors"
                      onClick={() => setEsqueciSenhaModalOpen(true)}
                      disabled={isLoading}
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 p-3 rounded-md text-red-600 text-sm border border-red-100"
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-600 transition-all duration-200 text-white font-medium py-2 mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Entrando...</span>
                      </>
                    ) : "Conectar-se"}
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">ou continue com</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 flex items-center justify-center gap-2"
                      onClick={() => console.log('Login com Facebook')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 flex items-center justify-center gap-2"
                      onClick={() => console.log('Login com Google')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                        <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
                        <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
                        <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
                      </svg>
                      Google
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="text-sm text-gray-500 text-center">
                Não tem uma conta?{" "}
                <Link 
                  href="/auth/cadastro" 
                  className="text-primary hover:text-primary-600 font-medium transition-colors"
                >
                  Cadastre-se
                </Link>
              </div>
              
              <div className="text-xs text-gray-400 text-center">
                © {new Date().getFullYear()} Imovia · Todos os direitos reservados
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      {/* Modal de recuperação de senha */}
      <EsqueciSenhaModal 
        open={esqueciSenhaModalOpen} 
        onOpenChange={setEsqueciSenhaModalOpen} 
      />
    </div>
  )
}
