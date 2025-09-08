module.exports = function (socket, io) {
  socket.on("sendChatMessage", async (req) => {
    socket.to(req.roomCode).emit('ReceivedChatMessage', req);
  });
};
