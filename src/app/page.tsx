"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SimuladorCredito } from "@/components/home/SimuladorCredito";
import { FormularioPreferencias } from "@/components/home/FormularioPreferencias";
import { FormularioImovelIdeal } from "@/components/home/FormularioImovelIdeal";
import { FormularioEmpreendimento } from "@/components/home/FormularioEmpreendimento";
import { FormularioProximidades } from "@/components/home/FormularioProximidades";
import { MapaImoveis } from "@/components/home/MapaImoveis";
import { ResultadoImoveis } from "@/components/home/ResultadoImoveis";
import { enviarRespostas, solicitarRelatorio } from "@/components/home/api-service";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DownloadCloud, MapPin, Loader2, Mail, X } from "lucide-react";
import { enviarRelatorio } from "@/services/relatorio-service";
import { SearchParamsHandler } from "@/components/home/SearchParamsHandler";
import NewRelatorioModal from "@/components/home/RelatorioModal";
import { Poppins } from "next/font/google";
import { ModalAutenticacao } from "@/components/auth/ModalAutenticacao";
import { getUserSession } from "@/lib/auth-client";

// Carregar fonte Poppins
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins'
});

export default function Home() {
  // Estado para dados do usuário vindos de parâmetros
  const [dadosUsuario, setDadosUsuario] = useState<{
    nome?: string;
    email?: string;
    telefone?: string;
    userId?: string;
    token?: string;
    senha?: string;
  }>({});
  
  // Estado para controlar o modal de autenticação
  const [modalAutenticacaoAberto, setModalAutenticacaoAberto] = useState(false);
  const [parametrosUrlRecebidos, setParametrosUrlRecebidos] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState<boolean>(false);
  
  // Estado para respostas do formulário
  const [respostas, setRespostas] = useState<Record<string, any>>({});
  
  // Estado para controle de UI
  const [progresso, setProgresso] = useState(0);
  const [questionarioConcluido, setQuestionarioConcluido] = useState(false);
  const [perguntaRespondida, setPerguntaRespondida] = useState<string | null>(null);
  const [relatorioLoading, setRelatorioLoading] = useState(false);
  const [relatorioSolicitado, setRelatorioSolicitado] = useState(false);
  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);
  const [pinsVisiveis, setPinsVisiveis] = useState(false);
  const [imoveisDestaque, setImoveisDestaque] = useState<any[]>([]);
  const [fluxoAtivo, setFluxoAtivo] = useState<"CREDITO" | "PREFERENCIAS" | "IMOVEL_IDEAL" | "EMPREENDIMENTO" | "PROXIMIDADES" | "CONCLUIDO">("CREDITO");
  const [mostrarModalMatches, setMostrarModalMatches] = useState(false);
  
  const { toast } = useToast();
  
  // Efeito para ativar os pins quando o progresso atingir 30%
  useEffect(() => {
    if (progresso > 30) {
      setPinsVisiveis(true);
    }
  }, [progresso]);

  // Verificar se o usuário está logado e se temos parâmetros na URL
  useEffect(() => {
    // Verificar se temos parâmetros na URL
    const temParametros = Object.keys(dadosUsuario).length > 0;
    setParametrosUrlRecebidos(temParametros);
    
    // Verificar se o usuário está logado
    async function verificarSessao() {
      try {
        // Verificar se há um token no localStorage como alternativa rápida
        let usuarioAutenticado = false;
        const localUser = localStorage.getItem('user-session');
        if (localUser) {
          try {
            const userData = JSON.parse(localUser);
            if (userData && userData.id) {
              usuarioAutenticado = true;
              setUsuarioLogado(true);
            }
          } catch (e) {
            console.warn('Erro ao ler dados do usuário do localStorage:', e);
          }
        }
        
        // Mesmo assim, tentar obter a sessão da API para manter os dados atualizados
        const sessao = await getUserSession();
        if (sessao) {
          setUsuarioLogado(true);
          usuarioAutenticado = true;
          // Atualizar o localStorage com os dados mais recentes
          localStorage.setItem('user-session', JSON.stringify(sessao));
        }
        
        // Se não houver parâmetros e não temos dados de usuário, mostrar o modal de autenticação
        // Agora mostramos o modal independentemente do usuário estar logado ou não
        if (!temParametros && !dadosUsuario.userId) {
          // Pequeno delay para garantir que a página carregue completamente
          const timer = setTimeout(() => {
            setModalAutenticacaoAberto(true);
          }, 1000);
          
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        // Em caso de erro, verificar se temos parâmetros e mostrar o modal se necessário
        if (!temParametros && !dadosUsuario.userId) {
          const timer = setTimeout(() => {
            setModalAutenticacaoAberto(true);
          }, 1000);
          
          return () => clearTimeout(timer);
        }
      }
    }
    
    verificarSessao();
  }, [dadosUsuario.userId]);

  // Efeito para criar o usuário automaticamente quando receber dados do formulário do Elementor
  useEffect(() => {
    const registrarUsuarioAutomatico = async () => {
      // Só prosseguir se tivermos nome e email
      if (dadosUsuario.nome && dadosUsuario.email && !dadosUsuario.userId) {
        try {
          console.log('Iniciando registro automático do usuário...', dadosUsuario);
          
          const response = await fetch('/api/usuarios/auto-registro', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nome: dadosUsuario.nome,
              email: dadosUsuario.email,
              telefone: dadosUsuario.telefone || ''
            })
          });
          
          if (!response.ok) {
            throw new Error('Erro ao registrar usuário');
          }
          
          const data = await response.json();
          console.log('Resposta do registro automático:', data);
          
          if (data.success) {
            // Atualizar dados do usuário com ID e token
            setDadosUsuario(prev => ({
              ...prev,
              userId: data.userId,
              token: data.token,
              senha: data.senhaGerada
            }));
            
            // Mostrar mensagem de boas-vindas
            if (data.isNew) {
              toast({
                title: `Olá, ${dadosUsuario.nome}!`,
                description: "Conta criada automaticamente. Use seu email para acessar o painel quando precisar.",
                variant: "default",
              });
            } else {
              toast({
                title: `Bem-vindo de volta, ${dadosUsuario.nome}!`,
                description: "Suas preferências anteriores foram carregadas.",
                variant: "default",
              });
            }
            
            // Atualizar respostas com dados do usuário
            setRespostas(prev => ({
              ...prev,
              userId: data.userId,
              nome: dadosUsuario.nome,
              email: dadosUsuario.email,
              telefone: dadosUsuario.telefone
            }));
          }
        } catch (error) {
          console.error('Erro ao registrar usuário:', error);
          toast({
            title: "Erro ao processar seus dados",
            description: "Houve um problema ao registrar seus dados. Tente novamente mais tarde.",
            variant: "destructive",
          });
        }
      }
    };
    
    registrarUsuarioAutomatico();
  }, [dadosUsuario.nome, dadosUsuario.email, dadosUsuario.telefone, dadosUsuario.userId, toast]);
  
  // Manipular a resposta do formulário de crédito
  const handleQuestionarioConcluido = async (respostasFinais: Record<string, any>) => {
    console.log("Respostas do formulário atual:", Object.keys(respostasFinais).length, "respostas");
    
    // Verificar a etapa atual do fluxo
    const fluxoAtual = respostasFinais.fluxo;
    console.log("Fluxo atual concluído:", fluxoAtual);
    
    // Garantir que temos o userId nas respostas (do registro automático)
    if (dadosUsuario.userId && !respostasFinais.userId) {
      respostasFinais.userId = dadosUsuario.userId;
      console.log('Adicionando userId às respostas:', dadosUsuario.userId);
    }
    
    // Atualizar respostas gerais
    setRespostas(prev => ({
      ...prev,
      ...respostasFinais
    }));
    
    // Verificar qual fluxo foi concluído e avançar para o próximo
    if (fluxoAtual === "INFORMACOES_COMPLEMENTARES") {
      // Avançar para o próximo fluxo: PREFERENCIAS
      setProgresso(65); // Incrementamos, mas não chegamos a 100% ainda
      
      // Mostrar notificação de transição
      toast({
        title: "Vamos descobrir suas preferências!",
        description: "Agora vamos identificar o bairro e região ideal para você.",
        variant: "default",
      });
      
      // Atualizar respostas e avançar para o fluxo de preferências
      setRespostas(prev => ({
        ...prev,
        fluxoAtual: "PREFERENCIAS"
      }));
      
      // Ativar o formulário de preferências
      setFluxoAtivo("PREFERENCIAS");
    } else if (respostasFinais.fluxoAtual === "PREFERENCIAS") {
      // Quando terminar o fluxo de preferências, avançar para Imóvel Ideal
      setProgresso(80);
      
      toast({
        title: "Agora, seu imóvel ideal!",
        description: "Vamos descobrir as características do imóvel perfeito para você.",
        variant: "default",
      });
      
      // Atualizar fluxo para IMOVEL_IDEAL
      setRespostas(prev => ({
        ...prev,
        fluxoAtual: "IMOVEL_IDEAL"
      }));
      
      // Ativar o formulário de imóvel ideal
      setFluxoAtivo("IMOVEL_IDEAL");
    } else if (respostasFinais.fluxoAtual === "IMOVEL_IDEAL") {
      // Quando terminar o fluxo de imóvel ideal, avançar para Empreendimento
      setProgresso(90);
      
      toast({
        title: "Quase lá! Vamos falar sobre o empreendimento",
        description: "Conte-nos suas preferências para áreas comuns e características do condomínio.",
        variant: "default",
      });
      
      // Atualizar fluxo para EMPREENDIMENTO
      setRespostas(prev => ({
        ...prev,
        fluxoAtual: "EMPREENDIMENTO"
      }));
      
      // Ativar o formulário de empreendimento
      setFluxoAtivo("EMPREENDIMENTO");
    } else if (respostasFinais.fluxoAtual === "EMPREENDIMENTO") {
      // Quando terminar o fluxo de empreendimento, avançar para Proximidades
      setProgresso(95);
      
      toast({
        title: "Última etapa: Proximidades",
        description: "Vamos descobrir o que deve estar perto do seu imóvel ideal.",
        variant: "default",
      });
      
      // Atualizar fluxo para PROXIMIDADES
      setRespostas(prev => ({
        ...prev,
        fluxoAtual: "PROXIMIDADES"
      }));
      
      // Ativar o formulário de proximidades
      setFluxoAtivo("PROXIMIDADES");
    } else if (respostasFinais.fluxoAtual === "PROXIMIDADES") {
      // Quando terminar o fluxo de proximidades, concluir todo o processo
      setProgresso(100);
      
      toast({
        title: "Encontramos seu imóvel ideal!",
        description: "Agora você pode visualizar as opções disponíveis no mapa.",
        variant: "default",
      });
      
      // Marcar como concluído e ativar os pins no mapa
      setFluxoAtivo("CONCLUIDO");
      setQuestionarioConcluido(true);
      setPinsVisiveis(true);
    } else {
      // Se for outro fluxo ou o último, finalizar o processo
      setQuestionarioConcluido(true);
      // Forçar progresso a 100% quando o formulário for concluído
      setProgresso(100);
      setPinsVisiveis(true);
    }
    
    // Enviar respostas para o backend
    try {
      const sucesso = await enviarRespostas(respostasFinais, dadosUsuario);
      if (sucesso) {
        toast({
          title: "Respostas enviadas",
          description: "Suas respostas foram registradas com sucesso.",
          variant: "default",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível enviar suas respostas. Tentaremos novamente mais tarde.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar respostas:", error);
    }
  };
  
  // Atualizar progresso do questionário
  const handleProgressoAtualizado = (novoProgresso: number) => {
    setProgresso(novoProgresso);
  };
  
  // Resposta de uma pergunta
  const handlePerguntaRespondida = (perguntaId: string, resposta: any) => {
    setPerguntaRespondida(perguntaId);
    setRespostas((prev) => ({ ...prev, [perguntaId]: resposta }));
  };
  
  // Função para solicitar relatório
  const handleSolicitarRelatorio = async () => {
    // Iniciar loading
    setRelatorioLoading(true);
    
    try {
      // IMPORTANTE: Usar exatamente os mesmos parâmetros que o mapa interativo para garantir consistência
      const valorMaximo = respostas.valorMaximoImovel || respostas.valorImovel;
      const parametrosUrl = construirParametrosUrl();
      
      console.log('\u2757\ufe0f Usando os mesmos parâmetros do mapa interativo:', parametrosUrl);
      
      // Primeiro tentar buscar os imóveis do iframe do mapa interativo
      try {
        // Acessar o iframe do mapa interativo
        const mapaFrame = document.querySelector('iframe[src*="mapa-interativo"]');
        let imoveisDoMapa = [];
        
        if (mapaFrame) {
          // Tenta usar a comunicação de mensagens para obter os imóveis do iframe
          // Isso seria ideal, mas requer implementação no mapa-interativo/page.tsx
          console.log('\u2757\ufe0f Tentando obter imóveis do iframe do mapa');
          // Esta funcionalidade requer implementação adicional em mapa-interativo/page.tsx
        }
        
        // Se não conseguiu obter do iframe, busca diretamente da API com os mesmos parâmetros
        if (imoveisDoMapa.length === 0) {
          // IMPORTANTE: Os logs indicam que a API do mapa usa outro formato: { preco: { lte: valor } }
          // em vez de valorMaximo=valor, vamos ajustar isso
          
          // Construir filtros exatamente como o mapa interativo
          const valorMaximo = respostas.valorMaximoImovel || respostas.valorImovel;
          let url = `/api/imoveis?ativo=true`;
          
          // Usar o mesmo formato que aparece nos logs: preco.lte em vez de valorMaximo
          if (valorMaximo) url += `&preco.lte=${valorMaximo}`;
          if (respostas.quartos) url += `&quartos=${respostas.quartos}`;
          if (respostas.banheiros) url += `&banheiros=${respostas.banheiros}`;
          if (respostas.tipoImovel) url += `&tipoImovel=${respostas.tipoImovel}`;
          
          console.log('\u2757\ufe0f Buscando imóveis com filtros CORRIGIDOS para bater com o mapa:', url);
          
          const response = await fetch(url);
          if (response.ok) {
            const imoveisData = await response.json();
            console.log(`\u2705 Encontrados ${imoveisData.length} imóveis para o relatório`);
            
            // Aplicar o mesmo algoritmo de cálculo de match percentage que o mapa interativo usa
            const filtros: Record<string, any> = {};
            if (valorMaximo) filtros.valorMaximo = valorMaximo;
            if (respostas.quartos) filtros.quartos = respostas.quartos;
            if (respostas.banheiros) filtros.banheiros = respostas.banheiros;
            if (respostas.tipoImovel) filtros.tipoImovel = respostas.tipoImovel;
            
            // Replicar EXATAMENTE o mesmo algoritmo do mapa interativo
            const imoveisComMatch = imoveisData.map((imovel: any) => {
              let pontos = 0;
              let totalPossivel = 0;
              
              // Copiar os mesmos critérios e pesos do mapa interativo
              const criterios = [
                { campo: 'quartos', peso: 25 },
                { campo: 'banheiros', peso: 15 },
                { campo: 'area', peso: 20 },
                { campo: 'preco', peso: 30 },
                { campo: 'bairro', peso: 10 }
              ];
              
              // Aplicar exatamente o mesmo cálculo que o mapa interativo usa
              criterios.forEach(criterio => {
                totalPossivel += criterio.peso;
                
                switch (criterio.campo) {
                  case 'quartos':
                    if (filtros.quartos && imovel.quartos) {
                      const diff = Math.abs(filtros.quartos - imovel.quartos);
                      if (diff === 0) pontos += criterio.peso;
                      else if (diff === 1) pontos += criterio.peso * 0.5;
                    }
                    break;
                    
                  case 'banheiros':
                    if (filtros.banheiros && imovel.banheiros) {
                      const diff = Math.abs(filtros.banheiros - imovel.banheiros);
                      if (diff === 0) pontos += criterio.peso;
                      else if (diff === 1) pontos += criterio.peso * 0.5;
                    }
                    break;
                    
                  case 'area':
                    if (filtros.area && imovel.area) {
                      const areaDiff = Math.abs(filtros.area - imovel.area) / filtros.area;
                      if (areaDiff <= 0.1) pontos += criterio.peso;
                      else if (areaDiff <= 0.2) pontos += criterio.peso * 0.7;
                      else if (areaDiff <= 0.3) pontos += criterio.peso * 0.4;
                    }
                    break;
                    
                  case 'preco':
                    if (valorMaximo && imovel.preco) {
                      if (imovel.preco <= valorMaximo) {
                        pontos += criterio.peso;
                      } else {
                        const diff = (imovel.preco - valorMaximo) / valorMaximo;
                        if (diff <= 0.1) pontos += criterio.peso * 0.7;
                        else if (diff <= 0.2) pontos += criterio.peso * 0.3;
                      }
                    }
                    break;
                    
                  case 'bairro':
                    if (filtros.bairro && imovel.bairro) {
                      if (imovel.bairro.toLowerCase().includes(filtros.bairro.toLowerCase())) {
                        pontos += criterio.peso;
                      }
                    }
                    break;
                }
              });
              
              // Adicionar pontos para imóveis em destaque (igual ao mapa)
              if (imovel.destaque) {
                pontos += 10;
                totalPossivel += 10;
              }
              
              // Mesmo cálculo final
              const matchPercentage = Math.min(Math.round((pontos / totalPossivel) * 100), 98);
              return { ...imovel, matchPercentage };
            });
            
            // Ordenar por match percentage (maior para menor)
            imoveisComMatch.sort((a: any, b: any) => b.matchPercentage - a.matchPercentage);
            
            // Filtrar apenas imóveis com match >= 80% e pegar os 3 primeiros
            // IMPORTANTE: Exatamente igual à lógica do mapa interativo
            const imoveisDestacados = imoveisComMatch
              .filter((imovel: any) => imovel.matchPercentage >= 80)
              .slice(0, 3)
              .map((imovel: any) => ({ ...imovel, destaque: true }));
              
            if (imoveisDestacados.length > 0) {
              setImoveisDestaque(imoveisDestacados);
              console.log(`\u2705 ${imoveisDestacados.length} imóveis destacados com match >= 80% encontrados!`);
            } else {
              // Fallback: se não houver imóveis com match >= 80%, pegar os 3 com maior match
              const melhoresImoveis = imoveisComMatch.slice(0, 3);
              setImoveisDestaque(melhoresImoveis);
              console.log('\u26a0\ufe0f Usando os 3 melhores matches disponíveis (todos abaixo de 80%)');  
            }
          } else {
            console.error('Erro ao buscar imóveis:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar imóveis do mapa:', error);
      }
      
      // Obter email do usuário logado da sessão (garantindo que sempre teremos um email)
      let emailUsuario = '';
      
      // Verificar se temos o email do usuário logado
      try {
        const localUser = localStorage.getItem('user-session');
        if (localUser) {
          const userData = JSON.parse(localUser);
          if (userData && userData.email) {
            emailUsuario = userData.email;
            console.log('\u2705 Usando email do usuário logado:', emailUsuario);
          }
        }
      } catch (error) {
        console.error('Erro ao obter email do usuário logado:', error);
      }
      
      // IMPORTANTE: Verificar se temos os imóveis corretamente
      console.log('\u2705 Imóveis para enviar no relatório:', JSON.stringify(imoveisDestaque));
      
      let imoveisFinais = [...imoveisDestaque]; // Criar uma cópia para manipulação
      
      if (!imoveisFinais || imoveisFinais.length === 0) {
        console.error('\u26a0\ufe0f ALERTA: Não há imóveis para incluir no relatório. Verificando imóveis novamente...');
        // Tentar recuperar imóveis do mapa interativo novamente
        try {
          // Buscar o iframe e garantir que ele existe e tem contentWindow
          const iframe = document.querySelector('iframe[title="Mapa Interativo"]') as HTMLIFrameElement;
          // Verificação robusta para contentWindow
          const iframeWindow = iframe?.contentWindow;
          if (iframeWindow) {
            const imoveisSelecionados = await new Promise<any[]>((resolve) => {
              // Função que será chamada pelo iframe
              (window as any).receberImoveisSelecionados = (imoveis: any[]) => {
                resolve(imoveis);
              };
              
              // Pedir ao iframe para enviar os imóveis selecionados - com verificação explícita de null
              if (iframeWindow) {
                iframeWindow.postMessage('enviarImoveisSelecionados', '*');
              }
              
              // Timeout caso o iframe não responda
              setTimeout(() => resolve([]), 2000);
            });
            
            if (imoveisSelecionados.length > 0) {
              console.log('\u2705 Recuperados imóveis do iframe:', imoveisSelecionados.length, 'imóveis');
              imoveisFinais = imoveisSelecionados;
              setImoveisDestaque(imoveisSelecionados); // Atualizar state em vez de modificar diretamente
            }
          }
        } catch (error) {
          console.error('Erro ao tentar recuperar imóveis do iframe:', error);
        }
      }
      
      // Salvar imóveis recomendados no localStorage para exibir no painel do cliente
      try {
        // Filtrar apenas os imóveis que têm destaque=true para garantir que sejam os mesmos do mapa
        const imoveisDestaqueReal = (imoveisFinais || []).filter(imovel => imovel.destaque === true);
        
        // Log para debugging
        console.log('✅ Usando apenas imóveis com destaque=true para relatório:', 
          imoveisDestaqueReal.length > 0 ? imoveisDestaqueReal.length : 'NENHUM ENCONTRADO! Usando todos disponíveis.');
        
        // Se não houver imóveis com destaque, usar os primeiros 3 disponíveis
        const imoveisParaSalvar = imoveisDestaqueReal.length > 0 ? imoveisDestaqueReal : (imoveisFinais || []).slice(0, 3);
        
        // Converter para formato simplificado
        const imoveisSimpificados = imoveisParaSalvar.map(imovel => ({
          id: imovel.id,
          titulo: imovel.titulo,
          descricao: imovel.descricao,
          preco: imovel.preco,
          endereco: imovel.endereco,
          bairro: imovel.bairro,
          cidade: imovel.cidade,
          estado: imovel.estado,
          caracteristicas: imovel.caracteristicas,
          area: imovel.area,
          quartos: imovel.quartos,
          banheiros: imovel.banheiros,
          vagas: imovel.vagas,
          fotos: imovel.fotos?.slice(0, 1) || [], // Apenas a primeira foto
          matchPercentage: imovel.matchPercentage, // Importante: preservar a porcentagem de match
          dataRecomendacao: new Date().toISOString()
        }));
        
        if (imoveisSimpificados.length > 0) {
          localStorage.setItem('imovia-imoveis-recomendados', JSON.stringify(imoveisSimpificados));
          console.log('✅ Imóveis salvos no localStorage com sucesso:', imoveisSimpificados.length);
        }
      } catch (error) {
        console.error('Erro ao salvar imóveis no localStorage:', error);
      }
      
      // Preparar dados para o relatório
      const dadosRelatorio = {
        nome: dadosUsuario.nome,
        email: emailUsuario || dadosUsuario.email || respostas.email || 'suporte@vyzer.com.br', // Garantir que sempre teremos um email
        telefone: dadosUsuario.telefone || respostas.telefone,
        // Informações financeiras - garantir que a renda mensal seja passada corretamente
        // O valor da renda mensal do slider está dentro de simulacaoInicial
        rendaMensal: Number(
          respostas.simulacaoInicial?.rendaMensal || // Valor do SimuladorAprovacaoInicial
          respostas.rendaMensal || // Fallback para outros fluxos
          respostas.renda || // Compatibilidade com nome alternativo
          0
        ), // Converter para número
        valorMaximoImovel: valorMaximo,
        // Dados do simulador de aprovação inicial
        valorParcelaMaxima: respostas.simulacaoInicial?.valorParcelaMaxima,
        temOutrosEmprestimos: respostas.simulacaoInicial?.temOutrosEmprestimos,
        
        // Dados do simulador de crédito
        fluxoSimulador: respostas.fluxo,
        // Campos do fluxo COM_APROVACAO
        cpf: respostas.cpf,
        estadoCivil: respostas.estadoCivil,
        comprovanteRenda: respostas.comprovanteRenda,
        comprovanteEndereco: respostas.comprovanteEndereco,
        carteiraTrabalho: respostas.carteiraTrabalho,
        irpf: respostas.irpf,
        escolaridade: respostas.escolaridade,
        outrosCompradores: respostas.outrosCompradores,
        // Campos do fluxo SEM_APROVACAO
        rendaMensalFaixa: respostas.rendaMensal, // Este é diferente do rendaMensal numérico
        outrosFinanciamentos: respostas.outrosFinanciamentos,
        dataNascimento: respostas.dataNascimento, 
        fgts: respostas.fgts,
        prazoFinanciamento: respostas.prazoFinanciamento,
        
        // Preferências de localização
        cidade: respostas.cidade,
        localTrabalho: respostas.localTrabalho,
        localEscola: respostas.localEscola,
        
        // Preferências de empreendimento
        importanciaPisoQuartos: respostas.importanciaPisoQuartos,
        importanciaAcademia: respostas.importanciaAcademia,
        importanciaPiscina: respostas.importanciaPiscina,
        tipoPortaria: respostas.tipoPortaria,
        importanciaSalaoFestas: respostas.importanciaSalaoFestas,
        importanciaPlayground: respostas.importanciaPlayground,
        importanciaEspacoPet: respostas.importanciaEspacoPet,
        
        // Preferências de proximidades
        importanciaParques: respostas.importanciaParques,
        importanciaShoppings: respostas.importanciaShoppings,
        importanciaRestaurantes: respostas.importanciaRestaurantes,
        importanciaCaminhabilidade: respostas.importanciaCaminhabilidade,
        temPet: respostas.temPet,
        importanciaEscolas: respostas.importanciaEscolas,
        importanciaTransporte: respostas.importanciaTransporte,
        
        // Preferências de imóvel
        tipoImovel: respostas.tipoImovel,
        caracteristicas: Array.isArray(respostas.caracteristicas) 
          ? respostas.caracteristicas 
          : respostas.caracteristicas?.split(','),
        bairrosInteresse: Array.isArray(respostas.bairros) 
          ? respostas.bairros 
          : (respostas.bairros ? [respostas.bairros] : []),
        proximidades: Array.isArray(respostas.proximidades) 
          ? respostas.proximidades 
          : (respostas.proximidades ? respostas.proximidades.split(',') : []),
        // CRUCIAL: Usar imoveisFinais que pode ter sido atualizado com os imóveis do iframe
        imoveisRecomendados: imoveisFinais || [],
        dataEnvio: new Date().toLocaleDateString('pt-BR')
      };
      
      // Verificação final antes de enviar
      if (!dadosRelatorio.imoveisRecomendados || dadosRelatorio.imoveisRecomendados.length === 0) {
        console.error('\u26a0\ufe0f ALERTA FINAL: Ainda não há imóveis para enviar no relatório!');
      } else {
        console.log('\u2705 Enviando relatório por email com', dadosRelatorio.imoveisRecomendados.length, 'imóveis');
      }
      
      // Enviar email com o relatório
      if (dadosRelatorio.email) {
        const emailEnviado = await enviarRelatorio(dadosRelatorio);
        
        if (emailEnviado) {
          toast({
            title: "Relatório enviado!",
            description: `Enviamos um relatório detalhado para ${dadosRelatorio.email}`,
            variant: "default",
          });
        } else {
          console.error('Falha ao enviar email');
        }
      } else {
        console.warn('Email não disponível para envio do relatório');
      }
      
      // Finalizar loading e mostrar modal
      setRelatorioSolicitado(true);
      setModalRelatorioAberto(true);
    } catch (error) {
      console.error('Erro ao processar relatório:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um problema ao processar seu relatório. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setRelatorioLoading(false);
    }
  };
  
  // Função para fechar o modal de relatório
  const handleFecharModal = () => {
    setModalRelatorioAberto(false);
    // Resetar o estado para permitir que o usuário solicite um novo relatório
    setRelatorioSolicitado(false);
  };
  
  // Função para construir os parâmetros da URL com base nas respostas do questionário
  const construirParametrosUrl = () => {
    if (!respostas || Object.keys(respostas).length === 0) return '';
    
    const params = new URLSearchParams();
    
    // PRIORIDADE: Extrair valor máximo do imóvel do simulador de crédito
    if (respostas.valorMaximoImovel) {
      params.append('valorMaximo', respostas.valorMaximoImovel.toString());
      console.log('Valor máximo do imóvel definido no simulador:', respostas.valorMaximoImovel);
    }
    
    // Extrair parâmetros relevantes das respostas
    if (respostas.quartos) params.append('quartos', respostas.quartos.toString());
    if (respostas.banheiros) params.append('banheiros', respostas.banheiros.toString());
    
    // Tratar valores de preço (caso não tenha sido definido pelo simulador)
    if (!params.has('valorMaximo') && respostas.valorMaximo) {
      params.append('valorMaximo', respostas.valorMaximo.toString());
    }
    if (respostas.valorMinimo) params.append('valorMinimo', respostas.valorMinimo.toString());
    
    // Adicionar área se existir
    if (respostas.area) params.append('area', respostas.area.toString());
    
    // Adicionar bairro se existir
    if (respostas.bairro) params.append('bairro', respostas.bairro);
    
    // Adicionar tipo de imóvel se existir
    if (respostas.tipoImovel) params.append('tipoImovel', respostas.tipoImovel);
    
    // Verificar os campos específicos do formulário que podem estar em locais diferentes
    if (respostas.preferencias?.bairro) params.append('bairro', respostas.preferencias.bairro);
    if (respostas.imovelIdeal?.quartos) params.append('quartos', respostas.imovelIdeal.quartos.toString());
    if (respostas.imovelIdeal?.banheiros) params.append('banheiros', respostas.imovelIdeal.banheiros.toString());
    if (respostas.imovelIdeal?.area) params.append('area', respostas.imovelIdeal.area.toString());
    if (respostas.imovelIdeal?.tipoImovel) params.append('tipoImovel', respostas.imovelIdeal.tipoImovel);
    
    // Adicionar parâmetro para filtrar apenas imóveis ativos
    params.append('ativo', 'true');
    
    const paramString = params.toString();
    return paramString ? `&${paramString}` : '';
  };
  
  return (
    <div className={`min-h-screen overflow-hidden relative bg-gradient-to-b from-white to-gray-50 ${poppins.variable}`}>
      {/* Componente para lidar com parâmetros de URL */}
      <Suspense fallback={null}>
        <SearchParamsHandler setDadosUsuario={setDadosUsuario} />
      </Suspense>
      
      {/* Background Elements - Design Elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Círculos decorativos */}
        <div className="absolute -top-40 -right-20 w-80 h-80 bg-orange-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-orange-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-300 rounded-full opacity-10 blur-2xl" />
        
        {/* Linhas decorativas */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(249, 115, 22, 0.05)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
        
       </div>

      {/* Container principal */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
        {/* Título e descrição */}
        {!questionarioConcluido && (
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600 mb-4 font-poppins leading-tight">
                Inteligência Artificial com a <span className="text-orange-500">i</span>Movia
              </h1>
              <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Responda às perguntas-chave com suas preferências e deixe que a 
                <span className="text-orange-500 font-medium"> iMovia </span> 
                encontre a melhor opção para você em instantes.
              </p>
            </div>
          </motion.div>
        )}
        
        {/* Fundo estático simples - NUNCA MOSTRAR O MAPA NA PÁGINA PRINCIPAL */}
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
          {/* Apenas um gradiente estático */}
          <div className="w-full h-full bg-white"></div>
        </div>
        
        {/* Layout principal */}
        <div className="relative flex flex-col items-center">
          {/* Camada de glassmorphism para formulário - centralizado */}
          <AnimatePresence mode="wait">
            {!questionarioConcluido ? (
              <motion.div
                key="formulario"
                className="relative max-w-2xl min-h-[600px]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <div className="backdrop-blur-md bg-white/60 rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                  {fluxoAtivo === "CREDITO" && (
                    <SimuladorCredito 
                      onComplete={handleQuestionarioConcluido}
                      onProgress={handleProgressoAtualizado}
                      onPerguntaRespondida={handlePerguntaRespondida}
                      dadosUsuario={dadosUsuario}
                    />
                  )}
                  
                  {fluxoAtivo === "PREFERENCIAS" && (
                    <FormularioPreferencias
                      onComplete={handleQuestionarioConcluido}
                      onProgress={handleProgressoAtualizado}
                      onPerguntaRespondida={handlePerguntaRespondida}
                      respostasAnteriores={respostas}
                    />
                  )}

                  {fluxoAtivo === "IMOVEL_IDEAL" && (
                    <FormularioImovelIdeal
                      onComplete={handleQuestionarioConcluido}
                      onProgress={handleProgressoAtualizado}
                      onPerguntaRespondida={handlePerguntaRespondida}
                      respostasAnteriores={respostas}
                    />
                  )}
                  
                  {fluxoAtivo === "EMPREENDIMENTO" && (
                    <FormularioEmpreendimento
                      onComplete={handleQuestionarioConcluido}
                      onProgress={handleProgressoAtualizado}
                      onPerguntaRespondida={handlePerguntaRespondida}
                      respostasAnteriores={respostas}
                    />
                  )}

                  {fluxoAtivo === "PROXIMIDADES" && (
                    <FormularioProximidades
                      onComplete={handleQuestionarioConcluido}
                      onProgress={handleProgressoAtualizado}
                      onPerguntaRespondida={handlePerguntaRespondida}
                      respostasAnteriores={respostas}
                    />
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="w-full max-w-3xl mx-auto text-center mb-16 z-[1]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-3xl p-8">
                  <div className="w-20 h-20 bg-orange-100/50 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-10 h-10 text-orange-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Encontramos seu imóvel ideal!
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Com base nas suas respostas, selecionamos os imóveis perfeitos para você.
                    Explore os pins no mapa e descubra suas opções ideais.
                  </p>
                  {/* Botões em coluna (um acima do outro) */}
                  <div className="flex flex-col space-y-4 w-full max-w-md mx-auto">
                    {/* Botão Ver Matches no Mapa - Laranja degradê pulsante */}
                    <Button
                      onClick={() => setMostrarModalMatches(true)}
                      className="relative bg-[#fe4f17] text-white rounded-full px-8 py-6 text-lg font-bold transition-all duration-300 hover:scale-105 gap-3 shadow-lg overflow-hidden group"
                    >
                      {/* Efeito pulsante animado */}
                      <span className="absolute inset-0 bg-[#fe4f17]/80 rounded-full opacity-0 group-hover:opacity-30 animate-pulse-slow"></span>
                      <span className="absolute inset-0 bg-[#fe4f17]/70 rounded-full animate-pulse-slow opacity-0 group-hover:opacity-20 delay-75"></span>
                      <span className="relative z-10 flex items-center justify-center">
                        <MapPin className="mr-2 h-5 w-5" />
                        Ver Matches no Mapa
                      </span>
                    </Button>
                    
                    {/* Botão Receber relatório por email - Preto */}
                    <Button 
                      onClick={handleSolicitarRelatorio}
                      disabled={relatorioLoading || relatorioSolicitado && !modalRelatorioAberto}
                      className="bg-gray-900 hover:bg-black text-white rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 hover:shadow-lg"
                    >
                      {relatorioLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Gerando relatório...
                        </>
                      ) : relatorioSolicitado && !modalRelatorioAberto ? (
                        <>
                          <DownloadCloud className="mr-2 h-5 w-5" />
                          Relatório solicitado
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-5 w-5" />
                          Receber relatório por email
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Modal de relatório */}
          <NewRelatorioModal 
            isOpen={modalRelatorioAberto} 
            onClose={handleFecharModal}
            isLoading={false}
            imoveis={imoveisDestaque}
            valorMaximo={respostas.valorMaximoImovel || respostas.valorImovel || 0}
            dadosCredito={{
              rendaMensal: respostas.rendaMensal || respostas.renda,
              valorImovel: respostas.valorImovel,
              entradaDisponivel: respostas.entradaDisponivel,
              valorParcelaMaxima: respostas.valorParcelaMaxima,
              temOutrosEmprestimos: respostas.temOutrosEmprestimos,
              score: respostas.score,
              aprovado: respostas.aprovado
            }}
            respostasSimulacao={[
              // Dados básicos
              ...(respostas.tipoImovel ? [{
                pergunta: 'Tipo de imóvel',
                resposta: respostas.tipoImovel
              }] : []),
              ...(respostas.quartos ? [{
                pergunta: 'Quantidade de quartos',
                resposta: respostas.quartos
              }] : []),
              ...(respostas.banheiros ? [{
                pergunta: 'Quantidade de banheiros',
                resposta: respostas.banheiros
              }] : []),
              ...(respostas.area ? [{
                pergunta: 'Área mínima',
                resposta: respostas.area,
                categoria: 'AREA'
              }] : []),
              ...(respostas.vagas ? [{
                pergunta: 'Vagas de garagem',
                resposta: respostas.vagas
              }] : []),
              
              // Preferências de localização
              ...(respostas.bairros ? [{
                pergunta: 'Bairros de interesse',
                resposta: Array.isArray(respostas.bairros) 
                  ? respostas.bairros.join(', ')
                  : respostas.bairros
              }] : []),
              ...(respostas.proximidades ? [{
                pergunta: 'Proximidades desejadas',
                resposta: Array.isArray(respostas.proximidades) 
                  ? respostas.proximidades.join(', ')
                  : respostas.proximidades
              }] : []),
              
              // Características do imóvel
              ...(respostas.caracteristicas ? [{
                pergunta: 'Características desejadas',
                resposta: Array.isArray(respostas.caracteristicas) 
                  ? respostas.caracteristicas.join(', ')
                  : respostas.caracteristicas
              }] : []),
              
              // Dados financeiros adicionais
              ...(respostas.prazoFinanciamento ? [{
                pergunta: 'Prazo de financiamento',
                resposta: `${respostas.prazoFinanciamento} anos`
              }] : []),
              ...(respostas.fgts ? [{
                pergunta: 'Utilização de FGTS',
                resposta: respostas.fgts === 'sim' ? 'Sim' : 'Não'
              }] : [])
            ]}
          />
          
          {/* Modal de autenticação */}
          <ModalAutenticacao 
            isOpen={modalAutenticacaoAberto} 
            onClose={() => setModalAutenticacaoAberto(false)} 
          />
          {/* Modal para exibir pins no mapa */}
          <Dialog open={mostrarModalMatches} onOpenChange={setMostrarModalMatches}>
            <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-hidden">
              <DialogTitle className="sr-only">Mapa de Matches</DialogTitle>
              <div className="relative w-full h-[80vh]">
                <div className="absolute top-3 right-3 z-50">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setMostrarModalMatches(false)}
                    className="rounded-full bg-white/80 hover:bg-white shadow-md"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="w-full h-full">
                  <iframe 
                    src={`/mapa-interativo?modo=matches${construirParametrosUrl()}`} 
                    className="w-full h-full border-0"
                    title="Mapa de Matches"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Instrução para clicar nos pins - exibida após conclusão */}
          {questionarioConcluido && (
            <div 
              className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg text-sm text-gray-700 shadow-sm border border-orange-200 animated-pulse z-50 hover:bg-white hover:shadow-md transition-all cursor-pointer"
              onClick={() => {
                // Acessar a função exposta pelo componente MapaImoveis para mostrar os melhores imóveis
                const mapaElement = document.querySelector('#mapa-imoveis');
                if (mapaElement && (mapaElement as any).mostrarCardsMelhoresImoveis) {
                  (mapaElement as any).mostrarCardsMelhoresImoveis();
                }
              }}
            >
              <span className="flex items-center">
                <MapPin className="h-4 w-4 text-orange-500 mr-1" />
                Mostrar melhores imóveis
              </span>
            </div>
          )}
          
          {/* Nota: Não estamos mais mostrando os cards de imóveis automaticamente */}
          {/* Os cards só aparecerão quando o usuário clicar em um pin no mapa */}
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}
