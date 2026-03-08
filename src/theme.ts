import { createTheme } from '@mui/material/styles';

const shared = {
  typography: {
    fontFamily: '"JetBrains Mono", "Ui Monospace", monospace',
  },
  shape: {
    borderRadius: 12,
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
      paper: '#161b22',
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
      paper: '#ffffff',
    },
  },
});
