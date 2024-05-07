import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import CodeBlockItem from './CodeBlockItem';  // Import the new component

interface CodeBlock {
  id: number;
  title: string;
}

export default function CodeBlockList() {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);

  useEffect(() => {
    fetch('https://code-with-tom-deans-projects-729ccfbf.vercel.app/api/code-blocks')
      .then(res => res.json())
      .then(data => setCodeBlocks(data));
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
