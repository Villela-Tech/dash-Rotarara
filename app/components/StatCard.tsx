import { Card, CardContent, Typography, Box, useTheme, SxProps, Theme } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  delay?: number;
  sx?: SxProps<Theme>;
}

const StatCard = ({ title, value, subtitle, icon, delay = 0, sx }: StatCardProps) => {
  const theme = useTheme();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

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
        ...sx
      }}
    >
      <CardContent
        sx={{
          position: 'relative',
          padding: '2rem !important',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Título */}
        <Typography
          variant="h6"
          component={motion.h3}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          sx={{
            color: theme.palette.wine.champagne,
            marginBottom: '1rem',
            fontWeight: 500,
            fontSize: '1rem',
          }}
        >
          {title}
        </Typography>

        {/* Valor */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h4"
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.4 }}
            sx={{
              color: theme.palette.wine.champagne,
              fontWeight: 600,
              background: `linear-gradient(135deg, 
                ${theme.palette.wine.champagne} 0%, 
                ${theme.palette.wine.accent} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: subtitle ? '0.5rem' : 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {value}
            <Typography
              component="span"
              variant="h6"
              sx={{
                color: theme.palette.wine.champagne,
                opacity: 0.8,
                fontWeight: 400,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              votos
            </Typography>
          </Typography>

          {/* Subtítulo */}
          {subtitle && (
            <Typography
              variant="body2"
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 0.8 } : {}}
              transition={{ duration: 0.5, delay: delay + 0.5 }}
              sx={{
                color: theme.palette.wine.champagne,
                fontSize: '0.875rem',
                opacity: 0.8,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Ícone */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 0.2, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
          sx={{
            position: 'absolute',
            right: '1.5rem',
            bottom: '1.5rem',
            color: theme.palette.wine.champagne,
            fontSize: '3rem',
            opacity: 0.2,
            '& > svg': {
              fontSize: 'inherit',
            },
          }}
        >
          {icon}
        </Box>

        {/* Decoração de fundo */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at bottom right, 
              ${theme.palette.wine.light}05 0%, 
              transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      </CardContent>
    </Card>
  );
};

export default StatCard; 