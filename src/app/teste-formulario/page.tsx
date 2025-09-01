"use client"

import { FormularioIntegrado } from "@/components/home/FormularioIntegrado"

export default function TesteFormularioPage() {
  const handleFormComplete = (respostas: Record<string, any>) => {
    console.log("Respostas recebidas na página:", respostas)
    
    // Aqui você pode processar as respostas e redirecionar para o mapa
    // Por exemplo: router.push('/mapa-interativo')
  }

  return (
    <div>
      <FormularioIntegrado
        sessionId="teste-session-123"
        onComplete={handleFormComplete}
      />
    </div>
  )
}
