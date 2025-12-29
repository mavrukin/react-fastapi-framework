import React from 'react';
import { Container, Typography } from '@mui/material';

const App: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Reach FastAPI Framework
      </Typography>
      <Typography variant="body1">
        Frontend application initialized with React and Material-UI
      </Typography>
    </Container>
  );
};

export default App;
