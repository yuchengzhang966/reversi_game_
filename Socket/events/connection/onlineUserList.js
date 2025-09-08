const updateOnlineUserList = require("../../controller/updateOnlineUserList");

module.exports = function (socket, io) {
  socket.on("onlineUserList", async () => {
    try {
      updateOnlineUserList(io);
    } catch (e) {
      console.error(e);
    }
  });
};
