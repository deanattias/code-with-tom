import { Server, Socket } from 'socket.io';

const roomParticipants = new Map<string, { mentors: Set<string>, students: Set<string> }>();

export const setupSocketHandlers = (io: Server) => {
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
};
