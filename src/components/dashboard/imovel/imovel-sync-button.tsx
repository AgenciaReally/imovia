import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle2, RefreshCcw, AlertTriangle, Loader2, Info, Database, ExternalLink } from 'lucide-react';
import { OruloCodeInput } from './orulo-code-input';
import { syncOruloBuildings } from '@/config/orulo';
import { ENV } from '@/config/env';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ImovelSyncButtonProps {
  onSuccess?: (count: number) => void;
}

export function ImovelSyncButton({ onSuccess }: ImovelSyncButtonProps) {
  const [loading, setLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    count: number;
    message: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [codeInputOpen, setCodeInputOpen] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setLoading(true);
    setSyncResult(null);
    
    try {
      // Verificar credenciais antes de sincronizar
      console.log('Iniciando sincronização com a Orulo');
      console.log('Credenciais configuradas:', {
        temClientId: !!process.env.ORULO_CLIENT_ID || 'usando padrão',
        temClientSecret: !!process.env.ORULO_CLIENT_SECRET || 'usando padrão',
        temApiKey: !!process.env.ORULO_API_KEY
      });
      
      const result = await syncOruloBuildings();
      console.log('Resultado da sincronização:', result);
      setSyncResult(result);
      
      if (result.success) {
        toast({
          title: "Sincronização concluída",
          description: `Foram sincronizados ${result.count} imóveis.`,
          variant: "default",
        });
        
        if (onSuccess) {
          onSuccess(result.count);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erro na sincronização",
          description: `Tentativa falhou: ${result.count} imóveis importados.`,
        });
      }
    } catch (error) {
      setSyncResult({
        success: false,
        count: 0,
        message: `Erro inesperado: ${(error as Error).message}`
      });
      
      toast({
        title: "Erro na sincronização",
        description: "Ocorreu um erro ao tentar sincronizar com a Orulo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className="gap-2 relative overflow-hidden group"
        onClick={() => setDialogOpen(true)}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <RefreshCcw className="h-5 w-5" />
        )}
        <span>Sincronizar Orulo</span>
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sincronização com Orulo</DialogTitle>
            <DialogDescription>
              Sincronize imóveis da API da Orulo com o banco de dados local.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {syncResult ? (
              <div className={`p-4 rounded-lg ${syncResult.success ? 'bg-green-50' : 'bg-red-50'} flex items-start gap-3`}>
                {syncResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div>
                  <h4 className={`font-medium ${syncResult.success ? 'text-green-700' : 'text-red-700'}`}>
                    {syncResult.success ? 'Sincronização concluída' : 'Erro na sincronização'}
                  </h4>
                  <p className="text-sm mt-1">{syncResult.message}</p>
                  {syncResult.success && (
                    <p className="text-sm mt-2 text-gray-500">
                      Total de imóveis sincronizados: <span className="font-medium">{syncResult.count}</span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Esta ação irá sincronizar imóveis com o banco de dados local.
                </p>
                
                <Alert variant="default" className="bg-blue-50 border-blue-200">
                  <Database className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Integração Automática Orulo</AlertTitle>
                  <AlertDescription>
                    Os imóveis são sincronizados automaticamente da plataforma Orulo.
                    Esta ação força uma atualização manual dos dados.
                  </AlertDescription>
                </Alert>
                
                <div className="text-xs bg-blue-50 p-3 rounded-md border border-blue-100">
                  <p className="font-medium text-blue-800">Estado da integração:</p>
                  <ul className="mt-1 space-y-1 text-blue-700">
                    <li>• Cliente ID: {ENV.ORULO_PUBLIC.HAS_CLIENT_ID ? 'Configurado' : 'Usando padrão'}</li>
                    <li>• Cliente Secret: {ENV.ORULO_PUBLIC.HAS_CLIENT_SECRET ? 'Configurado' : 'Usando padrão'}</li>
                    <li>• API Key: {ENV.ORULO_PUBLIC.HAS_API_KEY ? 'Configurado' : 'Não configurado'}</li>
                    <li>• Método: <span className="font-medium text-blue-600">OAuth2 com autorização</span></li>
                    <li>• Status: <span className="font-medium text-blue-600">Dados reais (via API Orulo)</span></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <p className="text-amber-800 text-sm font-medium">Autenticação Orulo</p>
              <p className="text-xs text-amber-700 mt-1 mb-2">Para sincronizar imóveis, você precisa fazer login no portal da Orulo primeiro.</p>
              <Button
                variant="outline" 
                size="sm"
                className="gap-2 bg-white border-amber-300 text-amber-700 w-full justify-center text-xs"  
                onClick={() => {
                  // URL de autorização da Orulo
                  const clientId = process.env.ORULO_CLIENT_ID || 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
                  // Usando URI especial para aplicativos locais que não necessita de configuração no lado da Orulo
                  const redirectUri = 'urn:ietf:wg:oauth:2.0:oob';
                  const responseType = 'code';
                  // Escopo básico que sabemos que funciona
                  const scope = 'public';
                  
                  // Construir URL de autorização
                  const authUrl = `https://www.orulo.com.br/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
                  
                  // Abrir a URL em uma nova aba
                  window.open(authUrl, "_blank");
                  
                  // Exibir o modal para inserir o código
                  setCodeInputOpen(true);
                }}
              >
                <ExternalLink className="h-3 w-3" />
                Fazer Login na Orulo
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              {syncResult ? 'Fechar' : 'Cancelar'}
            </Button>
            
            {!syncResult && (
              <Button 
                variant="default" 
                onClick={handleSync}
                disabled={loading}
                className="gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Atualizar Imóveis da Orulo
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modal para inserir o código de autorização */}
      <OruloCodeInput 
        open={codeInputOpen} 
        onClose={() => setCodeInputOpen(false)}
        onSuccess={() => {
          toast({
            title: "Autenticação Orulo concluída",
            description: "Agora você pode sincronizar os imóveis",
          });
          // Após autenticar com sucesso, tentar sincronizar automaticamente
          handleSync();
        }}
      />
    </>
  );
}
