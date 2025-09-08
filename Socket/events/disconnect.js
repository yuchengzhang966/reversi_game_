const { leaveRoom } = require("../../controller/room/index");
const { checkSid } = require("../../controller/connect/index");
const log = require("../../utils/log");
const updateOnlineUserList = require("../controller/updateOnlineUserList");
const updateRoomList = require("../controller/updateRoomList");

module.exports = function (socket, io) {
  socket.on("disconnect", async () => {
    updateOnlineUserList(io);
    try {
      // Check if it's the valid socket to leave the room
      if (socket.user_id) {
        const isValid = await checkSid(socket.user_id, socket.id);
        if (socket.user_room && isValid) {
          const room = await leaveRoom(socket.user_id, socket.user_room);
          socket.to(socket.user_room).emit("leaveRoom", { data: room });
          // Update User List
          await updateRoomList(io, socket)
        }
      }
    } catch (e) {
      log(e.message, "error");
    }
  });
};
