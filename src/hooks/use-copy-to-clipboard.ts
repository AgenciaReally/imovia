/**
 * Hook para copiar texto para a área de transferência
 */
export function useCopyToClipboard() {
  /**
   * Copia o texto fornecido para a área de transferência
   * @param text - Texto a ser copiado
   * @returns Promise que resolve para true se a cópia for bem-sucedida, false caso contrário
   */
  const copy = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Falha ao copiar texto para área de transferência:', error);
      return false;
    }
  };

  return { copy };
}

export default useCopyToClipboard;
