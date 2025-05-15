"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Pergunta, CATEGORIAS_PERGUNTA, TIPOS_PERGUNTA, TIPOS_FLUXO } from '@/services/pergunta-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { PlusCircle, MinusCircle } from 'lucide-react'
import { motion } from 'framer-motion'

// Esquema de validação Zod
const perguntaFormSchema = z.object({
  texto: z.string().min(3, 'O texto deve ter pelo menos 3 caracteres'),
  tipo: z.string().min(1, 'Selecione um tipo de pergunta'),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  fluxo: z.string().min(1, 'Selecione um fluxo'),
  pontuacao: z.number().int().min(0).max(100),
  obrigatoria: z.boolean(),
  ativa: z.boolean(),
  geradaPorIA: z.boolean(),
  opcoes: z.array(z.object({
    label: z.string().optional(), // Tornamos opcional para evitar erros quando não usado
    value: z.string().optional()
  })).optional().or(z.undefined()) // Permitir undefined explicitamente
})

type PerguntaFormProps = {
  perguntaExistente?: Pergunta
  open: boolean
  onClose: () => void
  onSave: (data: z.infer<typeof perguntaFormSchema>) => void
}

export function PerguntaForm({ perguntaExistente, open, onClose, onSave }: PerguntaFormProps) {
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false)
  
  // Inicializar formulário
  const form = useForm<z.infer<typeof perguntaFormSchema>>({
    resolver: zodResolver(perguntaFormSchema),
    defaultValues: {
      texto: perguntaExistente?.texto || '',
      tipo: perguntaExistente?.tipo || '',
      categoria: perguntaExistente?.categoria || '',
      fluxo: perguntaExistente?.fluxo || 'AMBOS',
      pontuacao: perguntaExistente?.pontuacao || 1,
      obrigatoria: perguntaExistente?.obrigatoria !== undefined ? perguntaExistente.obrigatoria : true,
      ativa: perguntaExistente?.ativa !== undefined ? perguntaExistente.ativa : true,
      geradaPorIA: perguntaExistente?.geradaPorIA || false,
      opcoes: perguntaExistente?.opcoes ? 
        Object.entries(perguntaExistente.opcoes).map(([value, label]) => ({ value, label: label as string })) : 
        [{ label: '', value: '' }]
    }
  })
  
  // Resetar formulário quando a pergunta para editar mudar
  useEffect(() => {
    if (open) {
      // Mapear as opções do objeto para array se existirem
      const opcoesArray = perguntaExistente?.opcoes ? 
        Object.entries(perguntaExistente.opcoes).map(([value, label]) => ({ value, label: label as string })) : 
        [{ label: '', value: '' }];
      
      // Resetar o formulário com os novos valores
      form.reset({
        texto: perguntaExistente?.texto || '',
        tipo: perguntaExistente?.tipo || '',
        categoria: perguntaExistente?.categoria || '',
        fluxo: perguntaExistente?.fluxo || 'AMBOS',
        pontuacao: perguntaExistente?.pontuacao || 1,
        obrigatoria: perguntaExistente?.obrigatoria !== undefined ? perguntaExistente.obrigatoria : true,
        ativa: perguntaExistente?.ativa !== undefined ? perguntaExistente.ativa : true,
        geradaPorIA: perguntaExistente?.geradaPorIA || false,
        opcoes: opcoesArray
      });
      
      // Log para debug
      console.log('Resetando formulário com pergunta:', perguntaExistente);
    }
  }, [perguntaExistente, open, form]);
  
  // Observar mudanças no tipo da pergunta para mostrar/esconder opções
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'tipo') {
        const tipoSelecionado = value.tipo
        setMostrarOpcoes(['select', 'radio', 'checkbox', 'priority'].includes(tipoSelecionado || ''))
      }
    })
    
    // Verificar inicialmente
    const tipoAtual = form.getValues('tipo')
    setMostrarOpcoes(['select', 'radio', 'checkbox', 'priority'].includes(tipoAtual))
    
    return () => subscription.unsubscribe()
  }, [form])
  
  // Função para adicionar nova opção
  const adicionarOpcao = () => {
    const opcoes = form.getValues('opcoes') || []
    form.setValue('opcoes', [...opcoes, { label: '', value: '' }])
  }
  
  // Função para remover opção
  const removerOpcao = (index: number) => {
    const opcoes = form.getValues('opcoes') || []
    if (opcoes.length > 1) {
      form.setValue('opcoes', opcoes.filter((_, i) => i !== index))
    }
  }
  
  // Função para processar o envio do formulário
  const onSubmit = async (values: z.infer<typeof perguntaFormSchema>) => {
    try {
      console.log('Form values antes da conversão:', values);
      
      // Cria uma cópia dos valores para evitar mutação direta
      const dadosParaEnviar: any = {
        texto: values.texto,
        tipo: values.tipo,
        categoria: values.categoria,
        fluxo: values.fluxo,
        pontuacao: values.pontuacao,
        obrigatoria: values.obrigatoria,
        ativa: values.ativa,
        geradaPorIA: values.geradaPorIA
      };
      
      // Converter array de opções para objeto de opções
      if (values.opcoes && values.opcoes.length > 0 && mostrarOpcoes) {
        const opcoesObj = values.opcoes.reduce((acc, opt) => {
          if (opt.value && opt.label) {
            acc[opt.value] = opt.label
          }
          return acc
        }, {} as Record<string, string>);
        
        // Verificar se o objeto não está vazio
        if (Object.keys(opcoesObj).length > 0) {
          dadosParaEnviar.opcoes = opcoesObj;
        }
      }
      
      console.log('Form values depois da conversão:', dadosParaEnviar);
      
      // Chama a função onSave com os dados tratados
      onSave(dadosParaEnviar);
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      alert('Erro ao processar formulário. Verifique o console para mais detalhes.');
    }
  }
  
  // Função de submit reescrita para simplificar o fluxo e evitar erros
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit acionado");
    
    try {
      // Coletar valores do formulário
      const formValues = {
        texto: form.getValues('texto'),
        tipo: form.getValues('tipo'),
        categoria: form.getValues('categoria'),
        fluxo: form.getValues('fluxo'),
        pontuacao: form.getValues('pontuacao'),
        obrigatoria: form.getValues('obrigatoria'),
        ativa: form.getValues('ativa'),
        geradaPorIA: form.getValues('geradaPorIA'),
      };
      
      // Tratar opções apenas se o tipo de pergunta necessitar
      let opcoesObj = {};
      if (['select', 'radio', 'checkbox', 'priority'].includes(formValues.tipo)) {
        const opcoes = form.getValues('opcoes') || [];
        opcoesObj = opcoes.reduce((acc: Record<string, string>, opt: any) => {
          if (opt.value && opt.label) {
            acc[opt.value] = opt.label;
          }
          return acc;
        }, {});
      }
      
      // Preparar dados finais para salvar
      const dadosParaSalvar: any = {
        ...formValues,
        opcoes: Object.keys(opcoesObj).length > 0 ? opcoesObj : undefined
      };
      
      console.log('Dados para salvar:', dadosParaSalvar);
      
      // Chamar a função onSave com os dados tratados
      onSave(dadosParaSalvar);
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      alert('Erro ao processar formulário. Verifique o console para mais detalhes.');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{perguntaExistente ? 'Editar Pergunta' : 'Nova Pergunta'}</DialogTitle>
          <DialogDescription>
            {perguntaExistente 
              ? 'Atualize os detalhes da pergunta existente.' 
              : 'Preencha os dados para criar uma nova pergunta.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="texto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto da Pergunta</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite o texto da pergunta..."
                      {...field}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIAS_PERGUNTA.map((categoria) => (
                          <SelectItem key={categoria.valor} value={categoria.valor}>
                            {categoria.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Grupo ao qual a pergunta pertence
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIPOS_PERGUNTA.map((tipo) => (
                          <SelectItem key={tipo.valor} value={tipo.valor}>
                            {tipo.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Como a pergunta será apresentada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fluxo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fluxo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um fluxo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIPOS_FLUXO.map((fluxo) => (
                          <SelectItem key={fluxo.valor} value={fluxo.valor}>
                            {fluxo.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Em qual fluxo essa pergunta aparece
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pontuacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pontuação: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={([value]) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormDescription>
                      Peso desta pergunta no cálculo do match (0-100)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="obrigatoria"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Obrigatória</FormLabel>
                      <FormDescription>
                        Resposta necessária
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
                name="ativa"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Ativa</FormLabel>
                      <FormDescription>
                        Mostrar no questionário
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
                name="geradaPorIA"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Gerada por IA</FormLabel>
                      <FormDescription>
                        Criada automaticamente
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
            
            {mostrarOpcoes && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <FormLabel>Opções de Resposta</FormLabel>
                  <Button type="button" variant="outline" size="sm" onClick={adicionarOpcao}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Adicionar Opção
                  </Button>
                </div>
                
                {form.watch('opcoes')?.map((_, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <FormField
                      control={form.control}
                      name={`opcoes.${index}.label`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Rótulo da opção"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`opcoes.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Valor interno"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removerOpcao(index)}
                      disabled={(form.watch('opcoes')?.length || 0) <= 1}
                    >
                      <MinusCircle className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </motion.div>
            )}
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {perguntaExistente ? 'Atualizar' : 'Criar'} Pergunta
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
