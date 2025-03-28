'use client';

import { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  useTheme, 
  Typography, 
  Box, 
  Paper, 
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import WineBarIcon from '@mui/icons-material/WineBar';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import InfoIcon from '@mui/icons-material/Info';
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

interface VoteStats {
  totalRows: number;
  validRows: number;
  totalVotes: number;
  lastUpdate: string;
  apiUrl?: string;
  responseStatus?: boolean;
}

interface ApiResponse {
  categories: CategoryData[];
  stats: VoteStats;
}

// Dados de fallback para quando a API falhar
const FALLBACK_DATA: ApiResponse = {
  categories: [
    { 
      category: 'Destaque Espumante',
      totalVotes: 10,
      topWines: [
        { name: 'VALLONTANO BRUT ROSÉ', winery: 'Vallontano', votes: 5, position: 1 },
        { name: 'DAL PIZZOL BRUT CHARMAT LONGO', winery: 'Dal Pizzol', votes: 3, position: 2 },
        { name: 'BRUT CHAMPENOISE 12 MESES', winery: 'Aurora', votes: 2, position: 3 }
      ]
    },
    { 
      category: 'Destaque Vinho Branco',
      totalVotes: 9,
      topWines: [
        { name: 'TERROIR EXCLUSIVO CHARDONNAY', winery: 'Casa Valduga', votes: 4, position: 1 },
        { name: 'VG NATURE BLANC DE BLANC', winery: 'Vinhetica', votes: 3, position: 2 },
        { name: 'DON AUGUSTINI CHARDONNAY', winery: 'Peterlongo', votes: 2, position: 3 }
      ]
    },
    { 
      category: 'Destaque Vinho Rosé',
      totalVotes: 8,
      topWines: [
        { name: 'CUVÉE PRESTIGE ROSÉ', winery: 'Peterlongo', votes: 4, position: 1 },
        { name: 'ROSÉ ASSEMBLAGE', winery: 'Aurora', votes: 3, position: 2 },
        { name: 'BOURGOGNE PINOT NOIR', winery: 'Burgundy', votes: 1, position: 3 }
      ]
    },
    { 
      category: 'Destaque Vinho Laranja',
      totalVotes: 8,
      topWines: [
        { name: 'LARANJA', winery: 'Vinhetica', votes: 5, position: 1 },
        { name: 'LARANJA CAMPO LARGO', winery: 'Campo Largo', votes: 2, position: 2 },
        { name: 'LARANJO MOSCATO GIALLO', winery: 'Vitalis', votes: 1, position: 3 }
      ]
    },
    { 
      category: 'Destaque Vinho Tinto',
      totalVotes: 9,
      topWines: [
        { name: 'CORTE BORDALÊS', winery: 'Quinta Don Bonifácio', votes: 4, position: 1 },
        { name: 'RESERVA ESPECIAL MERLOT', winery: 'Casa Valduga', votes: 3, position: 2 },
        { name: 'PREMIUM VERITAS TEROLDEGO', winery: 'Vinícola Campestre', votes: 2, position: 3 }
      ]
    },
    { 
      category: 'Destaque Custo-Benefício',
      totalVotes: 9,
      topWines: [
        { name: 'TERRAS BAIXAS PINOT NOIR', winery: 'Vinícola Campestre', votes: 4, position: 1 },
        { name: 'CORTE BORDALÊS', winery: 'Quinta Don Bonifácio', votes: 3, position: 2 },
        { name: 'CAMPO LARGO CABERNET FRANC', winery: 'Campo Largo', votes: 2, position: 3 }
      ]
    },
    { 
      category: 'Destaque Design de Vinho',
      totalVotes: 9,
      topWines: [
        { name: 'BRUT CHAMPENOISE 12 MESES', winery: 'Aurora', votes: 4, position: 1 },
        { name: 'DAL PIZZOL BRUT CHARMAT LONGO', winery: 'Dal Pizzol', votes: 3, position: 2 },
        { name: 'VALLONTANO BRUT ROSÉ', winery: 'Vallontano', votes: 2, position: 3 }
      ]
    },
    { 
      category: 'Destaque Vinho Inovador',
      totalVotes: 9,
      topWines: [
        { name: 'VALLONTANO BRUT ROSÉ', winery: 'Vallontano', votes: 4, position: 1 },
        { name: 'LARANJO MOSCATO GIALLO', winery: 'Vitalis', votes: 3, position: 2 },
        { name: 'LARANJA', winery: 'Vinhetica', votes: 2, position: 3 }
      ]
    },
    { 
      category: 'Destaque Vinho do Evento',
      totalVotes: 10,
      topWines: [
        { name: 'DAL PIZZOL BRUT CHARMAT LONGO', winery: 'Dal Pizzol', votes: 5, position: 1 },
        { name: 'VALLONTANO BRUT ROSÉ', winery: 'Vallontano', votes: 3, position: 2 },
        { name: 'TERROIR EXCLUSIVO CHARDONNAY', winery: 'Casa Valduga', votes: 2, position: 3 }
      ]
    }
  ],
  stats: {
    totalRows: 15,
    validRows: 15,
    totalVotes: 81,
    lastUpdate: new Date().toISOString()
  }
};

export default function Home() {
  const theme = useTheme();
  const [data, setData] = useState<CategoryData[]>([]);
  const [stats, setStats] = useState<VoteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
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
        
        const jsonData: ApiResponse = await response.json();
        console.log('Dados recebidos da API:', JSON.stringify(jsonData, null, 2));
        
        // Verificar se a API retornou dados válidos ou usou o fallback
        setApiError(!jsonData.stats.responseStatus);
        
        // Mesmo se houver erro, usar os dados (que serão os valores de fallback)
        setData(jsonData.categories);
        setStats(jsonData.stats);
        setLastUpdate(new Date(jsonData.stats.lastUpdate || Date.now()));
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        
        // Usar dados de fallback em caso de erro
        setData(FALLBACK_DATA.categories);
        setStats(FALLBACK_DATA.stats);
        setLastUpdate(new Date());
        setApiError(true);
      } finally {
        setIsUpdating(false);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Aumentar para 10 segundos para reduzir carga
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
            <CircularProgress color="primary" size={40} />
            <Typography sx={{ ml: 2 }}>Carregando dados...</Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  // Garantir que temos dados para evitar erros de renderização
  if (!data || data.length === 0) {
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
  const otherCategories = data.filter(cat => 
    cat.category !== 'Destaque Vinho do Evento' && 
    cat.category !== 'Destaque Vinho Laranja'
  );

  // Dados para os gráficos de análise (apenas se tivermos dados)
  const pieData = data
    .filter(category => 
      category.category !== 'Total de Votos' && 
      category.category !== 'Destaque Vinho Laranja'
    )
    .map(category => ({
      id: category.category,
      label: category.category.replace('Destaque ', ''),
      value: category.totalVotes,
    }));

  const barData = data
    .filter(category => 
      category.category !== 'Total de Votos' && 
      category.category !== 'Destaque Vinho Laranja'
    )
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

        {/* Alerta quando estamos usando dados de fallback */}
        {apiError && (
          <Alert 
            severity="warning" 
            icon={<InfoIcon />}
            sx={{ mb: 4, mt: 2 }}
          >
            Utilizando dados pré-definidos devido a problemas de conexão com a API. Os resultados exibidos podem não refletir os votos mais recentes.
          </Alert>
        )}

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
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
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

        {/* Demais categorias e registro */}
        <Grid container spacing={4} sx={{ marginBottom: 6 }}>
          {otherCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={category.category}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  backgroundColor: theme.palette.background.paper,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
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
          
          {/* Estatísticas - Registros (ao lado do último destaque) */}
          {stats && (
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  backgroundColor: theme.palette.background.paper,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PeopleAltIcon sx={{ fontSize: 30, mr: 2, color: theme.palette.secondary.main }} />
                    <Typography variant="h6">Votos válidos</Typography>
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stats.validRows}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      de {stats.totalRows} submissões totais
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
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
                margin: { top: 20, right: 20, bottom: 20, left: 20 },
                innerRadius: 0.5,
                padAngle: 0.7,
                cornerRadius: 3,
                activeOuterRadiusOffset: 8,
                colors: ['#8A2BE2', '#4169E1', '#20B2AA', '#FF6347', '#FFD700', '#FF69B4', '#32CD32', '#BA55D3', '#FF4500'],
                borderWidth: 0,
                borderColor: { from: 'color', modifiers: [['darker', 0.2]] },
                enableArcLinkLabels: false,
                arcLabelsSkipAngle: 10,
                arcLabelsTextColor: { from: 'color', modifiers: [['darker', 2]] },
                enableArcLabels: false,
                legends: [
                  {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 30,
                    itemsSpacing: 10,
                    itemWidth: 60,
                    itemHeight: 18,
                    itemTextColor: theme.palette.wine.champagne,
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 12,
                    symbolShape: 'circle',
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