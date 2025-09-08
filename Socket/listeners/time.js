module.exports = function (io) {
  io.on("time", function (socket) {
    console.log('resquested for time');
  });
};
