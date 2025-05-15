import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { enviarEmail } from "@/services/email-service";

// Função para gerar senha aleatória
function gerarSenhaAleatoria(length = 8) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let senha = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % caracteres.length;
    senha += caracteres.charAt(randomIndex);
  }
  
  return senha;
}

// GET - Lista todos os clientes
export async function GET(request: NextRequest) {
  try {
    // Obter parâmetros de filtro/paginação da URL, se necessário
    const { searchParams } = new URL(request.url);
    const termo = searchParams.get('termo') || '';
    const status = searchParams.get('status') || '';
    
    // Buscar clientes reais do banco de dados
    console.log('Buscando clientes reais do banco de dados');
    
    // Consultar todos os usuários com role=CLIENTE do banco de dados via Prisma
    const clientesDB = await prisma.user.findMany({
      where: {
        role: 'CLIENTE'
      },
      include: {
        respostas: {
          include: {
            pergunta: true // Incluir a pergunta relacionada para ter acesso à categoria
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Mais recentes primeiro
      }
    });
    
    console.log(`Encontrados ${clientesDB.length} clientes no banco de dados`);
    
    // Mapear os clientes do banco para o formato esperado pela UI
    const clientesMapeados = clientesDB.map(cliente => {
      // Tentar extrair interesses das respostas
      const interesses: string[] = [];
      if (cliente.respostas.length > 0) {
        // Verificar respostas que possam indicar interesses (exemplo simplificado)
        const respostasInteresse = cliente.respostas.filter(r => 
          r.pergunta.categoria === 'PREFERENCIAS' || r.pergunta.categoria === 'IMOVEL_IDEAL'
        );
        
        // Adicionar valores únicos aos interesses
        respostasInteresse.forEach(resposta => {
          if (resposta.valor && !interesses.includes(resposta.valor)) {
            interesses.push(resposta.valor);
          }
        });
      }
      
      return {
        id: cliente.id,
        name: cliente.name,
        email: cliente.email,
        telefone: cliente.telefone || '',
        role: cliente.role,
        createdAt: cliente.createdAt.toISOString(),
        updatedAt: cliente.updatedAt.toISOString(),
        status: 'ativo', // Por padrão consideramos ativos
        origem: cliente.respostas.length > 0 ? 'Site Externo' : 'Cadastro Local',
        interesses: interesses.length > 0 ? interesses : ['Não especificado']
      };
    });
    
    // Filtrar clientes conforme os parâmetros
    let clientesFiltrados = clientesMapeados;
    
    // Filtrar por termo de busca
    if (termo) {
      const termoLower = termo.toLowerCase();
      clientesFiltrados = clientesFiltrados.filter(cliente => 
        cliente.name.toLowerCase().includes(termoLower) ||
        cliente.email.toLowerCase().includes(termoLower) ||
        cliente.telefone.includes(termo)
      );
    }
    
    // Filtrar por status
    if (status) {
      clientesFiltrados = clientesFiltrados.filter(cliente => 
        cliente.status === status
      );
    }
    
    // Em um ambiente de produção, descomentar o código abaixo
    // const clientes = await prisma.user.findMany({
    //   where: { role: 'CLIENTE' as const },
    //   orderBy: { createdAt: 'desc' },
    //   select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //     telefone: true,
    //     role: true,
    
    console.log(`Retornando ${clientesFiltrados.length} clientes filtrados`);
    
    return NextResponse.json({
      clientes: clientesFiltrados,
      total: clientesFiltrados.length,
      timestamp: new Date().toISOString()
    }, { status: 200 });
    
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return NextResponse.json({ 
      success: false, 
      message: "Erro ao buscar clientes", 
      error 
    }, { status: 500 });
  }
}

// POST - Cria um novo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extrair dados do corpo da requisição
    const { name, email, status = 'ativo', telefone, senha, gerarSenha, enviarEmail: deveEnviarEmail } = body;
    
    // Validar dados obrigatórios
    if (!email || !name) {
      return NextResponse.json({ 
        success: false, 
        message: "Nome e email são obrigatórios" 
      }, { status: 400 });
    }
    
    // Verificar se o cliente já existe
    const clienteExistente = await prisma.user.findUnique({
      where: { email }
    });
    
    if (clienteExistente) {
      return NextResponse.json({ 
        success: false, 
        message: "Um cliente com este email já existe" 
      }, { status: 409 });
    }
    
    // Gerar senha se solicitado, ou usar a fornecida
    let senhaFinal = senha;
    if (gerarSenha === true) {
      // Usar a função gerarSenhaAleatoria definida no topo do arquivo
      senhaFinal = gerarSenhaAleatoria(10);
    }
    
    // Criar novo cliente no banco de dados
    const novoCliente = await prisma.user.create({
      data: {
        name,
        email,
        telefone: telefone || '',
        password: senhaFinal, // Na produção, deve ser hasheada
        role: 'CLIENTE' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    
    // Se solicitado, enviar email com as credenciais
    if (deveEnviarEmail) {
      await enviarEmail({
        para: email,
        assunto: "Bem-vindo ao Imovia - Suas credenciais de acesso",
        html: `
          <h1>Bem-vindo ao Imovia!</h1>
          <p>Olá ${name},</p>
          <p>Seu cadastro foi realizado com sucesso na plataforma Imovia.</p>
          <p>Utilize as seguintes credenciais para acessar sua conta:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Senha:</strong> ${senhaFinal}</p>
          <p>Recomendamos que você altere sua senha após o primeiro acesso.</p>
          <p>Atenciosamente,<br/>Equipe Imovia</p>
        `
      });
    }
    
    // Retornar cliente criado (sem a senha)
    const { password, ...clienteSemSenha } = novoCliente;
    
    return NextResponse.json({ 
      success: true, 
      message: "Cliente adicionado com sucesso",
      cliente: {
        ...clienteSemSenha,
        status: status || 'ativo'
      }
    });
    
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json({ 
      success: false, 
      message: "Erro ao criar cliente", 
      error 
    }, { status: 500 });
  }
}
