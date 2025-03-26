import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import WineBarIcon from '@mui/icons-material/WineBar';

interface HeaderProps {
  lastUpdate: Date;
}

const Header = ({ lastUpdate }: HeaderProps) => {
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      sx={{
        position: 'relative',
        padding: '3rem 0',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Efeito de brilho */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: `linear-gradient(45deg, 
            ${theme.palette.wine.dark}00 0%, 
            ${theme.palette.wine.light}30 50%,
            ${theme.palette.wine.dark}00 100%)`,
          animation: 'shine 3s infinite linear',
          '@keyframes shine': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' },
          },
        }}
      />

      {/* Ícone animado */}
      <motion.div
        initial={{ rotate: -20 }}
        animate={{ rotate: [0, -10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        style={{ display: 'inline-block', marginBottom: '1rem' }}
      >
        <WineBarIcon
          sx={{
            fontSize: '4rem',
            color: theme.palette.wine.light,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          }}
        />
      </motion.div>

      {/* Título principal */}
      <Typography
        variant="h1"
        component={motion.h1}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        sx={{
          fontFamily: '"Playfair Display", serif',
          background: `linear-gradient(135deg, 
            ${theme.palette.wine.champagne} 0%, 
            ${theme.palette.wine.accent} 50%,
            ${theme.palette.secondary.main} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '1rem',
        }}
      >
        Rotarara 2023
      </Typography>

      {/* Subtítulo */}
      <Typography
        variant="h4"
        component={motion.h2}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        sx={{
          color: theme.palette.wine.champagne,
          fontWeight: 300,
          marginBottom: '0.5rem',
          fontStyle: 'italic',
        }}
      >
        Celebrando a Excelência em Vinhos
      </Typography>

      {/* Última atualização */}
      <Typography
        variant="subtitle1"
        component={motion.p}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        sx={{
          color: theme.palette.wine.champagne,
          fontStyle: 'italic',
        }}
      >
        Última atualização: {format(lastUpdate, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
      </Typography>

      {/* Decoração */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '1px',
          background: `linear-gradient(90deg, 
            transparent 0%, 
            ${theme.palette.wine.accent}50 50%, 
            transparent 100%)`,
        }}
      />
    </Box>
  );
};

export default Header; 