import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import App from './App';
import theme from './theme';

test('renders app title', () => {
  render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
  const titleElement = screen.getByText(/Reach FastAPI Framework/i);
  expect(titleElement).toBeInTheDocument();
});
