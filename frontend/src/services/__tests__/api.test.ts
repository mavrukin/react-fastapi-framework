/**
 * Tests for API service.
 */

import { getCurrentTime } from '../api';

// Mock fetch
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches current time without authentication', async () => {
    const mockResponse = {
      current_time: '2024-01-01T12:00:00+00:00',
      timezone: 'UTC',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getCurrentTime('UTC');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/current_time'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timezone: 'UTC' }),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  it('fetches current time with authentication', async () => {
    const mockResponse = {
      current_time: '2024-01-01T12:00:00+00:00',
      timezone: 'UTC',
      email: 'user@example.com',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getCurrentTime('UTC', 'mock_token');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/current_time'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock_token',
        },
        body: JSON.stringify({ timezone: 'UTC' }),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  it('throws error on API failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
    });

    await expect(getCurrentTime('UTC')).rejects.toThrow(
      'Failed to get current time'
    );
  });
});
