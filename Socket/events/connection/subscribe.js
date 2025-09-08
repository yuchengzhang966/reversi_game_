const { checkConnect } = require("../../../controller/connect/index");
const updateOnlineUserList = require("../../controller/updateOnlineUserList");

module.exports = function (socket, io) {
  socket.on("subscribe", async (data) => {
    try {
      // Bind user data to socket
      // lean user object
      const leanUser = { ...data.user };
      ["_id", "password", "date", "gameRecords"].forEach(
        (e) => delete leanUser[e]
      );

      socket.user = leanUser;
      // Bind the userId to this socket
      await checkConnect(data.user._id, socket.id);

      updateOnlineUserList(io);
    } catch (e) {
      console.error(e);
    }
  });
};
