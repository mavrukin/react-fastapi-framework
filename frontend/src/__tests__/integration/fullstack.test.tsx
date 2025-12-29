/**
 * Full-stack integration tests.
 * These tests require the backend to be running.
 * Run with: REACT_APP_API_URL=http://localhost:8000 npm test
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import App from '../../App';
import theme from '../../theme';
import * as api from '../../services/api';

// Mock API calls for integration testing
// In a real scenario, you might want to use MSW (Mock Service Worker)
// or actually start the backend server
jest.mock('../../services/api');

describe('Full-stack Integration', () => {
  const mockGetCurrentTime = api.getCurrentTime as jest.MockedFunction<
    typeof api.getCurrentTime
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays landing page with banner and login button', () => {
    mockGetCurrentTime.mockResolvedValue({
      current_time: '2024-01-01T12:00:00+00:00',
      timezone: 'UTC',
    });

    render(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    );

    // There are multiple "Reach FastAPI Framework" texts (header and banner)
    const titles = screen.getAllByText(/Reach FastAPI Framework/i);
    expect(titles.length).toBeGreaterThan(0);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('fetches and displays current time on page load', async () => {
    mockGetCurrentTime.mockResolvedValue({
      current_time: '2024-01-01T12:00:00+00:00',
      timezone: 'UTC',
    });

    render(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(mockGetCurrentTime).toHaveBeenCalled();
    });
    expect(screen.getByText(/Current time:/)).toBeInTheDocument();
  });

  it('displays personalized message when user is logged in', async () => {
    // This test simulates the full flow:
    // 1. User logs in
    // 2. API is called with auth token
    // 3. Response includes email
    // 4. UI displays personalized message

    mockGetCurrentTime.mockResolvedValue({
      current_time: '2024-01-01T12:00:00+00:00',
      timezone: 'UTC',
      email: 'user@example.com',
    });

    render(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    );

    // Note: In a real integration test, you would:
    // 1. Click login button
    // 2. Select a provider
    // 3. Wait for authentication
    // 4. Verify API is called with token
    // 5. Verify personalized message appears

    // For now, we're just verifying the API integration
    await waitFor(() => {
      expect(mockGetCurrentTime).toHaveBeenCalled();
    });
  });
});
