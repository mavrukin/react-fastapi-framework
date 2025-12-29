/**
 * OAuth callback page that receives the token from the backend redirect.
 */

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const error = searchParams.get('error');

    if (error) {
      // Send error to parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'OAUTH_ERROR',
            error: error,
          },
          window.location.origin
        );
      }
      window.close();
      return;
    }

    if (token && email) {
      // Send success to parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'OAUTH_SUCCESS',
            token: token,
            email: email,
            name: name || undefined,
          },
          window.location.origin
        );
      }
      // Close popup after a short delay
      setTimeout(() => {
        window.close();
      }, 500);
    } else {
      // Missing parameters
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'OAUTH_ERROR',
            error: 'Missing token or email',
          },
          window.location.origin
        );
      }
      window.close();
    }
  }, [searchParams]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography>Completing authentication...</Typography>
    </Box>
  );
};

export default AuthCallback;
