"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface SearchParamsHandlerProps {
  setDadosUsuario: (dados: {
    nome?: string;
    email?: string;
    telefone?: string;
  }) => void;
}

export function SearchParamsHandler({ setDadosUsuario }: SearchParamsHandlerProps) {
  const searchParams = useSearchParams();

  // Recuperar dados de usuário dos parâmetros
  useEffect(() => {
    const email = searchParams.get("email");
    const telefone = searchParams.get("telefone");
    const nome = searchParams.get("nome");
    
    if (email || telefone || nome) {
      setDadosUsuario({
        email: email || undefined,
        telefone: telefone || undefined,
        nome: nome || undefined
      });
    }
  }, [searchParams, setDadosUsuario]);

  // Este componente não renderiza nada, apenas processa os parâmetros
  return null;
}
