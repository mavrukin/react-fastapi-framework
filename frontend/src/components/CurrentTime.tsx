/**
 * Component to display current time from the backend API.
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { getCurrentTime, CurrentTimeResponse } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface CurrentTimeProps {
  timezone?: string;
}

const CurrentTime: React.FC<CurrentTimeProps> = ({
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
}) => {
  const { user, token, isAuthenticated } = useAuth();
  const [timeData, setTimeData] = useState<CurrentTimeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTime = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCurrentTime(timezone, token || undefined);
        setTimeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch time');
      } finally {
        setLoading(false);
      }
    };

    fetchTime();
    // Refresh every 30 seconds
    const interval = setInterval(fetchTime, 30000);
    return () => clearInterval(interval);
  }, [timezone, token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!timeData) {
    return null;
  }

  return (
    <Box sx={{ p: 2 }}>
      {isAuthenticated && user && timeData.email ? (
        <Typography variant="h6" component="div">
          Hello {user.email}, your current time is {timeData.current_time}
        </Typography>
      ) : (
        <Typography variant="h6" component="div">
          Current time: {timeData.current_time} ({timeData.timezone})
        </Typography>
      )}
    </Box>
  );
};

export default CurrentTime;
