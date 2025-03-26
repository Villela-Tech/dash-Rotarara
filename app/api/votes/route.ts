import { NextResponse } from 'next/server';
import axios from 'axios';
import { CATEGORIES, SHEET_URL, calculatePercentage, extractWineName } from './config';

interface VoteData {
  wine: string;
  winery: string;
  fullName: string;
  votes: number;
  category: string;
  percentage: number;
}

export async function GET() {
  try {
    const response = await axios.get(SHEET_URL);
    
    // O Google Sheets retorna os dados em um formato específico que precisamos processar
    const jsonData = JSON.parse(response.data.substring(47).slice(0, -2));
    
    // Processando os dados
    const processData = (rawData: any): VoteData[] => {
      try {
        const result: VoteData[] = [];
        const voteCounts: { [key: string]: { [key: string]: { count: number; winery: string; wine: string } } } = {};

        // Processando cada linha da planilha
        rawData.table.rows.forEach((row: any, index: number) => {
          if (!row.c || !row.c[1] || index === 0) return; // Pula o cabeçalho e linhas vazias
          
          // Para cada categoria (colunas B até I)
          for (let i = 1; i <= 8; i++) {
            if (!row.c[i] || !row.c[i].v) continue;
            
            const category = Object.values(CATEGORIES)[i-1];
            const { wine, winery, fullName } = extractWineName(row.c[i].v);
            
            if (!voteCounts[category]) {
              voteCounts[category] = {};
            }
            
            if (!voteCounts[category][fullName]) {
              voteCounts[category][fullName] = {
                count: 0,
                winery,
                wine
              };
            }
            
            voteCounts[category][fullName].count += 1;
          }
        });

        // Convertendo contagens em dados formatados
        Object.entries(voteCounts).forEach(([category, wines]) => {
          const totalVotes = Object.values(wines).reduce((sum, data) => sum + data.count, 0);
          
          Object.entries(wines).forEach(([fullName, data]) => {
            result.push({
              wine: data.wine,
              winery: data.winery,
              fullName,
              votes: data.count,
              category,
              percentage: calculatePercentage(data.count, totalVotes)
            });
          });
        });

        // Ordenando por votos dentro de cada categoria
        return result.sort((a, b) => b.votes - a.votes);
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