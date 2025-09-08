module.exports = function (socket, io) {
  socket.on("joinChat", async (req) => {
    console.log(req);
    socket
      .to(req.roomCode)
      .emit("ReceivedChatMessage", { message: `${req.name} Joined Chat Room` });
  });
};
