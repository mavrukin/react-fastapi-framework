/**
 * Tests for CurrentTime component.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import CurrentTime from '../CurrentTime';
import theme from '../../theme';
import * as api from '../../services/api';
import * as authHook from '../../hooks/useAuth';

// Mock the API and auth hook
jest.mock('../../services/api');
jest.mock('../../hooks/useAuth');

describe('CurrentTime', () => {
  const mockGetCurrentTime = api.getCurrentTime as jest.MockedFunction<
    typeof api.getCurrentTime
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    (authHook.useAuth as jest.Mock).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });
  });

  it('displays loading state initially', () => {
    mockGetCurrentTime.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ current_time: '2024-01-01T12:00:00', timezone: 'UTC' }), 100);
        })
    );

    render(
      <ThemeProvider theme={theme}>
        <CurrentTime />
      </ThemeProvider>
    );

    // Check for loading indicator (CircularProgress)
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays current time when not authenticated', async () => {
    mockGetCurrentTime.mockResolvedValue({
      current_time: '2024-01-01T12:00:00+00:00',
      timezone: 'UTC',
    });

    render(
      <ThemeProvider theme={theme}>
        <CurrentTime />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Current time:/)).toBeInTheDocument();
      expect(screen.getByText(/2024-01-01T12:00:00/)).toBeInTheDocument();
    });
  });

  it('displays user email and time when authenticated', async () => {
    (authHook.useAuth as jest.Mock).mockReturnValue({
      user: { email: 'user@example.com' },
      token: 'mock_token',
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockGetCurrentTime.mockResolvedValue({
      current_time: '2024-01-01T12:00:00+00:00',
      timezone: 'UTC',
      email: 'user@example.com',
    });

    render(
      <ThemeProvider theme={theme}>
        <CurrentTime />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Hello user@example.com, your current time is/)
      ).toBeInTheDocument();
    });
  });

  it('displays error message on API failure', async () => {
    mockGetCurrentTime.mockRejectedValue(new Error('API Error'));

    render(
      <ThemeProvider theme={theme}>
        <CurrentTime />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/API Error/)).toBeInTheDocument();
    });
  });
});
