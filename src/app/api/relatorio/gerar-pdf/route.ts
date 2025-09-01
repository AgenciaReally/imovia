import { NextResponse } from 'next/server'
import jsPDF from 'jspdf'

// Função para gerar PDF com jsPDF - design moderno
const generatePDF = (nomeCliente: string, imoveis: any[], dataAnalise: string) => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  
  // Cores do tema
  const primaryColor = '#FE4F17'
  const blackColor = '#000000'
  const grayColor = '#6B7280'
  const lightGray = '#F3F4F6'
  
  // Header com gradiente visual
  pdf.setFillColor(254, 79, 23) // #FE4F17
  pdf.rect(0, 0, pageWidth, 25, 'F')
  
  // Accent preto no header
  pdf.setFillColor(0, 0, 0)
  pdf.rect(pageWidth - 30, 0, 30, 25, 'F')
  
  // Logo e título
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('iMOVIA', 15, 12)
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Relatório Inteligente de Imóveis', 15, 18)
  
  // Data
  pdf.setFontSize(9)
  pdf.text(new Date(dataAnalise).toLocaleDateString('pt-BR'), pageWidth - 45, 15)
  
  let yPos = 40
  
  // Nome do cliente
  pdf.setTextColor(31, 41, 55) // #1F2937
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text(nomeCliente, 15, yPos)
  
  // Linha laranja sob o nome
  pdf.setDrawColor(254, 79, 23)
  pdf.setLineWidth(1.5)
  pdf.line(15, yPos + 2, 35, yPos + 2)
  
  yPos += 20
  
  // Card de resumo
  pdf.setFillColor(255, 255, 255)
  pdf.setDrawColor(229, 231, 235) // #E5E7EB
  pdf.setLineWidth(0.5)
  pdf.roundedRect(15, yPos, pageWidth - 30, 25, 3, 3, 'FD')
  
  // Título do resumo
  pdf.setTextColor(31, 41, 55)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Análise Inteligente', 20, yPos + 8)
  
  // Badges do resumo
  const matchMedio = Math.round(
    imoveis.reduce((acc, curr) => acc + (curr.matchPercentage || 0), 0) / imoveis.length
  )
  
  // Badge Imóveis
  pdf.setFillColor(243, 244, 246) // #F3F4F6
  pdf.roundedRect(20, yPos + 12, 25, 10, 2, 2, 'F')
  pdf.setTextColor(107, 114, 128)
  pdf.setFontSize(7)
  pdf.text('Imóveis', 22, yPos + 16)
  pdf.setTextColor(31, 41, 55)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text(imoveis.length.toString(), 32.5 - (imoveis.length.toString().length * 1.5), yPos + 20)
  
  // Badge Match Médio
  pdf.setFillColor(254, 79, 23) // #FE4F17
  pdf.roundedRect(50, yPos + 12, 30, 10, 2, 2, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Match Médio', 52, yPos + 16)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`${matchMedio}%`, 65 - (matchMedio.toString().length * 1.5), yPos + 20)
  
  // Badge Status
  pdf.setFillColor(243, 244, 246) // #F3F4F6
  pdf.roundedRect(85, yPos + 12, 25, 10, 2, 2, 'F')
  pdf.setTextColor(107, 114, 128)
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Status', 87, yPos + 16)
  pdf.setTextColor(254, 79, 23)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Ativo', 92, yPos + 20)
  
  yPos += 40
  
  // Título da seção
  pdf.setTextColor(31, 41, 55)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Suas Melhores Opções', 15, yPos)
  
  yPos += 15
  
  // Cards dos imóveis (máximo 4)
  imoveis.slice(0, 4).forEach((imovel, index) => {
    if (yPos > pageHeight - 60) {
      pdf.addPage()
      yPos = 20
    }
    
    // Card background
    pdf.setFillColor(255, 255, 255)
    pdf.setDrawColor(229, 231, 235)
    pdf.setLineWidth(0.5)
    pdf.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, 'FD')
    
    // Badge de ranking
    pdf.setFillColor(254, 79, 23)
    pdf.circle(25, yPos + 8, 6, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text((index + 1).toString(), 24, yPos + 10)
    
    // Badge de match
    pdf.setFillColor(0, 0, 0)
    pdf.roundedRect(pageWidth - 35, yPos + 5, 15, 6, 2, 2, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(8)
    pdf.text(`${imovel.matchPercentage || 0}%`, pageWidth - 32, yPos + 9)
    
    // Placeholder para imagem
    pdf.setFillColor(243, 244, 246)
    pdf.roundedRect(20, yPos + 15, 20, 15, 2, 2, 'F')
    pdf.setTextColor(107, 114, 128)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.text('IMG', 28, yPos + 23)
    
    // Conteúdo do imóvel
    let xContent = 45
    
    // Título
    pdf.setTextColor(31, 41, 55)
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    const titulo = imovel.titulo?.length > 45 ? 
      imovel.titulo.substring(0, 42) + '...' : 
      imovel.titulo || 'Imóvel sem título'
    pdf.text(titulo, xContent, yPos + 10)
    
    // Preço
    pdf.setTextColor(254, 79, 23)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    const preco = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(imovel.preco || 0)
    pdf.text(preco, xContent, yPos + 18)
    
    // Características
    let xBadge = xContent
    const features = [
      imovel.caracteristicas?.quartos && `${imovel.caracteristicas.quartos} qts`,
      imovel.caracteristicas?.banheiros && `${imovel.caracteristicas.banheiros} bnh`,
      imovel.caracteristicas?.area && `${imovel.caracteristicas.area}m²`,
      imovel.caracteristicas?.vagas && `${imovel.caracteristicas.vagas} vgs`
    ].filter(Boolean)
    
    features.forEach(feature => {
      if (feature) {
        const badgeWidth = (feature.length * 2) + 4
        pdf.setFillColor(243, 244, 246)
        pdf.roundedRect(xBadge, yPos + 22, badgeWidth, 5, 1, 1, 'F')
        pdf.setTextColor(75, 85, 99)
        pdf.setFontSize(7)
        pdf.setFont('helvetica', 'normal')
        pdf.text(feature, xBadge + 2, yPos + 25.5)
        xBadge += badgeWidth + 3
      }
    })
    
    // Motivos
    if (imovel.motivos && imovel.motivos.length > 0) {
      pdf.setTextColor(254, 79, 23)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'italic')
      const motivos = `• ${imovel.motivos.slice(0, 2).join(' • ')}`
      pdf.text(motivos, xContent, yPos + 32)
    }
    
    yPos += 42
  })
  
  // Footer
  pdf.setDrawColor(229, 231, 235)
  pdf.setLineWidth(0.3)
  pdf.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15)
  
  pdf.setTextColor(107, 114, 128)
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  pdf.text('iMovia - Inteligência Imobiliária', 15, pageHeight - 8)
  pdf.text('Página 1 de 1', pageWidth - 35, pageHeight - 8)
  
  return pdf.output('arraybuffer')
}

export async function POST(request: Request) {
  try {
    const { nomeCliente, imoveis, respostas, dataAnalise } = await request.json()

    console.log('Gerando PDF jsPDF para:', nomeCliente)
    console.log('Quantidade de imóveis:', imoveis?.length)

    // Gerar PDF usando jsPDF
    const pdfArrayBuffer = generatePDF(nomeCliente, imoveis, dataAnalise)
    const pdfBuffer = Buffer.from(pdfArrayBuffer)

    console.log('PDF jsPDF gerado com sucesso!')

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-imoveis-${nomeCliente.replace(/\s+/g, '-')}.pdf"`
      }
    })
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
