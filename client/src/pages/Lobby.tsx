import React from 'react';
import { Typography, Box } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CodeBlockList from '../components/CodeBlockList';
import avatar from '../assets/avatar.png';

const fadeIn = {
  animation: 'fadeIn 2s',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
};

const slideDown = {
      animation: 'slideDown 1.5s infinite',
  '@keyframes slideDown': {
    '0%': { transform: 'translateY(-10px)' },
    '50%': { transform: 'translateY(0)' },
    '100%': { transform: 'translateY(-10px)' },
  },
};

const Lobby: React.FC = () => {
  return (
    <Box textAlign="center" marginTop="40px">
    <img src={avatar} alt="Avatar" style={{ width: '300px'}} />
      <Typography variant="h2" component="h1" gutterBottom style={{ color: '#FFFFFF' }} sx={fadeIn}>
        &lt; Code With Tom &gt;
      </Typography>
      <Typography variant="h5" component="h3" color="lightblue" gutterBottom sx={fadeIn}>
        Please select a code block to begin
      </Typography>
      <ArrowDownwardIcon fontSize="large" color="primary" sx={slideDown} />
      <Box marginTop="20px">
        <CodeBlockList />
      </Box>
    </Box>
  );
};

export default Lobby;
