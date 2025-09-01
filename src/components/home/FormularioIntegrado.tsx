"use client"

import { useState } from "react"
import { FormularioDinamico } from "./FormularioDinamico"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowLeft } from "lucide-react"

interface FormularioIntegradoProps {
  userId?: string
  sessionId?: string
  onComplete?: (respostas: Record<string, any>) => void
}

export function FormularioIntegrado({ userId, sessionId, onComplete }: FormularioIntegradoProps) {
  const [etapa, setEtapa] = useState<'formulario' | 'concluido'>('formulario')
  const [respostasFinais, setRespostasFinais] = useState<Record<string, any>>({})

  const handleFormComplete = (respostas: Record<string, any>) => {
    console.log("Formulário concluído com respostas:", respostas)
    setRespostasFinais(respostas)
    setEtapa('concluido')
    
    // Chamar callback se fornecido
    if (onComplete) {
      onComplete(respostas)
    }
  }

  const reiniciarFormulario = () => {
    setEtapa('formulario')
    setRespostasFinais({})
  }

  if (etapa === 'concluido') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">
            Formulário Concluído!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Suas respostas foram salvas com sucesso. Agora vamos processar suas informações 
            para encontrar os imóveis ideais para você.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Resumo das Respostas:</h3>
            <p className="text-sm text-gray-600">
              {Object.keys(respostasFinais).length} perguntas respondidas
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={reiniciarFormulario}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Refazer Formulário
            </Button>
            
            <Button
              onClick={() => {
                // Aqui você pode redirecionar para o mapa ou próxima etapa
                console.log("Prosseguir para próxima etapa")
              }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Ver Resultados
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Encontre seu Imóvel Ideal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Responda algumas perguntas e nossa IA encontrará os melhores imóveis para você
          </p>
        </div>

        <FormularioDinamico
          onComplete={handleFormComplete}
          userId={userId}
          sessionId={sessionId}
        />
      </div>
    </div>
  )
}
