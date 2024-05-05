import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { Server, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Initialize PostgreSQL Pool
const pool = new Pool({
  user: process.env.db_username,
  host: process.env.db_host,
  database: process.env.db_database,
  password: process.env.db_password,
  port: parseInt(process.env.db_password || '5432', 10),
});

console.dir(pool)


// Middleware to parse JSON requests
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));


// API route to fetch all code block titles
app.get('/api/code-blocks', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, title FROM code_blocks');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching code blocks:', error);
    res.status(500).json({ message: 'Error fetching code blocks' });
  }
});

// API route to fetch a specific code block by ID
app.get('/api/code-blocks/:id', async (req: Request, res: Response) => {
  const blockId = parseInt(req.params.id, 10);
  try {
    const result = await pool.query('SELECT * FROM code_blocks WHERE id = $1', [blockId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Code block not found' });
    }
  } catch (error) {
    console.error('Error fetching code block:', error);
    res.status(500).json({ message: 'Error fetching code block' });
  }
});

// Socket.IO event handling
io.on('connection', (socket: Socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on('code-changed', ({ roomId, newCode }) => {
    socket.to(roomId).emit('code-changed', newCode);
    console.log(`Code changed in room ${roomId} by ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
