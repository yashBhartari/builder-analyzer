export const setupSocketIO = (io) => {
  const activeRooms = new Map();

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join collaborative editing session
    socket.on('join-resume', ({ resumeId, userId }) => {
      socket.join(resumeId);
      if (!activeRooms.has(resumeId)) {
        activeRooms.set(resumeId, new Set());
      }
      activeRooms.get(resumeId).add({ socketId: socket.id, userId });
      
      const collaborators = [...activeRooms.get(resumeId)];
      io.to(resumeId).emit('collaborators-updated', collaborators);
      console.log(`👤 User ${userId} joined resume session ${resumeId}`);
    });

    // Broadcast resume changes to collaborators
    socket.on('resume-update', ({ resumeId, section, data, userId }) => {
      socket.to(resumeId).emit('resume-changed', { section, data, userId, timestamp: Date.now() });
    });

    // Cursor position for real-time collaboration
    socket.on('cursor-move', ({ resumeId, userId, position }) => {
      socket.to(resumeId).emit('peer-cursor', { userId, position });
    });

    // Leave session
    socket.on('leave-resume', ({ resumeId, userId }) => {
      socket.leave(resumeId);
      if (activeRooms.has(resumeId)) {
        const room = activeRooms.get(resumeId);
        room.forEach(user => {
          if (user.socketId === socket.id) room.delete(user);
        });
        if (room.size === 0) activeRooms.delete(resumeId);
      }
      io.to(resumeId).emit('collaborators-updated', [...(activeRooms.get(resumeId) || [])]);
    });

    socket.on('disconnect', () => {
      activeRooms.forEach((users, resumeId) => {
        users.forEach(user => {
          if (user.socketId === socket.id) {
            users.delete(user);
            io.to(resumeId).emit('collaborators-updated', [...users]);
          }
        });
        if (users.size === 0) activeRooms.delete(resumeId);
      });
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};
