"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface Ponto {
  id: string;
  lat: number;
  lng: number;
  valor: number;
  imovelId?: string;
  titulo?: string;
}

const PONTOS_MOCK: Ponto[] = [
  { id: "p1", lat: 25, lng: 25, valor: 95, imovelId: "im1", titulo: "Apartamento Premium Zona Norte" },
  { id: "p2", lat: 70, lng: 35, valor: 78, imovelId: "im2", titulo: "Casa em Condomínio Fechado" },
  { id: "p3", lat: 62, lng: 65, valor: 65, imovelId: "im3", titulo: "Studio Moderno Centro" },
  { id: "p4", lat: 38, lng: 60, valor: 82, imovelId: "im4", titulo: "Cobertura Duplex Jardins" },
  { id: "p5", lat: 45, lng: 45, valor: 91, imovelId: "im5", titulo: "Apartamento Vista Parque" },
  { id: "p6", lat: 30, lng: 30, valor: 43, imovelId: "im6", titulo: "Casa Térrea" },
  { id: "p7", lat: 75, lng: 25, valor: 56, imovelId: "im7", titulo: "Loft Industrial" },
  { id: "p8", lat: 65, lng: 75, valor: 37, imovelId: "im8", titulo: "Kitnet Universitária" },
  { id: "p9", lat: 28, lng: 55, valor: 62, imovelId: "im9", titulo: "Sobrado Estilo Americano" },
  { id: "p10", lat: 55, lng: 60, valor: 88, imovelId: "im10", titulo: "Apartamento Alto Padrão" },
  { id: "p11", lat: 15, lng: 35, valor: 71, imovelId: "im11", titulo: "Casa com Vista" },
  { id: "p12", lat: 80, lng: 40, valor: 53, imovelId: "im12", titulo: "Flat Mobiliado" },
  { id: "p13", lat: 50, lng: 80, valor: 49, imovelId: "im13", titulo: "Apartamento 2 Quartos" },
  { id: "p14", lat: 35, lng: 70, valor: 76, imovelId: "im14", titulo: "Cobertura com Piscina" },
  { id: "p15", lat: 60, lng: 20, valor: 84, imovelId: "im15", titulo: "Condomínio Club" },
];

interface MapaCalorProps {
  titulo?: string;
  descricao?: string;
  altura?: number;
  largura?: string;
}

export function MapaCalor({ 
  titulo = "Mapa de Calor de Interações",
  descricao = "Visualize quais áreas e imóveis recebem mais interesse dos usuários",
  altura = 400,
  largura = "100%"
}: MapaCalorProps) {
  const [tipoInteracao, setTipoInteracao] = useState<string>("visualizacoes");
  const [pontoSelecionado, setPontoSelecionado] = useState<Ponto | null>(null);
  
  // Obtém a cor baseada no valor de calor (0-100)
  const obterCorCalor = (valor: number) => {
    // Escala de vermelho (baixo) para verde (alto)
    if (valor >= 80) return "bg-green-500";
    if (valor >= 60) return "bg-green-400";
    if (valor >= 40) return "bg-yellow-400";
    if (valor >= 20) return "bg-orange-400";
    return "bg-red-500";
  };
  
  // Obtém o tamanho do ponto baseado no valor
  const obterTamanhoPonto = (valor: number) => {
    // Tamanho escalado de 15px a 40px baseado no valor
    const tamanhoMinimo = 15;
    const tamanhoMaximo = 40;
    const tamanho = tamanhoMinimo + ((valor / 100) * (tamanhoMaximo - tamanhoMinimo));
    return {
      width: `${tamanho}px`,
      height: `${tamanho}px`
    };
  };
  
  const mostrarDetalhes = (ponto: Ponto) => {
    setPontoSelecionado(ponto);
  };
  
  const fecharDetalhes = () => {
    setPontoSelecionado(null);
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl">{titulo}</CardTitle>
          <CardDescription>{descricao}</CardDescription>
        </div>
        <Select value={tipoInteracao} onValueChange={setTipoInteracao}>
          <SelectTrigger className="w-[160px]">
            {tipoInteracao === "visualizacoes" 
              ? "Visualizações" 
              : tipoInteracao === "cliques" 
                ? "Cliques" 
                : "Tempo de permanência"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visualizacoes">Visualizações</SelectItem>
            <SelectItem value="cliques">Cliques</SelectItem>
            <SelectItem value="tempo">Tempo de permanência</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {/* Legenda do mapa */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
            <span className="text-xs">Baixo</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-orange-400 mr-1"></div>
            <span className="text-xs">Médio-baixo</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-yellow-400 mr-1"></div>
            <span className="text-xs">Médio</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-400 mr-1"></div>
            <span className="text-xs">Médio-alto</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs">Alto</span>
          </div>
        </div>
        
        {/* Mapa de calor */}
        <div 
          className="relative bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          style={{ height: `${altura}px`, width: largura }}
        >
          {/* Grade do mapa (apenas para visualização) */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
            {Array(10).fill(0).map((_, indexRow) => (
              Array(10).fill(0).map((_, indexCol) => (
                <div 
                  key={`grid-${indexRow}-${indexCol}`}
                  className="border border-gray-400 dark:border-gray-600"
                />
              ))
            ))}
          </div>
          
          {/* Pontos de calor */}
          {PONTOS_MOCK.map((ponto) => (
            <div 
              key={ponto.id}
              className={`absolute rounded-full cursor-pointer ${obterCorCalor(ponto.valor)} opacity-70 hover:opacity-100 transition-all duration-200 flex items-center justify-center`}
              style={{ 
                ...obterTamanhoPonto(ponto.valor),
                left: `${ponto.lng}%`, 
                top: `${ponto.lat}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => mostrarDetalhes(ponto)}
            >
              <MapPin className="h-4 w-4 text-white" />
            </div>
          ))}
          
          {/* Modal de detalhes do ponto */}
          {pontoSelecionado && (
            <div 
              className="absolute bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700"
              style={{ 
                left: `${pontoSelecionado.lng}%`, 
                top: `${pontoSelecionado.lat + 10}%`,
                transform: 'translate(-50%, 0)',
                minWidth: '200px',
                maxWidth: '280px'
              }}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm line-clamp-1">{pontoSelecionado.titulo}</h4>
                <button 
                  onClick={fecharDetalhes}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Índice de interesse:</span>
                  <Badge variant={pontoSelecionado.valor >= 70 ? "default" : "secondary"}>
                    {pontoSelecionado.valor}/100
                  </Badge>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Métricas:</span>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs">Visualizações</span>
                    <span className="text-xs font-medium">1,208</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs">Cliques</span>
                    <span className="text-xs font-medium">327</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs">Tempo médio</span>
                    <span className="text-xs font-medium">2m 45s</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
