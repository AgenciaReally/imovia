import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { enviarEmail } from "@/services/email-service";

// Função para gerar senha aleatória
function gerarSenha(length = 8) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let senha = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % caracteres.length;
    senha += caracteres.charAt(randomIndex);
  }
  
  return senha;
}

export async function GET(request: NextRequest) {
  try {
    // Obter os parâmetros da URL (enviados pelo formulário do site externo)
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const telefone = searchParams.get('telefone');
    const nome = searchParams.get('nome') || '';
    
    // Validar parâmetros obrigatórios
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        message: "Email é obrigatório" 
      }, { status: 400 });
    }
    
    // Verificar se o usuário já existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email }
    });
    
    if (usuarioExistente) {
      // Redirecionar para a home com parâmetro de usuário existente
      return NextResponse.redirect(new URL(`/?mensagem=usuario-existente&email=${email}`, request.url));
    }
    
    // Gerar senha aleatória
    const senha = gerarSenha();
    
    // Criar novo usuário no banco de dados
    const novoUsuario = await prisma.user.create({
      data: {
        email,
        telefone: telefone || '',
        name: nome || email.split('@')[0], // Usar parte do email como nome se não for fornecido
        password: senha, // Idealmente, deve ser hasheada antes de salvar
        role: 'cliente',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    
    // Enviar email com as credenciais
    await enviarEmail({
      para: email,
      assunto: "Bem-vindo ao Imovia - Suas credenciais de acesso",
      html: `
        <h1>Bem-vindo ao Imovia!</h1>
        <p>Seu cadastro foi realizado com sucesso.</p>
        <p>Utilize as seguintes credenciais para acessar sua conta:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Senha:</strong> ${senha}</p>
        <p>Recomendamos que você altere sua senha após o primeiro acesso.</p>
        <p>Atenciosamente,<br/>Equipe Imovia</p>
      `
    });
    
    // Redirecionar para a home com parâmetro de sucesso
    return NextResponse.redirect(new URL(`/?mensagem=cadastro-sucesso&email=${email}`, request.url));
    
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    
    // Redirecionar para a home com parâmetro de erro
    return NextResponse.redirect(new URL('/?mensagem=erro', request.url));
  }
}
