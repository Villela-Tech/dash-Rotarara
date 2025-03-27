'use client';

import { useEffect, useState } from 'react';
import { Container, Grid, useTheme } from '@mui/material';
import WineBarIcon from '@mui/icons-material/WineBar';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Layout from './components/Layout';
import Header from './components/Header';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';

interface CategoryData {
  category: string;
  totalVotes: number;
  topWine?: {
    name: string;
    winery: string;
    votes: number;
  };
}

export default function Home() {
  const theme = useTheme();
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Define a URL baseada no ambiente
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? '/.netlify/functions/updateVotes'
          : '/api/votes';
          
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Falha ao carregar os dados');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Atualiza a cada 10 segundos
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Layout>
        <Container>
          <Header lastUpdate={lastUpdate} />
          <div style={{ textAlign: 'center', color: theme.palette.error.main, padding: '2rem' }}>
            Erro: {error}
          </div>
        </Container>
      </Layout>
    );
  }

  // Total geral de votos
  const totalVotes = data.reduce((sum, item) => sum + item.totalVotes, 0);

  // Separar o Destaque Vinho do Evento das outras categorias
  const eventoCategory = data.find(cat => cat.category === 'Destaque Vinho do Evento');
  const otherCategories = data.filter(cat => cat.category !== 'Destaque Vinho do Evento');

  // Reordenar as categorias para que o Total de Votos apareça após Vinho Inovador
  const orderedCategories = otherCategories.reduce((acc, cat) => {
    if (cat.category === 'Destaque Vinho Inovador') {
      return [...acc, cat, { category: 'Total de Votos', totalVotes: totalVotes }];
    }
    return [...acc, cat];
  }, [] as (CategoryData | { category: string; totalVotes: number })[]);

  // Dados para os gráficos de análise
  const pieData = data
    .filter(category => category.category !== 'Total de Votos')
    .map(category => ({
      id: category.category,
      label: category.category.replace('Destaque ', ''),
      value: category.totalVotes,
    }));

  const barData = data
    .filter(category => category.category !== 'Total de Votos')
    .map(category => ({
      category: category.category.replace('Destaque ', ''),
      votos: category.totalVotes,
    }));

  return (
    <Layout>
      <Container maxWidth="xl">
        <Header lastUpdate={lastUpdate} />

        {/* Destaque Vinho do Evento - Centralizado */}
        {eventoCategory && (
          <Grid container justifyContent="center" sx={{ marginBottom: 6, marginTop: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title={eventoCategory.category}
                value={eventoCategory.totalVotes}
                subtitle={eventoCategory.topWine ? 
                  `${eventoCategory.topWine.winery} - ${eventoCategory.topWine.name}` : undefined}
                icon={<EmojiEventsIcon />}
                delay={0.2}
                sx={{
                  transform: 'scale(1.1)',
                  '& .MuiCard-root': {
                    background: `linear-gradient(135deg, 
                      ${theme.palette.wine.dark} 0%, 
                      ${theme.palette.wine.main} 100%)`
                  }
                }}
              />
            </Grid>
          </Grid>
        )}

        {/* Demais categorias e Total de Votos */}
        <Grid container spacing={4} sx={{ marginBottom: 6 }}>
          {orderedCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={3} key={category.category}>
              <StatCard
                title={category.category}
                value={category.totalVotes}
                subtitle={'topWine' in category && category.topWine ? 
                  `${category.topWine.winery} - ${category.topWine.name}` : undefined}
                icon={<WineBarIcon />}
                delay={0.2 + index * 0.1}
              />
            </Grid>
          ))}
        </Grid>

        {/* Gráficos de análise */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ChartCard
              title="Distribuição por Categoria"
              type="pie"
              data={pieData}
              height={400}
              delay={0.4}
              options={{
                margin: { top: 40, right: 120, bottom: 80, left: 80 },
                innerRadius: 0.6,
                padAngle: 0.5,
                cornerRadius: 4,
                activeOuterRadiusOffset: 8,
                colors: { scheme: 'category10' },
                arcLinkLabelsOffset: 10,
                arcLinkLabelsDiagonalLength: 16,
                arcLinkLabelsStraightLength: 24,
                arcLinkLabelsSkipAngle: 7,
                arcLinkLabelsTextColor: theme.palette.wine.champagne,
                arcLinkLabelsThickness: 2,
                arcLinkLabelsColor: { from: 'color' },
                arcLabelsSkipAngle: 10,
                arcLabelsTextColor: theme.palette.wine.champagne,
                enableArcLabels: false,
                legends: [
                  {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemsSpacing: 10,
                    symbolSize: 20,
                    itemTextColor: theme.palette.wine.champagne,
                    itemDirection: 'left-to-right'
                  }
                ]
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartCard
              title="Comparativo de Votos"
              type="bar"
              data={barData}
              height={400}
              delay={0.5}
              options={{
                margin: { top: 50, right: 50, bottom: 100, left: 60 },
                padding: 0.3,
                colors: { scheme: 'category10' },
                borderColor: { from: 'color', modifiers: [['darker', 1.6]] },
                axisTop: null,
                axisRight: null,
                axisBottom: {
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: 'Categorias',
                  legendPosition: 'middle',
                  legendOffset: 80
                },
                axisLeft: {
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Votos',
                  legendPosition: 'middle',
                  legendOffset: -40
                },
                enableLabel: true,
                label: (d: { value: number }) => d.value,
                labelSkipWidth: 12,
                labelSkipHeight: 12,
                labelTextColor: { from: 'color', modifiers: [['darker', 1.6]] }
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
} 