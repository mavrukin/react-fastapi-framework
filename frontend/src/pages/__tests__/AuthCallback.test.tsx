/**
 * Tests for AuthCallback component.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import AuthCallback from '../AuthCallback';
import theme from '../../theme';

// Mock useSearchParams
const mockSearchParams = new URLSearchParams();
const mockSetSearchParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

// Mock window.opener and window.close
const mockPostMessage = jest.fn();
const mockClose = jest.fn();

Object.defineProperty(window, 'opener', {
  writable: true,
  value: {
    postMessage: mockPostMessage,
  },
});

Object.defineProperty(window, 'close', {
  writable: true,
  value: mockClose,
});

describe('AuthCallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.delete('token');
    mockSearchParams.delete('email');
    mockSearchParams.delete('name');
    mockSearchParams.delete('error');
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('displays loading message', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthCallback />
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Completing authentication/i)).toBeInTheDocument();
  });

  it('sends success message when token and email are present', async () => {
    mockSearchParams.set('token', 'test-token');
    mockSearchParams.set('email', 'test@example.com');
    mockSearchParams.set('name', 'Test User');

    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthCallback />
        </ThemeProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          type: 'OAUTH_SUCCESS',
          token: 'test-token',
          email: 'test@example.com',
          name: 'Test User',
        },
        window.location.origin
      );
    });

    jest.advanceTimersByTime(500);
    expect(mockClose).toHaveBeenCalled();
  });

  it('sends error message when error parameter is present', async () => {
    mockSearchParams.set('error', 'oauth_failed');

    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthCallback />
        </ThemeProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          type: 'OAUTH_ERROR',
          error: 'oauth_failed',
        },
        window.location.origin
      );
    });

    expect(mockClose).toHaveBeenCalled();
  });

  it('sends error message when token or email is missing', async () => {
    mockSearchParams.set('token', 'test-token');
    // email is missing

    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthCallback />
        </ThemeProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          type: 'OAUTH_ERROR',
          error: 'Missing token or email',
        },
        window.location.origin
      );
    });

    expect(mockClose).toHaveBeenCalled();
  });
});
