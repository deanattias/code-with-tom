import { useEffect, useState } from 'react';
import CodeBlockItem from './CodeBlockItem';
import { Grid } from '@mui/material';

interface CodeBlock {
  id: number;
  title: string;
}

export default function CodeBlockList() {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";  // Use environment variable for API URL

    fetch(`${API_URL}/api/code-blocks`)
      .then(res => res.json())
      .then(data => setCodeBlocks(data))
      .catch(error => {
        console.error('Error fetching code blocks:', error);
      });
  }, []);

  return (
    <Grid container spacing={3} justifyContent="center" alignItems="center">
      {codeBlocks.map(block => (
        <Grid item xs={12} sm={6} md={4} key={block.id}>
          <CodeBlockItem id={block.id} title={block.title} />
        </Grid>
      ))}
    </Grid>
  );
}