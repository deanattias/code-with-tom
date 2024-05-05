import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';

interface CodeBlock {
  id: number;
  title: string;
}

const CodeBlockList: React.FC = () => {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/code-blocks')
      .then((res) => res.json())
      .then((data) => setCodeBlocks(data));
  }, []);

  const cardStyles = {
    borderRadius: '8px',
    minHeight: '120px',
    padding: '16px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    },
  };

  return (
    <Grid container spacing={3} justifyContent="center" alignItems="center">
      {codeBlocks.map((block) => (
        <Grid item xs={12} sm={6} md={4} key={block.id}>
          <Link to={`/code-block/${block.id}`} style={{ textDecoration: 'none' }}>
            <Card elevation={5} sx={cardStyles}>
              <CardHeader
                title={
                  <Typography variant="h5" component="h2" color="textPrimary">
                    {block.title}
                  </Typography>
                }
                titleTypographyProps={{ align: 'center' }}
              />
              <CardContent>
                <Typography variant="body2" align="center">
                  Click to view and edit this code block.
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default CodeBlockList;
