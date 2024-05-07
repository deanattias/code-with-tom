"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const codeBlockRoutes_1 = __importDefault(require("./src/routes/codeBlockRoutes"));
const socketHandlers_1 = require("./src/socket/socketHandlers");
dotenv_1.default.config();
// Initialize Express and HTTP Server
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = process.env.PORT || 8080;
// Initialize Socket.IO server
const io = new socket_io_1.Server(server, {
    cors: { origin: '*' },
});
(0, socketHandlers_1.setupSocketHandlers)(io);
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: '*' }));
// API Routes
app.use('/api/code-blocks', codeBlockRoutes_1.default);
// Start the server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
