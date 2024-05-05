// Lobby.tsx
import React from 'react';
import { Typography, Box } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CodeBlockList from '../components/CodeBlockList';

// Keyframe animations
const fadeInFirst = {
  animation: 'fadeIn 2s',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
};

const fadeInSecond = {
  animation: 'fadeIn 3s',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
};

const fadeInOutLoop = {
  animation: 'fadeInOut 2s infinite', // Looping effect
  '@keyframes fadeInOut': {
    '0%, 100%': { opacity: 0 },
    '50%': { opacity: 1 },
  },
};

const Lobby: React.FC = () => {
  return (
    <Box textAlign="center" marginTop="40px">
      <Typography variant="h2" component="h1" gutterBottom style={{ color: '#FFFFFF' }} sx={fadeInFirst}>
        Code With Tom
      </Typography>
      <Typography variant="h5" component="h3" color="lightblue" gutterBottom sx={fadeInSecond}>
        Please select a code block to begin
      </Typography>
      <ArrowDownwardIcon fontSize="large" color="primary" sx={fadeInOutLoop} />
      <Box marginTop="20px">
        <CodeBlockList />
      </Box>
    </Box>
  );
};

export default Lobby;
