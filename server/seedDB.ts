import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'codewithtom',
  password: 'codewithtom',
  port: 5432,
});

const mockCodeBlocks = [
  {
    title: 'Async Function Example',
    code: 'async function fetchData() { /*...*/ }',
    solution: 'async function fetchData() { /*...*/ }',
  },
  {
    title: 'Promise Example',
    code: 'const promise = new Promise((resolve, reject) => { /*...*/ });',
    solution: 'const promise = new Promise((resolve, reject) => { /*...*/ });',
  },
  {
    title: 'Callback Example',
    code: 'function processCallback(data, callback) { callback(data); }',
    solution: 'function processCallback(data, callback) { callback(data); }',
  },
  {
    title: 'Closure Example',
    code: 'function createClosure() { let count = 0; return function() { count++; }; }',
    solution: 'function createClosure() { let count = 0; return function() { count++; }; }',
  },
];

const seedDatabase = async () => {
  try {
    await Promise.all(
      mockCodeBlocks.map(async (block) => {
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
