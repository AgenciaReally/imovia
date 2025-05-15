"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import {
  SunMedium,
  Moon,
  Monitor,
  Check,
  Palette
} from "lucide-react";

interface CardConfiguracaoTemaProps {
  onSavePreferences?: (theme: string, color: string) => void;
}

export function CardConfiguracaoTema({
  onSavePreferences
}: CardConfiguracaoTemaProps) {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>(theme || "system");
  const [corPrimaria, setCorPrimaria] = useState<string>("orange");
  
  // Cores primárias disponíveis
  const coresPrimarias = [
    { id: "orange", cor: "#FF6B00", nome: "Laranja (Padrão)" },
    { id: "blue", cor: "#3B82F6", nome: "Azul" },
    { id: "green", cor: "#10B981", nome: "Verde" },
    { id: "purple", cor: "#8B5CF6", nome: "Roxo" },
    { id: "rose", cor: "#F43F5E", nome: "Rosa" },
  ];
  
  // Aplicar tema imediatamente ao selecionar
  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
    setTheme(value);
  };
  
  // Salvar preferências
  const salvarPreferencias = () => {
    if (onSavePreferences) {
      onSavePreferences(selectedTheme, corPrimaria);
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-5 w-5 mr-2 text-primary" />
          Aparência
        </CardTitle>
        <CardDescription>
          Personalize a aparência da plataforma conforme suas preferências
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Modo de Tema */}
        <div className="space-y-4">
          <h3 className="text-md font-medium mb-2">Tema</h3>
          
          <RadioGroup 
            defaultValue={selectedTheme} 
            value={selectedTheme} 
            onValueChange={handleThemeChange} 
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem 
                value="light" 
                id="light" 
                className="peer sr-only" 
              />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-primary/50 peer-checked:border-primary [&:has([data-state=checked])]:border-primary dark:bg-gray-900"
              >
                <SunMedium className="h-6 w-6 mb-3 text-amber-500" />
                <div className="font-normal">Claro</div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem 
                value="dark" 
                id="dark" 
                className="peer sr-only" 
              />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-primary/50 peer-checked:border-primary [&:has([data-state=checked])]:border-primary dark:bg-gray-900"
              >
                <Moon className="h-6 w-6 mb-3 text-indigo-500" />
                <div className="font-normal">Escuro</div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem 
                value="system" 
                id="system" 
                className="peer sr-only" 
              />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-primary/50 peer-checked:border-primary [&:has([data-state=checked])]:border-primary dark:bg-gray-900"
              >
                <Monitor className="h-6 w-6 mb-3 text-gray-500" />
                <div className="font-normal">Sistema</div>
              </Label>
            </div>
          </RadioGroup>
          
          <p className="text-sm text-muted-foreground mt-2">
            {selectedTheme === "light" ? "Modo claro será usado para todos os elementos da interface." : 
             selectedTheme === "dark" ? "Modo escuro será usado para todos os elementos da interface." : 
             "O tema seguirá as configurações do seu sistema operacional."}
          </p>
        </div>
        
        {/* Cor Principal */}
        <div className="space-y-4 pt-4">
          <h3 className="text-md font-medium mb-2">Cor Principal</h3>
          
          <div className="grid grid-cols-5 gap-3">
            {coresPrimarias.map(cor => (
              <button
                key={cor.id}
                className={`h-12 rounded-md relative ${
                  corPrimaria === cor.id ? 'ring-2 ring-offset-2 ring-primary' : 'ring-1 ring-muted'
                }`}
                style={{ backgroundColor: cor.cor }}
                onClick={() => setCorPrimaria(cor.id)}
                aria-label={`Cor ${cor.nome}`}
              >
                {corPrimaria === cor.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-5 w-5 text-white drop-shadow-md" />
                  </div>
                )}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            {coresPrimarias.map(cor => (
              <div key={cor.id} className="text-xs text-center">
                {cor.nome}
              </div>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            A cor principal será aplicada a botões, links e elementos de destaque.
          </p>
        </div>
        
        {/* Visualização */}
        <div className="pt-4 space-y-3">
          <h3 className="text-md font-medium mb-2">Visualização</h3>
          
          <div className={`border rounded-lg p-4 ${
            selectedTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          }`}>
            <div className="flex items-center gap-2">
              <div 
                className="rounded-md w-16 h-8 flex items-center justify-center text-white"
                style={{ backgroundColor: coresPrimarias.find(c => c.id === corPrimaria)?.cor }}
              >
                Botão
              </div>
              <div>Texto de exemplo</div>
              <div 
                className="text-sm font-medium"
                style={{ color: coresPrimarias.find(c => c.id === corPrimaria)?.cor }}
              >
                Link colorido
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-6">
        <Button
          onClick={salvarPreferencias}
        >
          Salvar Preferências
        </Button>
      </CardFooter>
    </Card>
  );
}
