const game = require("../../../controller/game");
const log = require("../../../utils/log");

/**
 * one player makes a move, then notify the board 
 * @param   {Object}  socket
 */
module.exports = function (socket) {
  socket.on("chessDown", async (data) => {
    const [board, letter, move, room, gameId] = [
      data.board,
      data.side,
      data.lastMove,
      data.room,
      data.gameId,
    ];
    try {
      const newBoard = await game.makeMove(board, letter, move, gameId);
      console.log(newBoard);

      if (newBoard.board) {
        socket.emit("chessDown", { data: newBoard });
        socket.to(room).emit("chessDown", { data: newBoard });
      } else {
        socket.emit("errormsg", { message: newBoard.message });
      }
    } catch (e) {
      socket.emit("errormsg", { message: e.message });
      console.error(e.message);
    }
  });
};
