import { createTheme } from '@mui/material/styles';

const shared = {
  typography: {
    fontFamily: '"Geist Variable", ui-sans-serif, system-ui, sans-serif',
    h2: { fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em' },
    h3: { fontWeight: 600, fontSize: '1rem' },
    body2: { fontSize: '0.8125rem' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' as const, fontWeight: 500 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
  },
};

export const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: 'dark',
    primary: { main: '#f97316' },
    secondary: { main: '#5d707f' },
    background: {
      default: '#0f1117',
      paper: 'rgba(22, 27, 34, 0.6)',
    },
    text: {
      primary: '#ecebf3',
      secondary: '#b5c1d2',
    },
  },
});

export const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: 'light',
    primary: { main: '#ea580c' },
    secondary: { main: '#6b7c8d' },
    background: {
      default: '#f4f6f9',
      paper: 'rgba(255, 255, 255, 0.7)',
    },
    text: {
      primary: '#1a1d24',
      secondary: '#4a5568',
    },
  },
});
