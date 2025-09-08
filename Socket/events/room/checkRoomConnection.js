const { checkSid } = require("../../../controller/connect/index");

module.exports = function (socket, io) {
  socket.on("checkRoomConnection", async (req) => {
    // try {
    //   const currentRoomSockets = io.sockets.adapter.rooms[req.roomId];
    //   const currentSocketId = socket.id;
    //   if (currentRoomSockets) {
    //     if (!currentRoomSockets.sockets[currentSocketId]) {
    //       throw new Error("Join Room Unsuccessfully");
    //     }
    //   } else {
    //     throw new Error("Room Does not Exist");
    //   }
    // } catch (e) {
    //   socket.emit("errormsg", { message: e.message });
    // }
  });
};
