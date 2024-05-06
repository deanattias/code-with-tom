import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { Server, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';

dotenv.config();

// Initialize Express and HTTP Server
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

// Initialize Socket.IO server with CORS settings
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
  port: parseInt(process.env.db_port || '5432', 10),
});

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

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

// Store participants for each room (both mentors and students)
const roomParticipants = new Map<string, { mentors: Set<string>, students: Set<string> }>();

// Socket.IO event handling
io.on('connection', (socket: Socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);

    // Initialize room participants if not already set
    if (!roomParticipants.has(roomId)) {
      roomParticipants.set(roomId, { mentors: new Set(), students: new Set() });
    }

    const roomData = roomParticipants.get(roomId);

    // Determine the role (mentor/student) ensuring only one mentor
    if (roomData && roomData.mentors.size === 0) {
      roomData.mentors.add(socket.id);
      socket.emit('assign-role', { role: 'mentor' });
    } else if (roomData && !roomData.mentors.has(socket.id) && !roomData.students.has(socket.id)) {
      roomData.students.add(socket.id);
      socket.emit('assign-role', { role: 'student' });
    }

    // Emit the updated counts to all users in the room
    if (roomData) {
      io.to(roomId).emit('user-counts', {
        mentors: roomData.mentors.size,
        students: roomData.students.size,
      });
    }

    const role = roomData && roomData.mentors.has(socket.id) ? 'mentor' : 'student';
    console.log(`A ${role} joined room ${roomId} (ID: ${socket.id})`);
  });

  socket.on('code-changed', ({ roomId, newCode }) => {
    const roomData = roomParticipants.get(roomId);

    // Ensure only students can emit code changes
    if (roomData && roomData.students.has(socket.id)) {
      socket.to(roomId).emit('code-changed', newCode);
      console.log(`A code change made by a student in room ${roomId} (ID: ${socket.id})`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove the user from the room's participant sets and update counts
    for (const [roomId, roomData] of roomParticipants.entries()) {
      if (roomData.mentors.has(socket.id)) {
        roomData.mentors.delete(socket.id);
      } else if (roomData.students.has(socket.id)) {
        roomData.students.delete(socket.id);
      }

      // Emit updated counts to remaining users in the room
      io.to(roomId).emit('user-counts', {
        mentors: roomData.mentors.size,
        students: roomData.students.size,
      });
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
