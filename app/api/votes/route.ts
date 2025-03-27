import { NextResponse } from 'next/server';
import axios from 'axios';
import { CATEGORIES, CATEGORY_COLUMNS, SHEET_URL } from './config';

interface WineResult {
  name: string;
  winery: string;
  votes: number;
  position: number;
}

interface VoteData {
  category: string;
  totalVotes: number;
  topWines: WineResult[];
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Adicionar timestamp para evitar cache
    const timestamp = Date.now();
    const response = await axios.get(SHEET_URL + timestamp, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    // O Google Sheets retorna os dados em um formato específico que precisamos processar
    const jsonData = JSON.parse(response.data.substring(47).slice(0, -2));
    
    // Processamento dos dados
    const processData = (rawData: any): VoteData[] => {
      try {
        if (!rawData.table || !rawData.table.rows || rawData.table.rows.length <= 1) {
          console.error("Dados inválidos ou vazios recebidos da planilha");
          return [];
        }
        
        console.log('=============================================');
        console.log('Processando dados da planilha Google Sheets');
        console.log(`URL: ${SHEET_URL}`);
        console.log('=============================================');
        
        // Contagem de votos por vinho em cada categoria
        const votesByCategory: Record<string, Record<string, number>> = {};
        
        // Inicializar todas as categorias
        Object.values(CATEGORIES).forEach(category => {
          votesByCategory[category] = {};
        });
        
        // Processar linhas da planilha (excluindo o cabeçalho)
        const rows = rawData.table.rows.slice(1);
        
        console.log(`Processando ${rows.length} linhas de dados...`);
        let validRowsCount = 0;
        
        // Processar cada linha de dados
        rows.forEach((row: any, index: number) => {
          if (!row.c) {
            console.log(`Linha ${index + 2} inválida (sem células)`);
            return;
          }
          
          // Verificar se a primeira coluna tem um número de telefone (requisito para voto válido)
          const hasPhoneNumber = row.c[0] && row.c[0].v;
          if (!hasPhoneNumber) {
            console.log(`Linha ${index + 2} inválida (sem número de telefone)`);
            return;
          }
          
          validRowsCount++;
          
          // Verificar cada coluna que corresponde a uma categoria (colunas B-J)
          for (let colIndex = 1; colIndex <= 9; colIndex++) {
            // Pular células vazias
            if (!row.c[colIndex] || !row.c[colIndex].v) continue;
            
            const cellValue = row.c[colIndex].v.toString().trim();
            if (!cellValue) continue;
            
            // Obter a categoria correspondente a esta coluna
            const category = CATEGORY_COLUMNS[colIndex];
            if (!category) continue;
            
            // Extrair nome do vinho (formato: "26 VALLONTANO BRUT ROSÉ")
            const match = cellValue.match(/^(\d+)\s+(.+)$/);
            if (!match) {
              console.log(`Formato inválido na linha ${index + 2}, coluna ${colIndex + 1}: "${cellValue}"`);
              continue;
            }
            
            // Extrair apenas o nome, sem o número do início
            const wineName = match[2].trim();
            
            // Incrementar a contagem para este vinho específico
            if (!votesByCategory[category][wineName]) {
              votesByCategory[category][wineName] = 0;
            }
            votesByCategory[category][wineName]++;
            
            console.log(`Voto registrado: "${category}" para "${wineName}"`);
          }
        });
        
        console.log(`\nTotal de votos válidos processados: ${validRowsCount}`);
        
        // Gerar os resultados finais
        const results: VoteData[] = [];
        
        // Processar cada categoria
        Object.entries(votesByCategory).forEach(([category, wines]) => {
          console.log(`\n=============================================`);
          console.log(`Categoria: ${category}`);
          
          if (Object.keys(wines).length === 0) {
            console.log("Sem votos nesta categoria");
            results.push({
              category,
              totalVotes: 0,
              topWines: []
            });
            return;
          }
          
          // Ordenar vinhos pelo número de votos (decrescente)
          const sortedWines = Object.entries(wines).sort((a, b) => b[1] - a[1]);
          
          console.log(`Total de vinhos com votos: ${sortedWines.length}`);
          sortedWines.forEach(([wine, votes], idx) => {
            console.log(`${idx + 1}. ${wine}: ${votes} votos`);
          });
          
          // Selecionar os três primeiros colocados (ou menos se não houver três)
          const topThreeWines: WineResult[] = sortedWines.slice(0, 3).map(([name, votes], index) => ({
            name,
            winery: '',
            votes,
            position: index + 1
          }));
          
          // Calcular total de votos na categoria para estatísticas
          const totalCategoryVotes = Object.values(wines).reduce((sum, count) => sum + count, 0);
          
          results.push({
            category,
            totalVotes: totalCategoryVotes,
            topWines: topThreeWines
          });
          
          console.log(`>> TOP 3 COLOCADOS <<`);
          topThreeWines.forEach(wine => {
            console.log(`${wine.position}º lugar: "${wine.name}" com ${wine.votes} votos`);
          });
        });
        
        // Ordenar as categorias conforme a ordem definida
        const categoryOrder = Object.values(CATEGORIES);
        results.sort((a, b) => {
          const indexA = categoryOrder.indexOf(a.category as any);
          const indexB = categoryOrder.indexOf(b.category as any);
          return indexA - indexB;
        });
        
        return results;
      } catch (error) {
        console.error('Erro ao processar dados da planilha:', error);
        return [];
      }
    };

    const formattedData = processData(jsonData);
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Erro ao buscar dados da planilha:', error);
    console.error('Mensagem de erro:', (error as any).message);
    return NextResponse.json([], { status: 500 });
  }
} 