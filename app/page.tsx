'use client';

import { useEffect, useState } from 'react';
import { Container, Grid, useTheme, Typography, Box, Paper, CircularProgress } from '@mui/material';
import WineBarIcon from '@mui/icons-material/WineBar';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Layout from './components/Layout';
import Header from './components/Header';
import ChartCard from './components/ChartCard';

interface WineResult {
  name: string;
  winery: string;
  votes: number;
  position: number;
}

interface CategoryData {
  category: string;
  totalVotes: number;
  topWines: WineResult[];
}

export default function Home() {
  const theme = useTheme();
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchData = async () => {
      try {
        setIsUpdating(true);
        const timestamp = Date.now();
        const response = await fetch(`/api/votes?t=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        
        if (!response.ok) {
          throw new Error('Falha ao carregar os dados');
        }
        
        const jsonData = await response.json();
        console.log('Dados recebidos da API:', JSON.stringify(jsonData, null, 2));
        
        setData(jsonData);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setIsUpdating(false);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Aguardar até que o componente seja montado no cliente
  if (!mounted) {
    return null; // Não renderiza nada no servidor para evitar erros de hidratação
  }

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="xl">
          <Header lastUpdate={lastUpdate} isUpdating={true} />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress color="primary" />
            <Typography sx={{ ml: 2 }}>Carregando dados...</Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container>
          <Header lastUpdate={lastUpdate} isUpdating={isUpdating} />
          <Box sx={{ textAlign: 'center', color: theme.palette.error.main, padding: '2rem' }}>
            <Typography variant="h6">Erro: {error}</Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  // Garantir que temos dados para evitar erros de renderização
  if (data.length === 0) {
    return (
      <Layout>
        <Container>
          <Header lastUpdate={lastUpdate} isUpdating={isUpdating} />
          <Box sx={{ textAlign: 'center', padding: '2rem' }}>
            <Typography>Nenhum dado disponível</Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  // Separar o Destaque Vinho do Evento e outras categorias
  const eventoCategory = data.find(cat => cat.category === 'Destaque Vinho do Evento');
  const otherCategories = data.filter(cat => cat.category !== 'Destaque Vinho do Evento');

  // Dados para os gráficos de análise (apenas se tivermos dados)
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

  // Renderizar pódio com os 3 primeiros colocados
  const renderPodium = (category: CategoryData) => {
    if (!category.topWines || category.topWines.length === 0) {
      return <Typography>Sem vinhos classificados</Typography>;
    }

    return (
      <Box sx={{ mt: 2 }}>
        {category.topWines.map((wine, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1,
              p: 1,
              borderRadius: 1,
              bgcolor: index === 0 ? 'rgba(255,215,0,0.1)' : 
                      index === 1 ? 'rgba(192,192,192,0.1)' : 
                      index === 2 ? 'rgba(205,127,50,0.1)' : 'transparent'
            }}
          >
            <Typography 
              variant="body1"
              sx={{ 
                mr: 1, 
                fontWeight: 'bold',
                color: index === 0 ? 'gold' : 
                      index === 1 ? 'silver' : 
                      index === 2 ? '#cd7f32' : 'inherit'
              }}
            >
              {wine.position}º
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                fontWeight: index === 0 ? 'bold' : 'normal',
                fontSize: index === 0 ? '1rem' : '0.9rem'
              }}
            >
              {wine.name} ({wine.votes} {wine.votes === 1 ? 'voto' : 'votos'})
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Layout>
      <Container maxWidth="xl">
        <Header lastUpdate={lastUpdate} isUpdating={isUpdating} />

        {/* Destaque Vinho do Evento - Centralizado */}
        {eventoCategory && (
          <Grid container justifyContent="center" sx={{ marginBottom: 6, marginTop: 4 }}>
            <Grid item xs={12} sm={8} md={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  background: `linear-gradient(135deg, 
                    ${theme.palette.wine.dark} 0%, 
                    ${theme.palette.wine.main} 100%)`,
                  color: 'white'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmojiEventsIcon sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" component="h2">
                    {eventoCategory.category}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Total de votos na categoria: {eventoCategory.totalVotes}
                </Typography>
                {renderPodium(eventoCategory)}
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Demais categorias */}
        <Grid container spacing={4} sx={{ marginBottom: 6 }}>
          {otherCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={category.category}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  backgroundColor: theme.palette.background.paper
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WineBarIcon sx={{ fontSize: 30, mr: 2, color: theme.palette.wine.main }} />
                  <Typography variant="h6" component="h2">
                    {category.category}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Total de votos na categoria: {category.totalVotes}
                </Typography>
                {renderPodium(category)}
              </Paper>
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
              delay={0}
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
              delay={0}
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