import { Pool } from 'pg';
import { selectCodeBlocks, selectCodeBlockById } from '../models/codeBlockModel';
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const fetchAllCodeBlocks = async () => {
  const result = await pool.query(selectCodeBlocks);
  return result.rows;
};

export const fetchCodeBlockById = async (id: number) => {
  const result = await pool.query(selectCodeBlockById, [id]);
  if (result.rows.length > 0) {
    return result.rows[0];
  }
  return null;
};
