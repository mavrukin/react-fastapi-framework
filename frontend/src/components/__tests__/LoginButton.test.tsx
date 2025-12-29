/**
 * Tests for LoginButton component.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import LoginButton from '../LoginButton';
import theme from '../../theme';
import * as authHook from '../../hooks/useAuth';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth');

describe('LoginButton', () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (authHook.useAuth as jest.Mock).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      login: mockLogin,
      logout: mockLogout,
    });
  });

  it('renders login button when not authenticated', () => {
    render(
      <ThemeProvider theme={theme}>
        <LoginButton />
      </ThemeProvider>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('shows login menu when clicking login button', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider theme={theme}>
        <LoginButton />
      </ThemeProvider>
    );

    const loginButton = screen.getByText('Login');
    await user.click(loginButton);

    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('renders user email when authenticated', () => {
    (authHook.useAuth as jest.Mock).mockReturnValue({
      user: { email: 'user@example.com' },
      token: 'mock_token',
      isAuthenticated: true,
      login: mockLogin,
      logout: mockLogout,
    });

    render(
      <ThemeProvider theme={theme}>
        <LoginButton />
      </ThemeProvider>
    );

    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  it('calls login when selecting a provider', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider theme={theme}>
        <LoginButton />
      </ThemeProvider>
    );

    const loginButton = screen.getByText('Login');
    await user.click(loginButton);

    const googleOption = screen.getByText('Google');
    await user.click(googleOption);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        expect.stringContaining('@google.com'),
        expect.stringContaining('mock_token'),
        expect.any(String)
      );
    });
  });
});
