import { ReactNode } from 'react';
import { Box, Container, useTheme, Typography, Link } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';

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
        display: 'flex',
        flexDirection: 'column',
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
          pb: 12,
          flex: 1,
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

      {/* Footer */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: `linear-gradient(90deg, 
            ${theme.palette.wine.dark}20 0%, 
            ${theme.palette.wine.dark}60 50%,
            ${theme.palette.wine.dark}20 100%)`,
          backdropFilter: 'blur(8px)',
          py: 1.2,
          px: { xs: 2, md: 4 },
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          height: '60px',
          borderTop: `1px solid ${theme.palette.wine.champagne}10`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Image
            src="/villela.tech.png"
            alt="Villela Tech"
            width={40}
            height={40}
            style={{
              opacity: 0.8,
              filter: 'brightness(0) invert(1)',
              transition: 'opacity 0.2s ease',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.wine.champagne,
              fontSize: { xs: '0.7rem', md: '0.75rem' },
              fontWeight: 300,
              opacity: 0.8,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            Desenvolvido por{' '}
            <Link 
              href="https://www.villelatech.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                color: 'inherit',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
                '&:hover': { 
                  opacity: 1,
                  textShadow: '0 0 10px rgba(255,255,255,0.3)'
                }
              }}
            >
              VillelaTech
            </Link>
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          flex: 1,
          gap: 0.3
        }}>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.wine.champagne,
              fontSize: { xs: '0.65rem', md: '0.7rem' },
              fontWeight: 300,
              opacity: 0.6,
              letterSpacing: '0.02em',
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            © 2025 - Todos os direitos reservados
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.wine.champagne,
              fontSize: { xs: '0.65rem', md: '0.7rem' },
              fontWeight: 300,
              opacity: 0.6,
              letterSpacing: '0.02em',
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            CNPJ: 31.655.393/0001-03
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, flex: 1, justifyContent: 'flex-end' }}>
          <Link 
            href="https://www.villelatech.com.br" 
            target="_blank" 
            rel="noopener noreferrer" 
            sx={{ 
              color: theme.palette.wine.champagne, 
              opacity: 0.8,
              transition: 'all 0.2s ease',
              '&:hover': { 
                opacity: 1,
                transform: 'translateY(-2px)',
                filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.3))'
              } 
            }}
          >
            <LanguageIcon sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }} />
          </Link>
          <Link 
            href="https://br.linkedin.com/company/villelatech" 
            target="_blank" 
            rel="noopener noreferrer" 
            sx={{ 
              color: theme.palette.wine.champagne, 
              opacity: 0.8,
              transition: 'all 0.2s ease',
              '&:hover': { 
                opacity: 1,
                transform: 'translateY(-2px)',
                filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.3))'
              } 
            }}
          >
            <LinkedInIcon sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }} />
          </Link>
          <Link 
            href="https://www.facebook.com/villelatech" 
            target="_blank" 
            rel="noopener noreferrer" 
            sx={{ 
              color: theme.palette.wine.champagne, 
              opacity: 0.8,
              transition: 'all 0.2s ease',
              '&:hover': { 
                opacity: 1,
                transform: 'translateY(-2px)',
                filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.3))'
              } 
            }}
          >
            <FacebookIcon sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }} />
          </Link>
          <Link 
            href="https://www.instagram.com/villelatech_/" 
            target="_blank" 
            rel="noopener noreferrer" 
            sx={{ 
              color: theme.palette.wine.champagne, 
              opacity: 0.8,
              transition: 'all 0.2s ease',
              '&:hover': { 
                opacity: 1,
                transform: 'translateY(-2px)',
                filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.3))'
              } 
            }}
          >
            <InstagramIcon sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }} />
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 