import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

interface CodeBlock {
  title: string;
  code: string;
  solution: string;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const filePath = path.join(__dirname, 'codeBlocks.json');

const createTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS code_blocks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL UNIQUE,
      code TEXT NOT NULL,
      solution TEXT NOT NULL
    );
  `;
  await pool.query(createTableQuery);
  console.log('✅ Table created or already exists.');
};

const seedDatabase = async () => {
  try {
    await createTable();

    const data = fs.readFileSync(filePath, 'utf-8');
    const codeBlocks: CodeBlock[] = JSON.parse(data);

    for (const block of codeBlocks) {
      // Check if the record exists
      const existsQuery = 'SELECT COUNT(*) FROM code_blocks WHERE title = $1';
      const { rows } = await pool.query(existsQuery, [block.title]);

      if (parseInt(rows[0].count) === 0) {
        // Insert if it doesn't exist
        await pool.query(
          'INSERT INTO code_blocks (title, code, solution) VALUES ($1, $2, $3)',
          [block.title, block.code, block.solution]
        );
        console.log(`✅ Inserted: ${block.title}`);
      } else {
        console.log(`⚠️ Skipped (duplicate): ${block.title}`);
      }
    }

    console.log('✅ Database seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await pool.end();
  }
};

seedDatabase();