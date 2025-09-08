const { countUsers } = require("../../../controller/user/index");
module.exports = function (socket) {
  socket.on("getTotalUserCount", async () => {
    try {
      const count = await countUsers();
      socket.emit("userCount", count);
    } catch (e) {
      socket.emit("errormsg", { message: e.message });
    }
  });
};
