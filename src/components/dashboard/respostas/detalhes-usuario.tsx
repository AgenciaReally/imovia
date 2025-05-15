"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ClipboardList,
  UserCircle2,
  Calendar,
  Home,
  CheckCircle2,
  AlertCircle,
  MapPin,
  CheckCircle,
  XCircle
} from "lucide-react";

// Tipos
interface Resposta {
  id: string;
  userId: string;
  perguntaId: string;
  pergunta?: {
    texto: string;
    categoria: string;
    tipo?: string;
    pontuacao?: number;
  };
  usuario?: {
    email: string;
    name?: string;
  };
  texto?: string;
  categoria?: string;
  tipo?: string;
  pontuacao?: number;
  valor: string | {
    resposta: string;
    arquivo?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Imovel {
  id: string;
  titulo: string;
  descricao?: string;
  preco: number;
  area: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  latitude: number;
  longitude: number;
  endereco: string;
  match?: number;
  posicaoRanking?: number;
  destaque?: boolean;
}

interface DetalhesUsuarioProps {
  userId: string;
  respostas: Resposta[];
  onClose: () => void;
}

export function DetalhesUsuario({ userId, respostas, onClose }: DetalhesUsuarioProps) {
  const [tabAtiva, setTabAtiva] = useState<string>("respostas");
  const [imoveisIndicados, setImoveisIndicados] = useState<Imovel[]>([]);
  const [carregandoImoveis, setCarregandoImoveis] = useState<boolean>(false);

  // Dados do usuário
  const email = respostas.length > 0 ? respostas[0].usuario?.email : "Usuário não identificado";
  const nome = respostas.length > 0 ? respostas[0].usuario?.name : null;

  // Agrupar respostas por categoria
  const categorias = [...new Set(respostas.map(r => r.pergunta?.categoria).filter(Boolean))];
  const respostasPorCategoria: Record<string, Resposta[]> = {};
  
  categorias.forEach(categoria => {
    respostasPorCategoria[categoria as string] = respostas.filter(
      r => r.pergunta?.categoria === categoria
    );
  });

  // Data da primeira e última resposta
  const datasRespostas = respostas.map(r => new Date(r.createdAt));
  const primeiraResposta = datasRespostas.length > 0 ? 
    format(new Date(Math.min(...datasRespostas.map(d => d.getTime()))), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR }) : 
    "N/A";
  const ultimaResposta = datasRespostas.length > 0 ? 
    format(new Date(Math.max(...datasRespostas.map(d => d.getTime()))), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR }) : 
    "N/A";

