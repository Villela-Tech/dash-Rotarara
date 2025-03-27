import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';

interface ChartCardProps {
  title: string;
  type: 'bar' | 'pie';
  data: any[];
  height?: number;
  delay?: number;
}

const ChartCard = ({ title, type, data, height = 400, delay = 0 }: ChartCardProps) => {
  const theme = useTheme();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const chartTheme = {
    background: 'transparent',
    textColor: theme.palette.wine.champagne,
    fontSize: 12,
    axis: {
      domain: {
        line: {
          stroke: theme.palette.wine.light,
          strokeWidth: 1,
        },
      },
      ticks: {
        line: {
          stroke: theme.palette.wine.light,
          strokeWidth: 1,
        },
        text: {
          fill: theme.palette.wine.champagne,
          fontSize: 10,
        },
      },
      legend: {
        text: {
          fill: theme.palette.wine.champagne,
          fontSize: 14,
        },
      },
    },
    grid: {
      line: {
        stroke: `${theme.palette.wine.light}30`,
        strokeWidth: 1,
      },
    },
    legends: {
      text: {
        fill: theme.palette.wine.champagne,
        fontSize: 12,
      },
    },
    tooltip: {
      container: {
        background: theme.palette.background.paper,
        color: theme.palette.wine.champagne,
        fontSize: 12,
        borderRadius: 8,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        border: `1px solid ${theme.palette.wine.light}30`,
        padding: '12px 16px',
      },
    },
  };

  return (
    <Card
      component={motion.div}
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, 
          ${theme.palette.wine.dark}CC 0%, 
          ${theme.palette.background.paper}EE 100%)`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.wine.light}30`,
      }}
    >
      <CardContent
        sx={{
          position: 'relative',
          padding: '2rem !important',
          height: '100%',
        }}
      >
        {/* Título */}
        <Typography
          variant="h5"
          component={motion.h3}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          sx={{
            color: theme.palette.wine.champagne,
            marginBottom: '2rem',
            fontWeight: 500,
            background: `linear-gradient(135deg, 
              ${theme.palette.wine.champagne} 0%, 
              ${theme.palette.wine.accent} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </Typography>

        {/* Gráfico */}
        <Box
          sx={{
            height: height,
            position: 'relative',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: delay + 0.4 }}
            style={{ width: '100%', height: '100%' }}
          >
            {type === 'bar' ? (
              <ResponsiveBar
                data={data}
                keys={['votes']}
                indexBy={data[0]?.category ? 'category' : 'winery'}
                margin={{ top: 50, right: 130, bottom: 120, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={[theme.palette.wine.main]}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 1.6]],
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: data[0]?.category ? 'Categoria' : 'Vinícola',
                  legendPosition: 'middle',
                  legendOffset: 85,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Votos',
                  legendPosition: 'middle',
                  legendOffset: -40,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                  from: 'color',
                  modifiers: [['darker', 1.6]],
                }}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
                theme={chartTheme}
                role="application"
                ariaLabel={title}
                barAriaLabel={e => `${e.id}: ${e.formattedValue} votos`}
              />
            ) : (
              <ResponsivePie
                data={data}
                margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 0.2]],
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor={theme.palette.wine.champagne}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: 'color',
                  modifiers: [['darker', 2]],
                }}
                theme={chartTheme}
                legends={[
                  {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 140,
                    translateY: 0,
                    itemWidth: 120,
                    itemHeight: 20,
                    itemsSpacing: 10,
                    itemTextColor: theme.palette.wine.champagne,
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                  },
                ]}
              />
            )}
          </motion.div>
        </Box>

        {/* Decoração de fundo */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at center, 
              ${theme.palette.wine.light}05 0%, 
              transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ChartCard; 