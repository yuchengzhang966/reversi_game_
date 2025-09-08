const connectedEvent = require("../events/connected");
module.exports = function (io) {
  io.on("connection", function (socket) {
    connectedEvent(socket, io);
  });
};
