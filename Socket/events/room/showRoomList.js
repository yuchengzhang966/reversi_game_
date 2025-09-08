const { findActiveRoom } = require("../../../controller/room/index");

/**
 * display all rooms
 * @param   {Object}  socket
 */
module.exports = function (socket) {
  socket.on("showRoomList", async () => {
    try {
      const list = await findActiveRoom();
      if (list.data) {
        socket.emit("roomList", list.data);
      } else {
        throw new Error("Unable to Display Room. Please Refresh.");
      }
    } catch (e) {
      socket.emit("errormsg", { message: e.message });
    }
  });
};
