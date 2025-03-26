import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    wine: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
      burgundy: string;
      bordeaux: string;
      rose: string;
      champagne: string;
      accent: string;
    };
  }
  interface PaletteOptions {
    wine: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
      burgundy: string;
      bordeaux: string;
      rose: string;
      champagne: string;
      accent: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B0000',
      light: '#A52A2A',
      dark: '#4B0000',
    },
    secondary: {
      main: '#FFD700',
      light: '#FFE44D',
      dark: '#B39700',
    },
    wine: {
      main: '#722F37',
      light: '#9E4F57',
      dark: '#4B1F24',
      contrastText: '#ffffff',
      burgundy: '#800020',
      bordeaux: '#5E0F15',
      rose: '#FFB7B2',
      champagne: '#F7E7CE',
      accent: '#C7AB87', // Cor dourada envelhecida
    },
    background: {
      default: '#1A0F0F',
      paper: '#2D1F1F',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      letterSpacing: '0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1.1rem',
      letterSpacing: '0.015em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.01em',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(145deg, rgba(45, 31, 31, 0.9) 0%, rgba(26, 15, 15, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          borderRadius: '16px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '8px 24px',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          fontWeight: 500,
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme; 