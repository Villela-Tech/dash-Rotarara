export const FORMS_APP_URL = 'https://ygg8s2pf.forms.app/rotarara/report';

export const API_HEADERS = {
  'Accept': '*/*',
  'User-Agent': 'Mozilla/5.0',
  'Referer': 'https://ygg8s2pf.forms.app/rotarara/report',
  'Origin': 'https://ygg8s2pf.forms.app',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
};

// Nome exato das colunas na planilha
export const COLUMN_NAMES = {
  TELEFONE: 'Para iniciar favor colocar o seu numero de telefone cadastrado no ato da compra do ingresso',
  ESPUMANTE: 'Destaque Espumante',
  BRANCO: 'Destaque Vinho Branco',
  ROSE: 'Destaque Vinho Rosé',
  LARANJA: 'Destaque Vinho Laranja',
  TINTO: 'Destaque Vinho Tinto',
  CUSTO_BENEFICIO: 'Destaque Custo-Benefício',
  DESIGN: 'Destaque Design de Vinho',
  INOVADOR: 'Destaque Vinho Inovador',
  EVENTO: 'Destaque Vinho do Evento'
};

// Mapeamento do índice da coluna para a categoria (este é apenas um fallback)
export const CATEGORY_COLUMNS: Record<number, string> = {
  1: 'Destaque Espumante',
  2: 'Destaque Vinho Branco',
  3: 'Destaque Vinho Rosé',
  4: 'Destaque Vinho Laranja',
  5: 'Destaque Vinho Tinto',
  6: 'Destaque Custo-Benefício',
  7: 'Destaque Design de Vinho',
  8: 'Destaque Vinho Inovador',
  9: 'Destaque Vinho do Evento'
};

export const CATEGORIES = {
  ESPUMANTE: 'Destaque Espumante',
  BRANCO: 'Destaque Vinho Branco',
  ROSE: 'Destaque Vinho Rosé',
  LARANJA: 'Destaque Vinho Laranja',
  TINTO: 'Destaque Vinho Tinto',
  CUSTO_BENEFICIO: 'Destaque Custo-Benefício',
  DESIGN: 'Destaque Design de Vinho',
  INOVADOR: 'Destaque Vinho Inovador',
  EVENTO: 'Destaque Vinho do Evento'
} as const;

// ID da planilha do Google Sheets
export const GOOGLE_SHEET_ID = '1o4FDXEvvNcHd4r5CZ3jktBsq2aLGVFj1Wnd7T3CcRFs';

// Especificar o GID da aba atual
export const SHEET_GID = '';

// A URL base para acessar os dados da planilha
export const SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&nocache=&`;

export function calculatePercentage(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}

export function extractWineName(input: string): { wine: string; winery: string; fullName: string; year: string } {
  try {
    // Remove espaços extras e divide pelo número no início
    const parts = input.split(/^(\d+)\s+/).filter(Boolean);
    if (parts.length < 2) return { wine: input, winery: '', fullName: input, year: '' };

    // Obtém o nome completo sem o número
    const fullName = parts[1].trim();
    
    // Para o caso de formato como "10 CAYETANA - BLANC DE BLANC"
    const nameParts = fullName.split('-').map(part => part.trim());
    const winery = nameParts[0] || '';
    const wine = nameParts.length > 1 ? nameParts[1] : '';
    
    return {
      wine: fullName, // Nome completo sem o número
      winery,
      fullName,
      year: ''
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