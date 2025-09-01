"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Key, FileCode, RefreshCw, AlertCircle } from "lucide-react";

interface DialogApiConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiName: string;
  apiKey?: string;
  apiEndpoint?: string;
  organizationId?: string;
  onSave: (dados: any) => Promise<void>;
}

// Schema com validação usando Zod
const formSchema = z.object({
  apiKey: z.string().min(10, "A chave de API deve ter pelo menos 10 caracteres"),
  apiEndpoint: z.string().url("Deve ser uma URL válida").optional(),
  organizationId: z.string().optional(),
  enableLogging: z.boolean().default(true),
  enableCaching: z.boolean().default(true),
  maxTokens: z.coerce.number().int().min(1).max(100000).optional(),
  temperature: z.coerce.number().min(0).max(1).optional(),
});

export function DialogApiConfig({
  open,
  onOpenChange,
  apiName,
  apiKey = "",
  apiEndpoint = "",
  organizationId = "",
  onSave
}: DialogApiConfigProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  // Inicializar formulário com react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey,
      apiEndpoint,
      organizationId,
      enableLogging: true,
      enableCaching: true,
      maxTokens: 1000,
      temperature: 0.7,
    }
  });
  
  // Função para testar a conexão com a API
  const handleTestConnection = async () => {
    const apiKey = form.getValues("apiKey");
    
    if (!apiKey) {
      form.setError("apiKey", { 
        type: "manual", 
        message: "A chave da API é necessária para testar a conexão" 
      });
      return;
    }
    
    setTestStatus("loading");
    
    // Simulação de teste de conexão
    setTimeout(() => {
      // Aqui seria uma chamada real à API
      const success = Math.random() > 0.3; // 70% de chance de sucesso
      setTestStatus(success ? "success" : "error");
    }, 1500);
  };
  
  // Função para salvar configurações
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await onSave(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configuração da API {apiName}</DialogTitle>
          <DialogDescription>
            Configure as credenciais e parâmetros para integração com a API {apiName}.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* API Key */}
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Key className="h-4 w-4 mr-2" />
                    Chave da API
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="sk-..." 
                      type="password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Chave secreta para autenticação na API {apiName}.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* API Endpoint (opcional) */}
            <FormField
              control={form.control}
              name="apiEndpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <FileCode className="h-4 w-4 mr-2" />
                    Endpoint da API (opcional)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://api.exemplo.com/v1" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    URL base para as chamadas da API. Use apenas se precisar substituir o endpoint padrão.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Organization ID (opcional) */}
            <FormField
              control={form.control}
              name="organizationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID da Organização (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="org-..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Se você estiver usando uma conta organizacional.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Parâmetros adicionais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <FormField
                control={form.control}
                name="enableLogging"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 rounded-md border">
                    <div className="space-y-0.5">
                      <FormLabel>Registrar logs</FormLabel>
                      <FormDescription className="text-xs">
                        Salva logs das chamadas
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableCaching"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 rounded-md border">
                    <div className="space-y-0.5">
                      <FormLabel>Cache</FormLabel>
                      <FormDescription className="text-xs">
                        Ativa cache de respostas
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Botão de teste */}
            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={testStatus === "loading" || !form.getValues("apiKey")}
              >
                {testStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Testar Conexão
                  </>
                )}
              </Button>
              
              {testStatus === "success" && (
                <div className="text-green-500 text-sm flex items-center">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Conexão bem-sucedida!
                </div>
              )}
              
              {testStatus === "error" && (
                <div className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  Falha na conexão
                </div>
              )}
            </div>
          
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Configurações"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
