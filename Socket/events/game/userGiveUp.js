const game = require("../../../controller/game");
const rev = require("../../../Game/reversi");
const log = require("../../../utils/log");

/**
 * if the user gave up, then end game
 * @param   {Object}  socket
 */
module.exports = function (socket) {
  socket.on("userGiveUp", async (data) => {
    try {
      const result = await game.gameEnd(data.gameId, data.roomId);
      if (!result.winner) throw new Error(result.message);
      socket.emit("gameEnd", { data: result });
      socket.to(socket.user_room).emit("gameEnd", { data: result });
    } catch (e) {
      socket.emit("errormsg", { message: e.message });
    }
  });
};
