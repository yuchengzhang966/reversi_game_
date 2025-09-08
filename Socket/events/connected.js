const connectedEvent = (socket, io) => {

  require("./connection/subscribe")(socket, io);
  require("./connection/onlineUserList")(socket, io);
  require("./disconnect")(socket, io);
  require("./room/joinRoom")(socket, io);
  require("./room/leaveRoom")(socket, io);
  require("./room/showRoomList")(socket);
  require("./game/joinGame")(socket);
  require("./game/initializeGame")(socket, io);
  require("./game/chessDown")(socket);
  require("./game/availableMoves")(socket);
  require("./game/gameEnd")(socket);
  require("./room/broadcastRoom")(socket, io);
  require("./game/reonnectToGame")(socket);
  require("./user/getTotalUserCount")(socket);
  require("./chat/sendChatMessage")(socket, io);
  require("./chat/joinChat")(socket, io);

  socket.on('reconnect', (data) => {
    console.log(socket.id + 'tempted to reconnect');
  })

};

module.exports = connectedEvent;
