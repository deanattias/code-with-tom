import { Pool } from 'pg';
import { selectCodeBlocks, selectCodeBlockById } from '../models/codeBlockModel';
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.db_username,
  host: process.env.db_host,
  database: process.env.db_database,
  password: process.env.db_password,
  port: parseInt(process.env.db_port || '5432', 10),
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
