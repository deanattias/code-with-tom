import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface CodeBlockItemProps {
  id: number;
  title: string;
}

export default function CodeBlockItem({ id, title }: CodeBlockItemProps) {
  const cardStyles = {
    borderRadius: '8px',
    minHeight: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    },
  };

  return (
    <Link to={`/code-block/${id}`} style={{ textDecoration: 'none' }}>
      <Card elevation={5} sx={cardStyles}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h5" component="h2" color="textPrimary" align="center">
              {title}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
