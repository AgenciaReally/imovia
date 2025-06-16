"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import RedefinirSenhaModal from "./redefinir-senha-modal"

// Schema de validação para o formulário de recuperação de senha
const esqueciSenhaSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
})

type EsqueciSenhaFormValues = z.infer<typeof esqueciSenhaSchema>

interface EsqueciSenhaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EsqueciSenhaModal({ open, onOpenChange }: EsqueciSenhaModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState<string>("") 
  const [showRedefinirModal, setShowRedefinirModal] = useState(false)

  const form = useForm<EsqueciSenhaFormValues>({
    resolver: zodResolver(esqueciSenhaSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: EsqueciSenhaFormValues) {
    setIsLoading(true)
    setError(null)
    setEmail(data.email)
    
    try {
      // Enviar email de recuperação de senha
      const response = await fetch('/api/auth/recuperar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
        }),
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Falha ao enviar email de recuperação')
      }
      
      // Sucesso - mostrar mensagem de confirmação
      setEnviado(true)
    } catch (err: any) {
      console.error("Erro ao enviar email de recuperação:", err)
      setError(err.message || "Ocorreu um erro ao tentar enviar o email de recuperação.")
    } finally {
      setIsLoading(false)
    }
  }

  function resetarModal() {
    setEnviado(false)
    form.reset()
    onOpenChange(false)
  }
  
  function handleContinuar() {
    setShowRedefinirModal(true)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">
            {enviado ? "Email enviado!" : "Recuperar senha"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {enviado 
              ? "Verifique sua caixa de entrada para instruções sobre como redefinir sua senha."
              : "Informe seu email para receber instruções de recuperação de senha."
            }
          </DialogDescription>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          {!enviado ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="py-4"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
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
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 p-3 rounded-md text-red-600 text-sm border border-red-100"
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  <div className="flex justify-end pt-2">
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-primary-600 transition-all duration-200 text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Enviando...</span>
                        </>
                      ) : "Enviar"}
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="py-6 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <p className="text-gray-600 text-center mb-6">
                Se o email estiver cadastrado em nosso sistema, você receberá as instruções para redefinir sua senha em instantes.
              </p>
              
              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  onClick={resetarModal}
                  variant="outline"
                  className="transition-all duration-200 font-medium"
                >
                  Fechar
                </Button>
                
                <Button 
                  type="button" 
                  onClick={handleContinuar}
                  className="bg-primary hover:bg-primary-600 transition-all duration-200 text-white font-medium"
                >
                  Continuar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </DialogContent>
      </Dialog>
      
      {/* Modal para redefinir senha com o código */}
      <RedefinirSenhaModal 
        isOpen={showRedefinirModal} 
        onClose={() => setShowRedefinirModal(false)} 
        email={email} 
      />
    </>
  )
}
