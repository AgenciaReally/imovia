import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Schema para validação do formulário de redefinição de senha
const redefinirSenhaSchema = z.object({
  codigo: z.string().length(6, { message: 'O código deve ter 6 caracteres' }),
  novaSenha: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
  confirmarSenha: z.string(),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
});

type RedefinirSenhaFormValues = z.infer<typeof redefinirSenhaSchema>;

interface RedefinirSenhaModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function RedefinirSenhaModal({ isOpen, onClose, email }: RedefinirSenhaModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RedefinirSenhaFormValues>({
    resolver: zodResolver(redefinirSenhaSchema),
    defaultValues: {
      codigo: '',
      novaSenha: '',
      confirmarSenha: '',
    },
  });

  async function onSubmit(data: RedefinirSenhaFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/redefinir-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          codigo: data.codigo,
          novaSenha: data.novaSenha,
          confirmarSenha: data.confirmarSenha,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          form.reset();
        }, 3000);
      } else {
        setError(result.message || 'Ocorreu um erro ao redefinir sua senha.');
      }
    } catch (err) {
      setError('Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Redefinir Senha</DialogTitle>
          <DialogDescription className="text-center">
            Digite o código de 6 caracteres enviado para seu email e crie uma nova senha.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-4"
            >
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-green-800">Senha redefinida com sucesso!</h3>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Você já pode fazer login com sua nova senha.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                  {error && (
                    <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de Recuperação</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o código de 6 caracteres"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="novaSenha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Digite sua nova senha"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmarSenha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirme sua nova senha"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processando...' : 'Redefinir Senha'}
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
