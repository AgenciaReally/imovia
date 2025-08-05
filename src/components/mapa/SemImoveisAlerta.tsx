'use client';

import { useState, useEffect } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SemImoveisAlertaProps {
  cidade?: string | null;
  bairro?: string | null;
  onLimparFiltros?: () => void;
}

export function SemImoveisAlerta({ cidade, bairro, onLimparFiltros }: SemImoveisAlertaProps) {
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    // Reset visibilidade quando os filtros mudam
    setVisivel(true);
  }, [cidade, bairro]);

  if (!visivel) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 animate-fade-in">
      <div className="flex items-start">
        <div className="bg-amber-100 rounded-full p-2 mr-4">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
        
        <div className="flex-1">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-amber-800">
              Nenhum imóvel encontrado
              {cidade ? ` em ${cidade}` : ''}
              {bairro ? ` (${bairro})` : ''}
            </h3>
            
            <p className="text-amber-700 mt-1">
              Não encontramos imóveis que correspondam aos filtros selecionados, 
              especialmente para a localidade indicada.
            </p>
          </div>
          
          <div className="flex gap-3 mt-3">
            {onLimparFiltros && (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-amber-300 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
                onClick={onLimparFiltros}
              >
                <MapPin className="mr-1 h-4 w-4" />
                Limpar filtros de localização
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-800 hover:bg-amber-100"
              onClick={() => setVisivel(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
