const log = require("../../../utils/log");
const { leaveRoom } = require("../../../controller/room/index");

/**
 * player leaves room
 * @param   {Object}  socket
 */
module.exports = function (socket, io) {
  socket.on("leaveRoom", async (data) => {
    try {
      socket.leave(socket.user_room);
      socket.user_room = null;
      const room = await leaveRoom(data.userId, data.roomId);
      socket.to(data.roomId).emit("leaveRoom", { data: room });
      socket.emit("updateRoomList");
    } catch (e) {
      log(e.message, "error");
    }
  });
};
