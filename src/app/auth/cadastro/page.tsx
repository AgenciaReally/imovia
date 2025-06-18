"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Schema de validação para o formulário de cadastro de construtora
const cadastroSchema = z.object({
  nomeRepresentante: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  razaoSocial: z.string().min(3, { message: "Razão social é obrigatória" }),
  cnpj: z
    .string()
    .min(14, { message: "CNPJ deve ter 14 números" })
    .max(18, { message: "CNPJ inválido" })
    .refine((val) => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/.test(val), {
      message: "CNPJ inválido",
    }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z
    .string()
    .min(10, { message: "Telefone deve ter pelo menos 10 números" })
    .refine((val) => /^(\(\d{2}\)|\d{2})\s?9?\d{4}-?\d{4}$|^\d{10,11}$/.test(val), {
      message: "Formato de telefone inválido",
    }),
  senha: z
    .string()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
    .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
    .regex(/[a-z]/, { message: "Senha deve conter pelo menos uma letra minúscula" })
    .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número" })
    .regex(/[^A-Za-z0-9]/, { message: "Senha deve conter pelo menos um caractere especial" }),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type CadastroFormValues = z.infer<typeof cadastroSchema>

export default function CadastroPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1) // Passos do formulário (1: Dados básicos, 2: Dados da empresa)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Elementos visuais decorativos para o fundo
  const decorativeElements = [
    { id: 1, size: 120, x: '5%', y: '15%', delay: 0, rotate: 15 },
    { id: 2, size: 80, x: '90%', y: '12%', delay: 0.2, rotate: -10 },
    { id: 3, size: 140, x: '85%', y: '85%', delay: 0.4, rotate: 25 },
    { id: 4, size: 50, x: '10%', y: '80%', delay: 0.6, rotate: -5 },
    { id: 5, size: 90, x: '50%', y: '95%', delay: 0.8, rotate: 10 },
  ];

  // Configuração do formulário com react-hook-form e zod
  const form = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nomeRepresentante: "",
      razaoSocial: "",
      cnpj: "",
      email: "",
      telefone: "",
      senha: "",
      confirmarSenha: "",
    },
  })

  async function onSubmit(data: CadastroFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // Chamada real à API de cadastro
      const response = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        // Cadastro bem-sucedido
        setSuccess(true)
        // Aguardar breve tempo para mostrar mensagem de sucesso
        setTimeout(() => {
          // Redirecionar para o login
          router.push('/auth/login?cadastroSucesso=true')
        }, 2000)
      } else {
        // Erro retornado pela API
        setError(result.message || "Ocorreu um erro ao tentar realizar o cadastro.")
      }
    } catch (err) {
      console.error("Erro ao fazer cadastro:", err)
      setError("Ocorreu um erro ao tentar realizar o cadastro. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  // Função para formatar o CNPJ enquanto o usuário digita
  const formatCNPJ = (value: string) => {
    // Remove caracteres não numéricos
    const cnpjNumbers = value.replace(/\D/g, '')

    // Aplica a máscara do CNPJ
    if (cnpjNumbers.length <= 2) {
      return cnpjNumbers
    } else if (cnpjNumbers.length <= 5) {
      return `${cnpjNumbers.slice(0, 2)}.${cnpjNumbers.slice(2)}`
    } else if (cnpjNumbers.length <= 8) {
      return `${cnpjNumbers.slice(0, 2)}.${cnpjNumbers.slice(2, 5)}.${cnpjNumbers.slice(5)}`
    } else if (cnpjNumbers.length <= 12) {
      return `${cnpjNumbers.slice(0, 2)}.${cnpjNumbers.slice(2, 5)}.${cnpjNumbers.slice(5, 8)}/${cnpjNumbers.slice(8)}`
    } else {
      return `${cnpjNumbers.slice(0, 2)}.${cnpjNumbers.slice(2, 5)}.${cnpjNumbers.slice(5, 8)}/${cnpjNumbers.slice(8, 12)}-${cnpjNumbers.slice(12, 14)}`
    }
  }

  // Função para formatar o telefone enquanto o usuário digita
  const formatTelefone = (value: string) => {
    // Remove caracteres não numéricos
    const phoneNumbers = value.replace(/\D/g, '')

    // Aplica a máscara do telefone
    if (phoneNumbers.length <= 2) {
      return `(${phoneNumbers}`
    } else if (phoneNumbers.length <= 6) {
      return `(${phoneNumbers.slice(0, 2)}) ${phoneNumbers.slice(2)}`
    } else if (phoneNumbers.length <= 10) {
      return `(${phoneNumbers.slice(0, 2)}) ${phoneNumbers.slice(2, 6)}-${phoneNumbers.slice(6)}`
    } else {
      return `(${phoneNumbers.slice(0, 2)}) ${phoneNumbers.slice(2, 7)}-${phoneNumbers.slice(7, 11)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary relative overflow-hidden flex flex-col justify-center items-center px-4 py-8">
      <div className="relative z-10 w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden relative z-10">
            {/* Elementos decorativos no card */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80"></div>
            <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-primary/10"></div>
            <CardHeader className="space-y-2 pb-0">
              <div className="flex justify-center mb-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image 
                    src="/logo.webp" 
                    alt="Imovia Logo" 
                    width={120} 
                    height={40} 
                    className="h-auto" 
                  />
                </motion.div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Cadastro
                </motion.span>
              </CardTitle>
              <CardDescription className="text-center">
                {step === 1
                  ? "Preencha seus dados para criar sua conta"
                  : "Dados da sua construtora"
                }
              </CardDescription>

              {/* Indicador de progresso aprimorado */}
              <div className="flex justify-center mt-4 mb-2">
                <div className="flex items-center">
                  <motion.div
                    className={`rounded-full h-10 w-10 flex items-center justify-center shadow-md transition-all duration-300 ${step >= 1 ? 'bg-primary text-white font-medium' : 'bg-gray-100 text-gray-400'}`}
                    whileHover={{ scale: 1.05 }}
                    animate={step === 1 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.5, repeat: step === 1 ? 0 : 0 }}
                  >
                    1
                  </motion.div>
                  <motion.div
                    className={`h-1 w-16 transition-all duration-500 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}
                    initial={{ width: 0 }}
                    animate={{ width: '4rem' }}
                    transition={{ delay: 0.5 }}
                  />
                  <motion.div
                    className={`rounded-full h-10 w-10 flex items-center justify-center shadow-md transition-all duration-300 ${step >= 2 ? 'bg-primary text-white font-medium' : 'bg-gray-100 text-gray-400'}`}
                    whileHover={{ scale: 1.05 }}
                    animate={step === 2 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.5, repeat: step === 2 ? 0 : 0 }}
                  >
                    2
                  </motion.div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nomeRepresentante"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Representante</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome completo"
                            {...field}
                            disabled={isLoading}
                            className="border-gray-300 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="razaoSocial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razão Social</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Razão social da construtora"
                            {...field}
                            disabled={isLoading}
                            className="border-gray-300 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>CNPJ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="00.000.000/0000-00"
                            {...field}
                            onChange={(e) => {
                              const formattedValue = formatCNPJ(e.target.value)
                              e.target.value = formattedValue
                              onChange(e)
                            }}
                            disabled={isLoading}
                            className="border-gray-300 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="construtora@email.com"
                              type="email"
                              {...field}
                              disabled={isLoading}
                              className="border-gray-300 focus:border-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field: { onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(00) 00000-0000"
                              {...field}
                              onChange={(e) => {
                                const formattedValue = formatTelefone(e.target.value)
                                e.target.value = formattedValue
                                onChange(e)
                              }}
                              disabled={isLoading}
                              className="border-gray-300 focus:border-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              disabled={isLoading}
                              className="border-gray-300 focus:border-primary"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmarSenha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              disabled={isLoading}
                              className="border-gray-300 focus:border-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 p-3 rounded-md text-red-600 text-sm border border-red-100 shadow-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-600 transition-all duration-200 text-white font-medium py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processando...</span>
                      </>
                    ) : (
                      <>
                        <span>Próximo</span>
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-0 pb-6">
              <div className="text-sm text-gray-500 text-center">
                Já tem uma conta?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:text-primary-600 font-medium transition-colors"
                >
                  Faça login
                </Link>
              </div>

              <div className="text-xs text-gray-400 text-center">
                {new Date().getFullYear()} Imovia · Todos os direitos reservados
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
