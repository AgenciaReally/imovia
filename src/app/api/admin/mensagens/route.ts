import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from 'nodemailer'

// Configurar transportador diretamente na API - mesmo padrão usado na API de relatórios
const transportador = nodemailer.createTransport({
  host: 'mail.imovia.ai',
  port: 465,
  secure: true,
  auth: {
    user: 'relatorios@imovia.ai',
    pass: 'Lala147??',
  },
  logger: true,
  debug: true
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clienteId, tipo, assunto, mensagem, destinatario } = body

    // Validar dados
    if (!clienteId || !mensagem || !tipo) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      )
    }

    // Buscar cliente para garantir que existe
    const cliente = await prisma.user.findUnique({
      where: {
        id: clienteId,
      },
    })

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      )
    }

    // Registrar o envio da mensagem no banco
    // Utilizando o modelo MensagemContato que existe no schema Prisma
    const mensagemEnviada = await prisma.mensagemContato.create({
      data: {
        texto: mensagem,
        usuarioNome: cliente.name,
        usuarioEmail: destinatario,
        status: "enviado",
      },
    }).catch((error: Error) => {
      console.error("Erro ao salvar mensagem no banco:", error)
      // Não retornar erro aqui, continuamos o fluxo para tentar enviar mesmo assim
      return null
    })

    // Enviar a mensagem via canal adequado
    if (tipo === "email") {
      if (!assunto) {
        return NextResponse.json(
          { error: "Assunto é obrigatório para emails" },
          { status: 400 }
        )
      }

      // Configuração do email
      const mailOptions = {
        from: `"iMovia" <relatorios@imovia.ai>`,
        to: destinatario,
        subject: assunto,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="background-color: #0ea5e9; padding: 15px; border-radius: 5px 5px 0 0;">
              <h2 style="color: white; margin: 0;">Imovia</h2>
            </div>
            <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
              <p>Olá ${cliente.name},</p>
              <div style="white-space: pre-line;">
                ${mensagem}
              </div>
              <p style="margin-top: 30px;">Atenciosamente,<br>Equipe Imovia</p>
            </div>
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
              <p>© 2023 Imovia. Todos os direitos reservados.</p>
            </div>
          </div>
        `
      };
      
      // Envio do email diretamente com o transportador configurado
      await transportador.sendMail(mailOptions)
    } else if (tipo === "sms") {
      // Simular envio de SMS (em um cenário real, usaríamos um serviço de SMS como Twilio)
      console.log(`SMS para ${destinatario}: ${mensagem}`)
      
      // Aqui normalmente chamaria um serviço como:
      // await sendSMS({ to: destinatario, message: mensagem });
    }

    // Retornar sucesso
    return NextResponse.json({
      success: true,
      mensagemId: mensagemEnviada?.id || "simulado",
    })
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    return NextResponse.json(
      { error: "Erro ao processar a solicitação" },
      { status: 500 }
    )
  }
}

// Rota para buscar histórico de mensagens
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get("clienteId")

    if (!clienteId) {
      return NextResponse.json(
        { error: "ID do cliente é obrigatório" },
        { status: 400 }
      )
    }

    const mensagens = await prisma.mensagemContato.findMany({
      where: {
        usuarioEmail: clienteId,
      },
      orderBy: {
        createdAt: "desc",
      },
    }).catch(() => {
      // Se a tabela não existir ou outro erro
      return []
    })

    return NextResponse.json({ mensagens })
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    return NextResponse.json(
      { error: "Erro ao processar a solicitação" },
      { status: 500 }
    )
  }
}
