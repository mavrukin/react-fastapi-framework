/**
 * Banner component for the landing page.
 */

import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Banner: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        py: 8,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom>
          Reach FastAPI Framework
        </Typography>
        <Typography variant="h5" component="h2" sx={{ opacity: 0.9 }}>
          A modern full-stack framework for building scalable applications
        </Typography>
      </Container>
    </Box>
  );
};

export default Banner;
