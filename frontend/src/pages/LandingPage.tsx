/**
 * Landing page component.
 */

import React from 'react';
import { Container, Box } from '@mui/material';
import Banner from '../components/Banner';
import CurrentTime from '../components/CurrentTime';

const LandingPage: React.FC = () => {
  return (
    <Box>
      <Banner />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <CurrentTime />
      </Container>
    </Box>
  );
};

export default LandingPage;
