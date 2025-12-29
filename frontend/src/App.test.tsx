import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import App from './App';
import theme from './theme';
import * as api from './services/api';

// Mock the API service
jest.mock('./services/api');

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.getCurrentTime as jest.Mock).mockResolvedValue({
      current_time: '2024-01-01T12:00:00+00:00',
      timezone: 'UTC',
    });
  });

  test('renders app title in header', () => {
    render(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    );
    // There are multiple "Reach FastAPI Framework" texts (header and banner)
    const titles = screen.getAllByText(/Reach FastAPI Framework/i);
    expect(titles.length).toBeGreaterThan(0);
  });

  test('renders login button', () => {
    render(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    );
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeInTheDocument();
  });
});
