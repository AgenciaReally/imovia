"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCircle2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface Resposta {
  id: string;
  userId: string;
  perguntaId: string;
  pergunta?: {
    texto: string;
    categoria: string;
  };
  usuario?: {
    email: string;
    name?: string;
  };
  valor: string;
  createdAt: string;
  updatedAt: string;
}

interface UsuariosAgrupadosProps {
  respostas: Resposta[];
  onVerDetalhes: (userId: string) => void;
}

export function UsuariosAgrupados({ respostas, onVerDetalhes }: UsuariosAgrupadosProps) {
  const [ordenarPor, setOrdenarPor] = useState<string>("recentes");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 20;

  // Agrupar respostas por usuário
  const usuariosMap = new Map<string, {
    id: string;
    email: string;
    nome?: string;
    total: number;
    categorias: Set<string>;
    ultimaResposta: Date;
    primeiraResposta: Date;
  }>();

  respostas.forEach(resposta => {
    if (!resposta.userId || !resposta.usuario) return;
    
    const userId = resposta.userId;
    const categoriaAtual = resposta.pergunta?.categoria;
    const dataResposta = new Date(resposta.createdAt);
    
    if (!usuariosMap.has(userId)) {
      usuariosMap.set(userId, {
        id: userId,
        email: resposta.usuario.email,
        nome: resposta.usuario.name,
        total: 0,
        categorias: new Set(),
        ultimaResposta: dataResposta,
        primeiraResposta: dataResposta
      });
    }
    
    const dadosUsuario = usuariosMap.get(userId)!;
    dadosUsuario.total += 1;
    if (categoriaAtual) {
      dadosUsuario.categorias.add(categoriaAtual);
    }
    
    // Atualizar primeira e última resposta
    if (dataResposta < dadosUsuario.primeiraResposta) {
      dadosUsuario.primeiraResposta = dataResposta;
    }
    if (dataResposta > dadosUsuario.ultimaResposta) {
      dadosUsuario.ultimaResposta = dataResposta;
    }
  });
  
  // Converter para array e ordenar
  let usuarios = Array.from(usuariosMap.values());
  
  // Aplicar ordenação
  switch (ordenarPor) {
    case "recentes":
      usuarios.sort((a, b) => b.ultimaResposta.getTime() - a.ultimaResposta.getTime());
      break;
    case "antigos":
      usuarios.sort((a, b) => a.primeiraResposta.getTime() - b.primeiraResposta.getTime());
      break;
    case "total":
      usuarios.sort((a, b) => b.total - a.total);
      break;
    case "az":
      usuarios.sort((a, b) => a.email.localeCompare(b.email));
      break;
    case "za":
      usuarios.sort((a, b) => b.email.localeCompare(a.email));
      break;
    case "categorias":
      usuarios.sort((a, b) => b.categorias.size - a.categorias.size);
      break;
  }
  
  // Filtrar por busca
  if (busca) {
    const termoBusca = busca.toLowerCase();
    usuarios = usuarios.filter(
      u => u.email.toLowerCase().includes(termoBusca) || 
           u.nome?.toLowerCase().includes(termoBusca)
    );
  }
  
  // Paginação
  const totalPaginas = Math.ceil(usuarios.length / itensPorPagina);
  const usuariosPaginados = usuarios.slice(
    (pagina - 1) * itensPorPagina, 
    pagina * itensPorPagina
  );
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => setOrdenarPor(ordenarPor === 'az' ? 'za' : 'az')}
                >
                  Usuário
                  {ordenarPor === 'az' ? <ChevronUp className="h-3 w-3" /> : 
                   ordenarPor === 'za' ? <ChevronDown className="h-3 w-3" /> : null}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center gap-1"
                  onClick={() => setOrdenarPor("categorias")}
                >
                  Categorias
                  {ordenarPor === 'categorias' ? <ChevronDown className="h-3 w-3" /> : null}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center gap-1"
                  onClick={() => setOrdenarPor("total")}
                >
                  Respostas
                  {ordenarPor === 'total' ? <ChevronDown className="h-3 w-3" /> : null}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center gap-1"
                  onClick={() => setOrdenarPor(ordenarPor === 'recentes' ? 'antigos' : 'recentes')}
                >
                  Última Atividade
                  {ordenarPor === 'recentes' ? <ChevronDown className="h-3 w-3" /> : 
                   ordenarPor === 'antigos' ? <ChevronUp className="h-3 w-3" /> : null}
                </button>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosPaginados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              usuariosPaginados.map((usuario) => (
                <TableRow key={usuario.id} className="group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-primary/10 rounded-full">
                        <UserCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="max-w-[250px] truncate">{usuario.email}</div>
                        {usuario.nome && (
                          <div className="text-xs text-muted-foreground">
                            {usuario.nome}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(usuario.categorias).map((categoria) => (
                        <Badge key={categoria} variant="outline" className="text-xs">
                          {categoria}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{usuario.total}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.round(usuario.total / usuario.categorias.size)} por categoria
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(usuario.ultimaResposta, "dd/MM/yyyy HH:mm")}
                    <div className="text-xs text-muted-foreground mt-1">
                      Desde {format(usuario.primeiraResposta, "dd/MM/yyyy")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onVerDetalhes(usuario.id)}
                    >
                      Ver Detalhes
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagina(Math.max(1, pagina - 1))}
            disabled={pagina === 1}
          >
            Anterior
          </Button>
          <div className="text-sm">
            Página {pagina} de {totalPaginas}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))}
            disabled={pagina === totalPaginas}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
