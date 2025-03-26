import { ReactNode } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.wine.dark} 0%, ${theme.palette.background.default} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Efeito de bolhas de vinho */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${theme.palette.wine.light}, ${theme.palette.wine.dark})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              y: [0, -30, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </Box>

      {/* Efeito de vidro de vinho */}
      <Box
        sx={{
          position: 'fixed',
          top: '10%',
          right: '-10%',
          width: '40%',
          height: '80%',
          transform: 'rotate(-20deg)',
          opacity: 0.1,
          background: `linear-gradient(45deg, ${theme.palette.wine.burgundy}, transparent)`,
          borderRadius: '50% 50% 5% 5% / 30% 30% 70% 70%',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      {/* Efeito de garrafa de vinho */}
      <Box
        sx={{
          position: 'fixed',
          bottom: '-5%',
          left: '-5%',
          width: '30%',
          height: '70%',
          opacity: 0.1,
          background: `linear-gradient(-45deg, ${theme.palette.wine.bordeaux}, transparent)`,
          borderRadius: '10% 10% 30% 30% / 5% 5% 50% 50%',
          filter: 'blur(30px)',
          zIndex: 0,
        }}
      />

      {/* Conteúdo principal */}
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 1,
          pt: 4,
          pb: 8,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {children}
        </motion.div>
      </Container>
    </Box>
  );
};

export default Layout; 