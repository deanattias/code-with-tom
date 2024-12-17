import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import codeBlockRoutes from './src/routes/codeBlockRoutes';
import { setupSocketHandlers } from './src/socket/socketHandlers';
import morgan from 'morgan';


dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/code-blocks', codeBlockRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Create HTTP server and pass the Express app
const server = http.createServer(app);

// Initialize Socket.IO on the HTTP server
const io = new SocketServer(server, {
  cors: {
    origin: '*'
  }
});

// Setup Socket.IO event handlers
setupSocketHandlers(io);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
