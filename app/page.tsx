'use client';

import { useEffect, useState } from 'react';
import { Container, Grid, useTheme } from '@mui/material';
import WineBarIcon from '@mui/icons-material/WineBar';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Layout from './components/Layout';
import Header from './components/Header';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';

interface VoteData {
  winery: string;
  votes: number;
  category: string;
  wine: string;
  year?: string;
}

// Definição das categorias
const CATEGORIES = {
  ESPUMANTE: 'Destaque Espumante',
  BRANCO: 'Destaque Vinho Branco',
  ROSE: 'Destaque Vinho Rosé',
  TINTO: 'Destaque Vinho Tinto',
  CUSTO_BENEFICIO: 'Destaque Custo-Benefício',
  DESIGN: 'Destaque Design de Vinho',
  INOVADOR: 'Destaque Vinho Inovador',
  EVENTO: 'Destaque Vinho do Evento'
};

export default function Home() {
  const theme = useTheme();
  const [data, setData] = useState<VoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/votes');
        if (!response.ok) {
          throw new Error('Falha ao carregar os dados');
        }
        const jsonData = await response.json();
        // Ordenar os dados por número de votos (decrescente)
        const sortedData = jsonData.sort((a: VoteData, b: VoteData) => b.votes - a.votes);
        setData(sortedData);
        setLastUpdate(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Atualiza a cada minuto

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

  // Análises gerais
  const totalVotes = data.reduce((sum, item) => sum + item.votes, 0);
  const totalWineries = [...new Set(data.map(item => item.winery))].length;
  const leadingWinery = data.length > 0 ? data[0] : null;
  const averageVotes = totalWineries > 0 ? totalVotes / totalWineries : 0;

  // Análise por categoria
  const votesByCategory = Object.entries(CATEGORIES).map(([key, name]) => {
    const categoryData = data.filter(item => item.category === name);
    const topWine = categoryData.length > 0 
      ? categoryData.reduce((prev, current) => prev.votes > current.votes ? prev : current)
      : null;
    
    return {
      category: name,
      topWine: topWine ? {
        winery: topWine.winery,
        wine: topWine.wine,
        votes: topWine.votes,
        year: topWine.year,
      } : null,
      totalVotes: categoryData.reduce((sum, item) => sum + item.votes, 0),
    };
  });

  // Dados para o gráfico de pizza (top 10 geral)
  const pieData = data.slice(0, 10).map(item => ({
    id: item.winery,
    label: item.winery,
    value: item.votes,
  }));

  // Dados para o gráfico de barras por categoria
  const categoryChartData = votesByCategory.map(cat => ({
    category: cat.category,
    votes: cat.totalVotes,
  }));

  return (
    <Layout>
      <Container maxWidth="xl">
        <Header lastUpdate={lastUpdate} />
        
        {/* Cards de estatísticas gerais */}
        <Grid container spacing={4} sx={{ marginBottom: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total de Votos"
              value={totalVotes}
              icon={<WineBarIcon />}
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Vinícolas Participantes"
              value={totalWineries}
              icon={<LocalBarIcon />}
              delay={0.4}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Média de Votos"
              value={averageVotes.toFixed(1)}
              icon={<GroupsIcon />}
              delay={0.6}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Vinícola Mais Votada"
              value={`${leadingWinery?.winery || '-'}`}
              subtitle={`${leadingWinery?.wine || ''}`}
              icon={<EmojiEventsIcon />}
              delay={0.8}
            />
          </Grid>
        </Grid>

        {/* Destaques por categoria */}
        <Grid container spacing={4} sx={{ marginBottom: 6 }}>
          {votesByCategory.map((cat, index) => (
            <Grid item xs={12} sm={6} md={3} key={cat.category}>
              <StatCard
                title={cat.category}
                value={cat.topWine?.winery || '-'}
                subtitle={cat.topWine ? `${cat.topWine.wine}${cat.topWine.year ? ` (${cat.topWine.year})` : ''}` : ''}
                icon={<WineBarIcon />}
                delay={0.2 + index * 0.1}
              />
            </Grid>
          ))}
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <ChartCard
              title="Distribuição de Votos por Categoria"
              type="bar"
              data={categoryChartData}
              height={500}
              delay={0.4}
            />
          </Grid>
          <Grid item xs={12}>
            <ChartCard
              title="Top 10 Vinícolas (Proporção de Votos)"
              type="pie"
              data={pieData}
              height={500}
              delay={0.6}
            />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
} 