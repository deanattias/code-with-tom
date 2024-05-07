import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import codeBlockRoutes from './routes/codeBlockRoutes';
import { setupSocketHandlers } from './socket/socketHandlers';

dotenv.config();

// Initialize Express and HTTP Server
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

// Initialize Socket.IO server
const io = new Server(server, {
  cors: { origin: '*' },
});
setupSocketHandlers(io);

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

// API Routes
app.use('/api/code-blocks', codeBlockRoutes);

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
