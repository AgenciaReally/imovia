import { toast } from "@/components/ui/use-toast";

// Interface para administrador
export interface AdminDashboard {
  id: string;
  nome: string;
  email: string;
  imagemUrl?: string;
  telefone?: string;
  ultimoAcesso?: string;
  dataCriacao: string;
  status: 'ativo' | 'inativo' | 'pendente';
  perfil: 'super' | 'admin' | 'gerente';
  permissoes: {
    construtoras: boolean;
    imoveis: boolean;
    usuarios: boolean;
    vendas: boolean;
    relatorios: boolean;
    financeiro: boolean;
    configuracoes: boolean;
  }
}

// Interface para criação/atualização de admin
export interface AdminFormData {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  senha?: string;
  perfil: 'super' | 'admin' | 'gerente';
  status: 'ativo' | 'inativo' | 'pendente';
  permissoes: {
    construtoras: boolean;
    imoveis: boolean;
    usuarios: boolean;
    vendas: boolean;
    relatorios: boolean;
    financeiro: boolean;
    configuracoes: boolean;
  };
}

// Estatísticas dos admins
export interface AdminStats {
  total: number;
  ativos: number;
  inativos: number;
  pendentes: number;
  superAdmins: number;
  admins: number;
  gerentes: number;
  ultimosCadastros: {
    id: string;
    nome: string;
    dataCriacao: string;
  }[];
}

// Função para obter a lista de administradores
export async function getAdmins(): Promise<AdminDashboard[]> {
  try {
    const response = await fetch('/api/admins', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Erro ao obter lista de administradores');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar administradores:', error);
    toast({
      title: "Erro ao carregar dados",
      description: "Não foi possível obter a lista de administradores",
      variant: "destructive",
    });
    return [];
  }
}

// Função para obter estatísticas dos administradores
export async function getEstatisticasAdmins(): Promise<AdminStats> {
  try {
    const response = await fetch('/api/admins/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Erro ao obter estatísticas dos administradores');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    toast({
      title: "Erro ao carregar estatísticas",
      description: "Não foi possível obter as estatísticas dos administradores",
      variant: "destructive",
    });
    return {
      total: 0,
      ativos: 0,
      inativos: 0,
      pendentes: 0,
      superAdmins: 0,
      admins: 0,
      gerentes: 0,
      ultimosCadastros: []
    };
  }
}

// Função para criar um novo administrador
export async function criarAdmin(data: AdminFormData): Promise<AdminDashboard | null> {
  try {
    const response = await fetch('/api/admins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar administrador');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Erro ao criar administrador:', error);
    toast({
      title: "Erro ao criar administrador",
      description: error.message || "Não foi possível criar o administrador",
      variant: "destructive",
    });
    return null;
  }
}

// Função para atualizar um administrador existente
export async function atualizarAdmin(data: AdminFormData): Promise<AdminDashboard | null> {
  try {
    if (!data.id) {
      throw new Error('ID do administrador não fornecido');
    }

    const response = await fetch(`/api/admins`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar administrador');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Erro ao atualizar administrador:', error);
    toast({
      title: "Erro ao atualizar administrador",
      description: error.message || "Não foi possível atualizar o administrador",
      variant: "destructive",
    });
    return null;
  }
}

// Função para alterar o status de um administrador
export async function alterarStatusAdmin(id: string, status: 'ativo' | 'inativo' | 'pendente'): Promise<boolean> {
  try {
    const response = await fetch(`/api/admins/status?id=${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao alterar status do administrador');
    }

    return true;
  } catch (error: any) {
    console.error('Erro ao alterar status:', error);
    toast({
      title: "Erro ao alterar status",
      description: error.message || "Não foi possível alterar o status do administrador",
      variant: "destructive",
    });
    return false;
  }
}

// Função para deletar um administrador
export async function deletarAdmin(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admins?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao deletar administrador');
    }

    return true;
  } catch (error: any) {
    console.error('Erro ao deletar administrador:', error);
    toast({
      title: "Erro ao deletar administrador",
      description: error.message || "Não foi possível deletar o administrador",
      variant: "destructive",
    });
    return false;
  }
}
