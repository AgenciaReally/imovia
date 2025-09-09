"use client";

import { FormularioDinamico } from "@/components/home/FormularioDinamico";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const handleQuestionarioConcluido = (respostas: any) => {
    console.log('Questionário concluído:', respostas);
    // Aqui você pode adicionar a lógica de análise posteriormente
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Encontre seu Imóvel dos Sonhos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Responda algumas perguntas e nossa IA encontrará os melhores imóveis para você
          </p>
        </div>

        <FormularioDinamico onComplete={handleQuestionarioConcluido} />
      </div>

      <Toaster />
    </div>
  );
}
