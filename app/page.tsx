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
}

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
        setData(jsonData);
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

  const totalVotes = data.reduce((sum, item) => sum + item.votes, 0);
  const totalWineries = data.length;
  const leadingWinery = data.length > 0 ? data.reduce((prev, current) => 
    prev.votes > current.votes ? prev : current
  ) : null;
  const averageVotes = totalWineries > 0 ? totalVotes / totalWineries : 0;

  const pieData = data.map(item => ({
    id: item.winery,
    label: item.winery,
    value: item.votes,
  }));

  return (
    <Layout>
      <Container>
        <Header lastUpdate={lastUpdate} />
        
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
              title="Vinícola Líder"
              value={leadingWinery?.winery || '-'}
              icon={<EmojiEventsIcon />}
              delay={0.8}
            />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <ChartCard
              title="Distribuição de Votos por Vinícola"
              type="bar"
              data={data}
              height={400}
              delay={0.4}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartCard
              title="Proporção de Votos"
              type="pie"
              data={pieData}
              height={400}
              delay={0.6}
            />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
} 