"use client"

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from "react-hook-form"
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
  texto: z.string().min(3),
  descricao: z.string().optional(),
  tipo: z.string().min(1),
  categoria: z.string().min(1),
  fluxo: z.string().min(1),
  pontuacao: z.number().int().min(0).max(100),
  step: z.number().int().min(1).max(20),
  obrigatoria: z.boolean(),
  ativa: z.boolean(),
  geradaPorIA: z.boolean(),
  mascaraValor: z.boolean().optional(),
  insightIA: z.boolean().optional(),
  mascaraCidade: z.boolean().optional(),
  mascaraBairro: z.boolean().optional(),
  sliderTipo: z.string().optional(),
  sliderMin: z.number().optional(),
  sliderMax: z.number().optional(),
  opcoes: z.array(z.object({
    label: z.string().optional(),
    value: z.string().optional()
  })).optional().or(z.undefined())
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
      texto: '',
      descricao: '',
      tipo: '',
      categoria: '',
      fluxo: '',
      step: 1,
      obrigatoria: true,
      ativa: true,
      geradaPorIA: false,
      mascaraValor: false,
      insightIA: false,
      mascaraCidade: false,
      mascaraBairro: false,
      opcoes: perguntaExistente?.opcoes ? 
        Object.entries(perguntaExistente.opcoes).map(([value, label]) => ({ value, label: label as string })) : 
        []
    }
  })
  
  // Gerenciar array de opções
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "opcoes"
  })
  
  // Resetar formulário quando a pergunta para editar mudar
  useEffect(() => {
    if (open) {
      // Mapear as opções do objeto para array se existirem
      const opcoesArray = perguntaExistente?.opcoes ? 
        Object.entries(perguntaExistente.opcoes).map(([value, label]) => ({ value, label: label as string })) : 
        [];
      
      // Resetar o formulário com os novos valores
      form.reset({
        texto: perguntaExistente?.texto || '',
        descricao: perguntaExistente?.descricao || '',
        tipo: perguntaExistente?.tipo || '',
        categoria: perguntaExistente?.categoria || '',
        fluxo: perguntaExistente?.fluxo || '',
        step: perguntaExistente?.step || 1,
        pontuacao: perguntaExistente?.pontuacao || 1,
        obrigatoria: perguntaExistente?.obrigatoria ?? true,
        ativa: perguntaExistente?.ativa ?? true,
        geradaPorIA: perguntaExistente?.geradaPorIA ?? false,
        mascaraValor: perguntaExistente?.mascaraValor ?? false,
        insightIA: perguntaExistente?.insightIA ?? false,
        mascaraCidade: perguntaExistente?.mascaraCidade ?? false,
        mascaraBairro: perguntaExistente?.mascaraBairro ?? false,
        opcoes: opcoesArray
      });
      
      // Log para debug
      console.log('=== RESET FORMULÁRIO ===');
      console.log('Pergunta existente:', perguntaExistente);
      console.log('Campo mascaraValor da pergunta:', perguntaExistente?.mascaraValor);
      console.log('Valor sendo setado:', perguntaExistente?.mascaraValor ?? false);
    }
  }, [perguntaExistente, open, form]);
  
  // Observar mudanças no tipo da pergunta para mostrar/esconder opções
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'tipo') {
        const tipoSelecionado = value.tipo
        const tiposComOpcoes = [
          'select', 'seleção', 'selecao', 'dropdown', 'Seleção',
          'radio', 'checkbox', 'slider', 'range',
          'escolha única', 'escolha unica', 'escolha_unica', 'Escolha única',
          'múltipla escolha', 'multipla escolha', 'multiple_choice', 'multipla_escolha', 'Múltipla escolha'
        ]
        setMostrarOpcoes(tiposComOpcoes.includes(tipoSelecionado || ''))
      }
    })
    
    // Verificar inicialmente - incluir tipos em português
    const tipoAtual = form.getValues('tipo')
    const tiposComOpcoes = [
      'select', 'radio', 'checkbox', 'slider', 'range',
      'seleção', 'selecao', 'dropdown', 'Seleção',
      'escolha única', 'escolha unica', 'escolha_unica', 'Escolha única',
      'múltipla escolha', 'multipla escolha', 'multiple_choice', 'multipla_escolha', 'Múltipla escolha'
    ]
    setMostrarOpcoes(tiposComOpcoes.includes(tipoAtual))
    
    return () => subscription.unsubscribe()
  }, [form])
  
  // Função para adicionar nova opção
  const adicionarOpcao = () => {
    append({ label: '', value: '' })
  }
  
  // Função para remover opção
  const removerOpcao = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }
  
  // Função para processar o envio do formulário
  const onSubmit = async (values: z.infer<typeof perguntaFormSchema>) => {
    try {
      console.log('Form values antes da conversão:', values);
      
      // Usar TODOS os valores do form diretamente
      const dadosParaEnviar: any = { ...values };
      
      // Remover opcoes se vazio e não necessário
      if (!mostrarOpcoes || !values.opcoes || values.opcoes.length === 0) {
        delete dadosParaEnviar.opcoes;
      }
      
      // Converter array de opções para objeto se necessário
      if (mostrarOpcoes && values.opcoes && values.opcoes.length > 0) {
        const opcoesObj = values.opcoes.reduce((acc, opt) => {
          if (opt.value && opt.label) {
            acc[opt.value] = opt.label
          }
          return acc
        }, {} as Record<string, string>);
        
        if (Object.keys(opcoesObj).length > 0) {
          dadosParaEnviar.opcoes = opcoesObj;
        }
      }
      
      console.log('DADOS FINAIS PARA ENVIAR:', dadosParaEnviar);
      
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
        step: form.getValues('step'),
        obrigatoria: form.getValues('obrigatoria'),
        ativa: form.getValues('ativa'),
        geradaPorIA: form.getValues('geradaPorIA'),
        mascaraValor: form.getValues('mascaraValor'),
        insightIA: form.getValues('insightIA'),
        mascaraCidade: form.getValues('mascaraCidade'),
        mascaraBairro: form.getValues('mascaraBairro')
      };
      
      // Tratar opções apenas se o tipo de pergunta necessitar
      let opcoesObj = {};
      const tiposComOpcoes = [
        'select', 'radio', 'checkbox', 'priority',
        'seleção', 'selecao', 'dropdown',
        'escolha única', 'escolha unica', 'escolha_unica',
        'múltipla escolha', 'multipla escolha', 'multiple_choice', 'multipla_escolha'
      ];
      
      if (tiposComOpcoes.includes(formValues.tipo)) {
        const opcoes = form.getValues('opcoes') || [];
        console.log('Opções encontradas:', opcoes);
        
        opcoesObj = opcoes.reduce((acc: Record<string, string>, opt: any) => {
          if (opt.value && opt.label) {
            acc[opt.value] = opt.label;
          }
          return acc;
        }, {});
        
        console.log('Opções processadas:', opcoesObj);
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
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione uma descrição ou instrução adicional..."
                      className="min-h-[60px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Aparecerá como texto auxiliar embaixo da pergunta
                  </FormDescription>
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
                name="step"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Step/Etapa</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      Agrupar perguntas na mesma etapa (1-20)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
              
              <FormField
                control={form.control}
                name="mascaraValor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Máscara R$</FormLabel>
                      <FormDescription>
                        Formato monetário
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={(value) => {
                          console.log('Switch mascaraValor mudou para:', value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="insightIA"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Insight IA</FormLabel>
                      <FormDescription>
                        Gerar insight dinâmico
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mascaraCidade"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Máscara Cidade</FormLabel>
                      <FormDescription>
                        API de cidades
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mascaraBairro"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Máscara Bairro</FormLabel>
                      <FormDescription>
                        API de bairros
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
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
                {/* Configuração específica para Slider */}
                {(form.watch('tipo') === 'slider' || form.watch('tipo') === 'range') && (
                  <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <FormLabel className="text-blue-700 font-semibold">Configurações do Slider</FormLabel>
                    </div>
                    
                    {/* Tipo de Dado */}
                    <FormField
                      control={form.control}
                      name="sliderTipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Dados</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de dado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="numero">🔢 Número Simples</SelectItem>
                              <SelectItem value="real">💰 Valor em Reais (R$)</SelectItem>
                              <SelectItem value="ponto">⭐ Pontuação/Score</SelectItem>
                              <SelectItem value="porcentagem">📊 Porcentagem (%)</SelectItem>
                              <SelectItem value="metros">📏 Metros (m)</SelectItem>
                              <SelectItem value="anos">📅 Anos</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Define como o valor será exibido e formatado
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    {/* Valores Min, Max e Step */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="sliderMin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor Mínimo</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="sliderMax"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor Máximo</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="100"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 100)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <FormLabel>Incremento</FormLabel>
                        <Input
                          type="number"
                          placeholder="1"
                          step="0.01"
                          onChange={(e) => {
                            const opcoes = form.getValues('opcoes') || [{ label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }]
                            opcoes[2] = { ...opcoes[2], label: 'step', value: e.target.value }
                            form.setValue('opcoes', opcoes)
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">Quanto o valor muda a cada movimento</p>
                      </div>
                    </div>
                    
                    {/* Preview do Slider */}
                    <div className="mt-4 p-3 bg-white rounded border">
                      <FormLabel className="text-sm text-gray-600">Preview:</FormLabel>
                      <div className="mt-2">
                        <Slider
                          value={[form.watch('sliderMin') || 0]}
                          min={form.watch('sliderMin') || 0}
                          max={form.watch('sliderMax') || 100}
                          step={1}
                          className="w-full"
                          disabled
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{form.watch('sliderMin') || 0}</span>
                          <span>{form.watch('sliderMax') || 100}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Opções normais para select, radio, checkbox */}
                {!['slider', 'range'].includes(form.watch('tipo') || '') && (
                  <>
                    <div className="flex items-center justify-between">
                      <FormLabel>Opções de Resposta</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={adicionarOpcao}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Adicionar Opção
                      </Button>
                    </div>
                
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-center">
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
                      disabled={fields.length <= 1}
                    >
                      <MinusCircle className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                ))}
                  </>
                )}
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
