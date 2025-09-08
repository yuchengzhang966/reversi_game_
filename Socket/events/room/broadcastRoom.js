const { findActiveRoom } = require("../../../controller/room/index");
module.exports = function (socket, io) {
  socket.on("broadcastRoom", async () => {
    try {
      const list = await findActiveRoom();
      if (list.data) {
        io.emit('roomList', list.data);
      } else {
        throw new Error("Unable to Display Room. Please Refresh.");
      }
    } catch (e) {
      socket.emit("errormsg", { message: e.message });
    }
  });
};
