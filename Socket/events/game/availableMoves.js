const game = require("../../../controller/game");
const rev = require("../../../Game/reversi");
const log = require("../../../utils/log");

/**
 * check if there are available moves, and display
 * @param   {Object}  socket
 */
module.exports = function (socket) {
  socket.on("availableMoves", async (data) => {
    const [board, letter] = [data.board, data.side];
    try {
      const availableMoves = game.checkAvailableMoves(board, letter);
      if (availableMoves.length > 0) {
        socket.emit("availableMoves", { data: availableMoves });
      } else {
        socket.to(socket.user_room).emit('OppoNoAvailableMoves');
        throw new Error("No Available Moves");
      }
    } catch (e) {
      socket.emit("errormsg", { message: e.message });
    }
  });
};
