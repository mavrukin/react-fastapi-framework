/**
 * Social login button component.
 */

import React from 'react';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import { AccountCircle, Google, Facebook, Apple } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { AUTH_PROVIDERS } from '../types/auth';

const LoginButton: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget);
    } else {
      handleLoginMenuClick(event);
    }
  };

  const handleLoginMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProviderLogin = (provider: 'google' | 'facebook' | 'apple') => {
    handleClose();
    // Mock login for now - in production, this would trigger OAuth flow
    // For demo purposes, we'll simulate a login
    const mockEmail = `user@${provider}.com`;
    const mockToken = `mock_token_${provider}_${Date.now()}`;
    const mockName = `User from ${provider}`;
    login(mockEmail, mockToken, mockName);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  if (isAuthenticated && user) {
    return (
      <>
        <Button
          color="inherit"
          onClick={handleClick}
          startIcon={<AccountCircle />}
        >
          {user.email}
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <Button
        color="inherit"
        variant="outlined"
        onClick={handleClick}
        startIcon={<AccountCircle />}
      >
        Login
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {AUTH_PROVIDERS.map((provider) => (
          <MenuItem
            key={provider.name}
            onClick={() => handleProviderLogin(provider.name)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {provider.name === 'google' && <Google />}
              {provider.name === 'facebook' && <Facebook />}
              {provider.name === 'apple' && <Apple />}
              {provider.label}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LoginButton;
