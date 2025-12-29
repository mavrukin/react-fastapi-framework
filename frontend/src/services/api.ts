/**
 * API service for communicating with the FastAPI backend.
 */

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface CurrentTimeResponse {
  current_time: string;
  timezone: string;
  email?: string;
}

export interface CurrentTimeRequest {
  timezone: string;
}

/**
 * Get current time for a given timezone.
 * @param timezone - The timezone (e.g., 'America/New_York')
 * @param token - Optional authentication token
 * @returns Current time response
 */
export async function getCurrentTime(
  timezone: string,
  token?: string
): Promise<CurrentTimeResponse> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/current_time`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ timezone }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get current time: ${response.statusText}`);
  }

  return response.json();
}
