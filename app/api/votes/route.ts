import { NextResponse } from 'next/server';
import axios from 'axios';
import { CATEGORIES, SHEET_URL, extractWineName } from './config';

interface VoteData {
  category: string;
  totalVotes: number;
  topWine?: {
    name: string;
    winery: string;
    votes: number;
  };
}

export async function GET() {
  try {
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
    
    // Processando os dados
    const processData = (rawData: any): VoteData[] => {
      try {
        const categoryVotes: { [key: string]: { 
          total: number;
          wines: { [key: string]: { count: number; winery: string; } }
        } } = {};

        // Inicializa todas as categorias
        Object.values(CATEGORIES).forEach(category => {
          categoryVotes[category] = { total: 0, wines: {} };
        });

        // Processando cada linha da planilha
        rawData.table.rows.forEach((row: any, index: number) => {
          if (!row.c || !row.c[1] || index === 0) return; // Pula o cabeçalho e linhas vazias
          
          // Para cada categoria (colunas B até I)
          for (let i = 1; i <= 8; i++) {
            if (!row.c[i] || !row.c[i].v) continue;
            
            const category = Object.values(CATEGORIES)[i-1];
            const { wine, winery } = extractWineName(row.c[i].v);
            
            categoryVotes[category].total++;
            
            if (!categoryVotes[category].wines[wine]) {
              categoryVotes[category].wines[wine] = {
                count: 0,
                winery
              };
            }
            categoryVotes[category].wines[wine].count++;
          }
        });

        // Convertendo para o formato final
        return Object.entries(categoryVotes).map(([category, data]) => {
          const topWine = Object.entries(data.wines)
            .reduce((prev, [wine, info]) => {
              if (!prev || info.count > prev.votes) {
                return {
                  name: wine,
                  winery: info.winery,
                  votes: info.count
                };
              }
              return prev;
            }, null as { name: string; winery: string; votes: number; } | null);

          return {
            category,
            totalVotes: data.total,
            topWine: topWine || undefined
          };
        });
      } catch (error) {
        console.error('Erro ao processar dados:', error);
        return [];
      }
    };

    const formattedData = processData(jsonData);
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return NextResponse.json([], { status: 500 });
  }
} 