  // Carregar imóveis indicados (simulado/mock)
  const carregarImoveis = async () => {
    if (imoveisIndicados.length > 0) return;
    
    setCarregandoImoveis(true);
    
    try {
      // Aqui seria uma chamada real à API para buscar os imóveis indicados para este usuário
      // baseados nas respostas/DeepSeek
      setTimeout(() => {
        // Dados simulados
        const mockImoveis: Imovel[] = [
          {
            id: "imovel-1",
            titulo: "Apartamento Premium com Vista Panorâmica",
            descricao: "Incrível apartamento com vista para o mar e acabamento premium",
            preco: 850000,
            area: 120,
            quartos: 3,
            banheiros: 2,
            vagas: 2,
            latitude: -23.5505,
            longitude: -46.6333,
            endereco: "R. Exemplo, 123 - Jardins",
            match: 92,
            posicaoRanking: 1,
            destaque: true
          },
          {
            id: "imovel-2",
            titulo: "Casa em Condomínio Fechado",
            descricao: "Casa ampla em condomínio com toda infraestrutura",
            preco: 720000,
            area: 180,
            quartos: 4,
            banheiros: 3,
            vagas: 2,
            latitude: -23.5605,
            longitude: -46.6433,
            endereco: "Alameda dos Jardins, 500",
            match: 87,
            posicaoRanking: 2,
            destaque: true
          },
          {
            id: "imovel-3",
            titulo: "Studio Moderno Próximo ao Centro",
            descricao: "Studio compacto e muito bem localizado",
            preco: 380000,
            area: 45,
            quartos: 1,
            banheiros: 1,
            vagas: 1,
            latitude: -23.5705,
            longitude: -46.6533,
            endereco: "Av. Principal, 789",
            match: 73,
            posicaoRanking: 3,
            destaque: false
          }
        ];
        
        setImoveisIndicados(mockImoveis);
        setCarregandoImoveis(false);
      }, 1500);
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
      setCarregandoImoveis(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com informações do usuário */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-muted/30 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <UserCircle2 className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{nome || "Usuário Anônimo"}</h2>
            <p className="text-muted-foreground">{email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">
                Primeira resposta: <span className="font-medium">{primeiraResposta}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="py-1">
            {respostas.length} respostas
          </Badge>
          <Badge 
            variant={categorias.length >= 7 ? "default" : "secondary"} 
            className={`py-1 ${categorias.length >= 7 ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}`}
          >
            {categorias.length} categorias
          </Badge>
          <Badge 
            variant={new Date(ultimaResposta) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? "default" : "outline"} 
            className="py-1"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Última atividade
          </Badge>
        </div>
      </div>
      
      {/* Guias: Respostas e Imóveis Recomendados */}
      <div className="flex border-b space-x-4">
        <button 
          onClick={() => setTabAtiva("respostas")}
          className={`pb-2 pt-1 px-1 font-medium text-sm flex items-center gap-1 
            ${tabAtiva === "respostas" 
              ? "border-b-2 border-primary text-primary" 
              : "text-muted-foreground hover:text-foreground"}`}
        >
          <ClipboardList className="h-4 w-4 mr-1" />
          Respostas
        </button>
        <button 
          onClick={() => {
            setTabAtiva("imoveis");
            carregarImoveis();
          }}
          className={`pb-2 pt-1 px-1 font-medium text-sm flex items-center gap-1 
            ${tabAtiva === "imoveis" 
              ? "border-b-2 border-primary text-primary" 
              : "text-muted-foreground hover:text-foreground"}`}
        >
          <Home className="h-4 w-4 mr-1" />
          Imóveis Indicados
        </button>
      </div>
      
      {/* Conteúdo: Respostas */}
      {tabAtiva === "respostas" && (
        <div className="space-y-4">
          <Accordion type="multiple" className="space-y-2">
            {categorias.map((categoria) => (
              <AccordionItem 
                key={categoria} 
                value={categoria as string}
                className="border rounded-md shadow-sm"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/20 [&[data-state=open]>svg]:text-primary">
                  <div className="flex items-center">
                    <Badge className="mr-2" variant="outline">
                      {respostasPorCategoria[categoria as string].length}
                    </Badge>
                    <span>{categoria}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60%]">Pergunta</TableHead>
                        <TableHead>Resposta</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {respostasPorCategoria[categoria as string].map((resposta) => (
                        <TableRow key={resposta.id}>
                          <TableCell className="align-top">
                            <div className="flex flex-col">
                              <span>{resposta.pergunta?.texto}</span>
                              {resposta.pergunta?.tipo && (
                                <span className="text-xs text-muted-foreground mt-1">
                                  Tipo: {resposta.pergunta.tipo}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="align-top font-medium">
                            <div className="break-words whitespace-normal">
                              {typeof resposta.valor === 'object' && resposta.valor !== null ? (
                                <div>
                                  <div className="flex items-center gap-2">
                                    {resposta.valor.resposta === 'sim' ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    )}
                                    <span>{resposta.valor.resposta === 'sim' ? 'Sim' : 'Não'}</span>
                                  </div>
                                  
                                  {resposta.valor.arquivo && (
                                    <div className="mt-2 text-sm text-blue-600 flex items-center gap-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                      </svg>
                                      <span>{resposta.valor.arquivo}</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                resposta.valor
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground mt-1 block">
                              {format(new Date(resposta.createdAt), "dd/MM/yyyy HH:mm")}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
      
      {/* Conteúdo: Imóveis Indicados */}
      {tabAtiva === "imoveis" && (
        <div className="space-y-4">
          {carregandoImoveis ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-primary rounded-full border-t-transparent mb-2" />
              <p className="text-muted-foreground text-sm">Carregando imóveis recomendados...</p>
            </div>
          ) : imoveisIndicados.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Nenhum imóvel foi recomendado para este usuário</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={carregarImoveis}>
                Tentar carregar novamente
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {imoveisIndicados.map((imovel) => (
                <Card key={imovel.id} className="overflow-hidden border shadow-md hover:shadow-lg transition-all duration-200">
                  <div className="relative w-full h-40 bg-muted/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Home className="h-12 w-12 text-muted" />
                    </div>
                    {imovel.destaque && (
                      <Badge className="absolute top-2 right-2" variant="default">
                        Destaque
                      </Badge>
                    )}
                    <div className="absolute bottom-2 right-2">
                      <Badge 
                        variant={imovel.match && imovel.match > 85 ? "default" : imovel.match && imovel.match > 70 ? "default" : "secondary"}
                        className={imovel.match && imovel.match > 85 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                      >
                        {imovel.match}% match
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base line-clamp-1">
                      {imovel.titulo}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {imovel.descricao || "Sem descrição disponível"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-semibold">R$ {imovel.preco.toLocaleString('pt-BR')}</div>
                      <div className="text-muted-foreground">{imovel.area}m²</div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>{imovel.quartos} quarto{imovel.quartos !== 1 ? 's' : ''}</div>
                      <div>{imovel.banheiros} banheir{imovel.banheiros !== 1 ? 'os' : 'o'}</div>
                      <div>{imovel.vagas} vaga{imovel.vagas !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{imovel.endereco}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <div className="text-xs text-muted-foreground">
                      Ranking: <span className="font-medium">#{imovel.posicaoRanking}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7">Detalhes</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-end">
        <Button onClick={onClose}>Voltar para lista</Button>
      </div>
    </div>
  );
}
