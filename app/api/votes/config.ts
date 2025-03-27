export const FORMS_APP_URL = 'https://ygg8s2pf.forms.app/rotarara/report';

export const API_HEADERS = {
  'Accept': '*/*',
  'User-Agent': 'Mozilla/5.0',
  'Referer': 'https://ygg8s2pf.forms.app/rotarara/report',
  'Origin': 'https://ygg8s2pf.forms.app',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
};

export const CATEGORIES = {
  ESPUMANTE: 'Destaque Espumante',
  BRANCO: 'Destaque Vinho Branco',
  ROSE: 'Destaque Vinho Rosé',
  TINTO: 'Destaque Vinho Tinto',
  CUSTO_BENEFICIO: 'Destaque Custo-Benefício',
  DESIGN: 'Destaque Design de Vinho',
  INOVADOR: 'Destaque Vinho Inovador',
  EVENTO: 'Destaque Vinho do Evento'
} as const;

// ID da planilha do Google Sheets
export const GOOGLE_SHEET_ID = '1o4FDXEvvNcHd4r5CZ3jktBsq2aLGVFj1Wnd7T3CcRFs';

// A URL base para acessar os dados da planilha como CSV
export const SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&nocache=`;

export function calculatePercentage(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}

export function extractWineName(input: string): { wine: string; winery: string; fullName: string; year: string } {
  try {
    // Remove espaços extras e divide pelo número no início
    const parts = input.split(/^(\d+)\s+/).filter(Boolean);
    if (parts.length < 2) return { wine: input, winery: '', fullName: input, year: '' };

    // Remove o número e divide o resto
    const wineInfo = parts[1].split(/\t|-/).map(part => part.trim()).filter(Boolean);
    
    const winery = wineInfo[0] || '';
    const wine = wineInfo[1] || '';
    const year = wineInfo.find(part => /^\d{4}$/.test(part)) || '';

    // Monta o nome completo de forma elegante
    const fullName = [
      winery,
      wine,
      year ? `(${year})` : ''
    ].filter(Boolean).join(' ');

    return {
      wine,
      winery,
      fullName,
      year
    };
  } catch (error) {
    console.error('Erro ao processar nome do vinho:', input, error);
    return {
      wine: input,
      winery: '',
      fullName: input,
      year: ''
    };
  }
} 