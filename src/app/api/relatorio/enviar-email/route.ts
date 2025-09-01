import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getServerSession } from '@/lib/session'

export async function POST(request: Request) {
  try {
    const { email, nomeCliente, imoveis, respostas, dataAnalise } = await request.json()

    // Tentar obter usuário da sessão atual se email não fornecido
    let emailDestino = email
    let nomeDestinatario = nomeCliente

    if (!emailDestino) {
      try {
        const session = await getServerSession()
        if (session?.user?.email) {
          emailDestino = session.user.email
          nomeDestinatario = session.user.name || nomeCliente || 'Cliente'
          console.log('📧 Usando email da sessão:', emailDestino)
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
      }
    }

    if (!emailDestino) {
      console.error('❌ Nenhum email fornecido e usuário não logado')
      return NextResponse.json({
        success: false,
        error: 'Email destinatário não encontrado'
      }, { status: 400 })
    }

    console.log('📧 Enviando relatório por email para:', emailDestino)
    console.log('🏠 Quantidade de imóveis:', imoveis?.length || 0)

    // Configurar transporter do email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.imovia.ai',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // true para porta 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    // Gerar HTML do relatório
    const htmlRelatorio = gerarHtmlRelatorio(nomeDestinatario, imoveis, respostas, dataAnalise)

    // Configurações do email
    const mailOptions = {
      from: `"iMovia - Relatório Personalizado" <${process.env.SMTP_USER}>`,
      to: emailDestino,
      subject: `🏠 Seu Relatório Personalizado de Imóveis - iMovia`,
      html: htmlRelatorio
    }

    // Enviar email
    await transporter.sendMail(mailOptions)

    console.log('✅ Email enviado com sucesso para:', emailDestino)

    return NextResponse.json({
      success: true,
      message: 'Relatório enviado por email com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao enviar relatório por email'
    }, { status: 500 })
  }
}

function gerarHtmlRelatorio(nomeCliente: string, imoveis: any[], respostas: any[], dataAnalise: string) {
  const dataFormatada = new Date(dataAnalise).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const matchMedio = Math.round(
    imoveis.reduce((acc, curr) => acc + (curr.matchPercentage || 0), 0) / imoveis.length
  )

  const imoveisHtml = imoveis.map((imovel, index) => `
    <div style="background: #ffffff; border-radius: 16px; padding: 24px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #f3f4f6;">
      <div style="display: flex; align-items: flex-start; gap: 20px;">
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="background: #fe4f17; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                  #${index + 1} Melhor Match
                </span>
                <span style="background: #f3f4f6; color: #fe4f17; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                  ${imovel.matchPercentage}% Match
                </span>
              </div>
              <h3 style="color: #1f2937; font-size: 20px; font-weight: bold; margin: 0 0 8px 0;">
                ${imovel.titulo}
              </h3>
              
            </div>
            <div style="text-align: right;">
              <div style="color: #fe4f17; font-size: 24px; font-weight: bold;">
                ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(imovel.preco) || 300000)}
              </div>
            </div>
          </div>

          <!-- Características -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0;">
            <div style="text-align: center; padding: 12px; background: #f9fafb; border-radius: 8px;">
              <div style="color: #fe4f17; font-size: 16px; margin-bottom: 4px;">🛏️</div>
              <div style="font-weight: 600; font-size: 14px;">${imovel.caracteristicas?.quartos || 0}</div>
              <div style="color: #6b7280; font-size: 12px;">Quartos</div>
            </div>
            <div style="text-align: center; padding: 12px; background: #f9fafb; border-radius: 8px;">
              <div style="color: #fe4f17; font-size: 16px; margin-bottom: 4px;">🚿</div>
              <div style="font-weight: 600; font-size: 14px;">${imovel.caracteristicas?.banheiros || 0}</div>
              <div style="color: #6b7280; font-size: 12px;">Banheiros</div>
            </div>
            <div style="text-align: center; padding: 12px; background: #f9fafb; border-radius: 8px;">
              <div style="color: #fe4f17; font-size: 16px; margin-bottom: 4px;">📐</div>
              <div style="font-weight: 600; font-size: 14px;">${imovel.caracteristicas?.area || 0}m²</div>
              <div style="color: #6b7280; font-size: 12px;">Área</div>
            </div>
            <div style="text-align: center; padding: 12px; background: #f9fafb; border-radius: 8px;">
              <div style="color: #fe4f17; font-size: 16px; margin-bottom: 4px;">🚗</div>
              <div style="font-weight: 600; font-size: 14px;">${imovel.caracteristicas?.vagas || 0}</div>
              <div style="color: #6b7280; font-size: 12px;">Vagas</div>
            </div>
          </div>

          ${imovel.motivos && imovel.motivos.length > 0 ? `
            <!-- Motivos da IA -->
            <div style="background: rgba(254, 79, 23, 0.05); border-radius: 8px; padding: 16px; margin-top: 16px;">
              <h4 style="color: #374151; font-size: 14px; font-weight: 600; margin: 0 0 8px 0; display: flex; align-items: center;">
                ❤️ Por que recomendamos este imóvel:
              </h4>
              <ul style="margin: 0; padding: 0; list-style: none;">
                ${imovel.motivos.map((motivo: string) => `
                  <li style="color: #6b7280; font-size: 14px; margin: 4px 0; display: flex; align-items: start; gap: 8px;">
                    <span style="color: #10b981; font-size: 12px;">✅</span>
                    ${motivo}
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('')

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Personalizado de Imóveis - iMovia</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #fef7f0 0%, #ffffff 100%); color: #1f2937;">
    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #fe4f17 0%, #ff6b35 100%); border-radius: 20px; padding: 32px; text-align: center; margin-bottom: 24px; color: white;">
            <h1 style="margin: 0 0 8px 0; font-size: 32px; font-weight: bold;">
                📊 Relatório Personalizado de Imóveis
            </h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">
                Análise gerada em: ${dataFormatada}
            </p>
        </div>

        <!-- Saudação -->
        <div style="background: rgba(254, 79, 23, 0.05); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0 0 12px 0;">
                Olá, ${nomeCliente}! 👋
            </h2>
            <p style="color: #6b7280; line-height: 1.6; margin: 0;">
                Com base nas suas preferências e necessidades, nossa inteligência artificial 
                analisou centenas de imóveis e selecionou os <strong> 3 melhores matches</strong> 
                 para seu perfil. Cada propriedade foi cuidadosamente avaliada considerando 
                seus critérios específicos.
            </p>
        </div>

        <!-- Resumo da Análise -->
        <div style="background: #ffffff; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-left: 4px solid #fe4f17;">
            <h3 style="color: #1f2937; font-size: 20px; font-weight: bold; margin: 0 0 16px 0; display: flex; align-items: center;">
                ⭐ Resumo da Análise Inteligente
            </h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 12px;">
                    <div style="color: #fe4f17; font-size: 28px; font-weight: bold;">${matchMedio}%</div>
                    <div style="color: #6b7280; font-size: 14px;">Match Médio</div>
                </div>
                <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 12px;">
                    <div style="color: #fe4f17; font-size: 28px; font-weight: bold;">${respostas.length}</div>
                    <div style="color: #6b7280; font-size: 14px;">Critérios Analisados</div>
                </div>
                <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 12px;">
                    <div style="color: #fe4f17; font-size: 28px; font-weight: bold;">100%</div>
                    <div style="color: #6b7280; font-size: 14px;">Dados Reais</div>
                </div>
            </div>
        </div>

        <!-- Título dos Imóveis -->
        <h3 style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 32px 0 16px 0; display: flex; align-items: center;">
            🏢 Suas Melhores Opções
        </h3>

        <!-- Lista de Imóveis -->
        ${imoveisHtml}

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-radius: 16px; padding: 24px; margin-top: 32px; text-align: center; border: 1px solid #e5e7eb;">
            <h4 style="color: #1f2937; font-size: 20px; font-weight: bold; margin: 0 0 12px 0;">
                Gostou das recomendações?
            </h4>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px 0;">
                Estes imóveis foram selecionados especialmente para você usando inteligência artificial.
                Para mais informações ou agendar visitas, entre em contato conosco!
            </p>
            <div style="color: #9ca3af; font-size: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                Relatório gerado automaticamente pelo sistema iMovia • Dados atualizados em tempo real
            </div>
        </div>
    </div>
</body>
</html>
  `
}
