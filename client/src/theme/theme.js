import { createTheme } from '@mui/material/styles';

export default function theme(mode = 'light') {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#9c27b0',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f5f5',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
  });
}