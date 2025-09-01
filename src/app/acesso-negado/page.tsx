"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function AcessoNegado() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Acesso Negado</h1>
          <p className="mt-2 text-gray-600">
            Você não tem permissão para acessar esta página. Verifique suas credenciais ou entre em contato com o administrador.
          </p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <Button 
            className="w-full"
            onClick={() => router.push('/auth/login')}
          >
            Fazer login
          </Button>
          
          <Button 
            variant="ghost"
            className="w-full"
            onClick={() => router.push('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Página inicial
          </Button>
        </div>
      </div>
    </div>
  );
}
