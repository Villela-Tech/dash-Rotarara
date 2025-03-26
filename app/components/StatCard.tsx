import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  delay?: number;
}

const StatCard = ({ title, value, icon, delay = 0 }: StatCardProps) => {
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
        overflow: 'visible',
      }}
    >
      <CardContent
        sx={{
          position: 'relative',
          padding: '2rem !important',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Ícone flutuante */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-5, 5, -5] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '-2rem',
            background: `linear-gradient(135deg, ${theme.palette.wine.main}, ${theme.palette.wine.dark})`,
            borderRadius: '50%',
            padding: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <Box sx={{ color: theme.palette.wine.champagne, fontSize: '2rem' }}>
            {icon}
          </Box>
        </motion.div>

        {/* Valor */}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
        >
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.wine.champagne,
              fontWeight: 'bold',
              marginTop: '2rem',
              marginBottom: '0.5rem',
              background: `linear-gradient(135deg, 
                ${theme.palette.wine.champagne} 0%, 
                ${theme.palette.wine.accent} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {value}
          </Typography>
        </motion.div>

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.5 }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.wine.light,
              fontWeight: 500,
              fontStyle: 'italic',
            }}
          >
            {title}
          </Typography>
        </motion.div>

        {/* Decoração de fundo */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            background: `radial-gradient(circle at center, 
              ${theme.palette.wine.light}10 0%, 
              transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      </CardContent>
    </Card>
  );
};

export default StatCard; 