// src/features/errors/NotFound.tsx

import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
      }}
    >
      <Typography variant="h3" gutterBottom color="error">
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </Typography>
      <Button
        component={RouterLink}
        to="/home"
        variant="contained"
        color="primary"
      >
        Go Back Home
      </Button>
    </Box>
  );
}
