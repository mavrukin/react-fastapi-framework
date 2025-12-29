/**
 * OAuth authentication service.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface OAuthInitiateResponse {
  authorization_url: string;
  state: string;
}

/**
 * Initiate OAuth flow for a provider.
 * Opens a popup window and handles the OAuth callback.
 */
export async function initiateOAuth(
  provider: 'google' | 'facebook' | 'apple'
): Promise<{ token: string; email: string; name?: string }> {
  return new Promise((resolve, reject) => {
    // Get the current origin for the frontend redirect URI
    const frontendRedirectUri = `${window.location.origin}/auth/callback`;

    // Get authorization URL from backend
    fetch(
      `${API_BASE_URL}/api/v1/auth/initiate/${provider}?frontend_redirect_uri=${encodeURIComponent(
        frontendRedirectUri
      )}`
    )
      .then((res) => res.json())
      .then((data: OAuthInitiateResponse) => {
        // Open popup window
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
          data.authorization_url,
          'OAuth Login',
          `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );

        if (!popup) {
          reject(
            new Error('Popup blocked. Please allow popups for this site.')
          );
          return;
        }

        // Listen for message from popup
        const messageListener = (event: MessageEvent) => {
          // Verify origin for security
          if (event.origin !== window.location.origin) {
            return;
          }

          if (event.data.type === 'OAUTH_SUCCESS') {
            window.removeEventListener('message', messageListener);
            popup.close();
            resolve({
              token: event.data.token,
              email: event.data.email,
              name: event.data.name,
            });
          } else if (event.data.type === 'OAUTH_ERROR') {
            window.removeEventListener('message', messageListener);
            popup.close();
            reject(
              new Error(event.data.error || 'OAuth authentication failed')
            );
          }
        };

        window.addEventListener('message', messageListener);

        // Check if popup is closed manually
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            reject(new Error('OAuth popup was closed'));
          }
        }, 1000);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
