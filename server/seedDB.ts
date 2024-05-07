import { Pool } from 'pg';
import fs from 'fs';

interface CodeBlock {
  title: string;
  code: string;
  solution: string;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const seedDatabase = async () => {
  try {
    const data = fs.readFileSync('../codeBlocks.json', 'utf-8');
    const codeBlocks: CodeBlock[] = JSON.parse(data);

    await Promise.all(
      codeBlocks.map(async (block: CodeBlock) => {
        await pool.query(
          'INSERT INTO code_blocks (title, code, solution) VALUES ($1, $2, $3)',
          [block.title, block.code, block.solution]
        );
      })
    );

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
};

seedDatabase();
