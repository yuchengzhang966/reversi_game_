module.exports = function (io) {
  io.on("disconnect", function (socket) {
    console.log('disconnected!')
  });
};
