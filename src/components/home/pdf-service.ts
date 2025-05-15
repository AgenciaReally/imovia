import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PdfGerarOptions {
  elementId: string;
  fileName?: string;
  formatarConteudo?: () => void;
  callbackAntesDeGerar?: () => void;
}

/**
 * Serviço para geração de PDF com o mesmo layout do modal
 */
export const gerarPdfDoElemento = async ({
  elementId,
  fileName = 'relatorio-imovia.pdf',
  formatarConteudo,
  callbackAntesDeGerar
}: PdfGerarOptions): Promise<string> => {
  try {
    // Executar qualquer formatação antes de renderizar
    if (formatarConteudo) {
      formatarConteudo();
    }
    
    // Preparar elemento para captura
    if (callbackAntesDeGerar) {
      callbackAntesDeGerar();
    }
    
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Elemento com ID ${elementId} não encontrado`);
    }
    
    // Configurar opções para melhor qualidade
    const options = {
      scale: 2, // Maior qualidade/resolução
      useCORS: true, // Para imagens externas
      allowTaint: true,
      backgroundColor: '#ffffff'
    };
    
    // Criar canvas a partir do elemento HTML
    const canvas = await html2canvas(element, options);
    const imgData = canvas.toDataURL('image/png');
    
    // Configurar o PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Calcular dimensões para manter proporção
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    // Adicionar primeira página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Adicionar páginas adicionais se necessário
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Salvar PDF
    pdf.save(fileName);
    
    // Retornar URL blob para visualização se necessário
    const blobPDF = pdf.output('blob');
    return URL.createObjectURL(blobPDF);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};
