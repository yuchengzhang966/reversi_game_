const { findActiveRoom } = require("../../controller/room/index");

/**
 * update the room list
 * @param   {Object}  io
 * @param   {Object}  socket
 */
async function updateRoomList(io, socket) {
  try {
    const list = await findActiveRoom();
    if (list.data) {
      io.emit("roomList", list.data);
    } else {
      throw new Error("Unable to Display Room. Please Refresh.");
    }
  } catch (e) {
    socket.emit("errormsg", { message: e.message });
  }
}

module.exports = updateRoomList;
