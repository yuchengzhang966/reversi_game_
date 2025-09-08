const game = require("../../Game/game");
const rand = require("../../utils/random");
const gameModel = require("../../model/Game");
const roomModel = require("../../model/Room");
const userModel = require("../../model/User");
const log = require("../../utils/log");
const { func } = require("joi");
const { endianness } = require("os");

/**
 * Assign the player who joined the game
 *
 * @param   {[type]}  game      game object
 * @param   {[type]}  playerId  player _id
 *
 * @return  {[type]}            [return description]
 */
function assignPlayerLetter(game, playerId) {
  // If never assigned
  if (game.playerO !== playerId && game.playerX !== playerId) {
    // Since the letter is assigned once the game is initialized
    // We don't need to assign twice when the host is joined
    if (game.playerO) return { playerX: playerId };
    if (game.playerX) return { playerO: playerId };
  }
}

/**
 * Assign Host Letter when the game is initializing
 *
 * @param   {[type]}  playerId  [playerId description]
 * @return  {[type]}            [return description]
 */
function assignHostLetter(playerId) {
  const seed = Math.random() < 0.5 ? 0 : 1;
  return seed === 0 ? { playerX: playerId } : { playerO: playerId };
}

/**
 * Initialize Game
 * @param   {String}  currentPlayerId  user _id
 * @param   {String}  roomId           room _id
 * @return  {Object}  Saved Game Info
 */
async function initializeGame(currentPlayerId, roomId) {
  const board = game.initializeGame(8);
  const gameId = "G-" + rand.generateRoomId();
  // Save Game into Database
  try {
    const newGame = new gameModel({
      gameId: gameId,
      board: board,
      ...assignHostLetter(currentPlayerId),
    });

    const savedGame = await newGame.save();
    await roomModel.findByIdAndUpdate(roomId, {
      $set: { gameId: savedGame._id, isOngoing: true },
    });

    return { message: "Game Initialized", data: savedGame };
  } catch (e) {
    console.error(e);
    return { message: "Failed to initialize Game", error: e.message };
  }
}
/**
 * When a player attempts to join the game, first check validation, then update the game status
 * @param   {String}  currentPlayerId  user _id
 * @param   {String}  gameId           room _id
 * @return  {String}  Saved Game Info
 */
async function addPlayerToGame(gameId, currentPlayerId) {
  try {
    const game = await gameModel.findById(gameId).lean().exec();

    // Check if player is already in game
    if (isPlayerInGame(game, currentPlayerId)) {
      return { message: "Player Already in Game", error: "PlayerInGame" };
    }

    const letter = assignPlayerLetter(game, currentPlayerId);

    const update = {
      $push: { currentPlayers: currentPlayerId },
      ...letter,
    };

    const newGame = await gameModel.findByIdAndUpdate(gameId, update, {
      new: true,
    });
    return { message: "Player Added to Game", data: newGame };
  } catch (e) {
    return { message: "Failed to add player", error: e.message };
  }
}

/**
 * helper function: check is the player is in game
 * @param   {String}  currentPlayerId  user _id
 * @param   {String}  game             game
 * @return  {Bool} 
 */
function isPlayerInGame(game, currentPlayerId) {
  for (let i = 0; i < game.currentPlayers.length; i++) {
    if (String(game.currentPlayers[i]) === currentPlayerId) {
      return true;
    }
  }
  return false;
}

function takeTurn(currentTurn) {
  return currentTurn === "X" ? "O" : "X";
}

/**
 * Make move, calculate and save the board to database
 * @param {String} board
 * @param {String} letter
 * @param {String} move
 * @param {String} gameId
 *
 * @return Saved Game Object
 */
async function makeMove(board, letter, move, gameId) {
  try {
    const newBoard = game.makeMove(board, letter, move);
    if (newBoard.board) {
      const savedGame = await gameModel
        .findByIdAndUpdate(
          gameId,
          {
            $set: {
              board: newBoard.board,
              lastMoveBoard: newBoard.oldBoard,
              turn: takeTurn(letter),
              scoreX: newBoard.score.X,
              scoreO: newBoard.score.O,
              flippedCells: newBoard.flippedCells,
              lastMove: move,
            },
          },
          { new: true }
        )
        .lean()
        .exec();
      return savedGame;
    } else {
      throw new Error(newBoard.message);
    }
  } catch (e) {
    return { message: e.message };
  }
}

/**
 * helper function: compute the score the winner wins
 */
function computeScore(winnerChess, winnerScore, loserChess, loserScore) {
  const gamePercentage = winnerChess / loserChess; //1~2
  const scorePercentage =
    winnerScore > loserScore
      ? winnerScore / loserScore
      : loserScore / winnerScore;
  const gameRatio =
    winnerScore >= loserScore ? gamePercentage * 0.3 : gamePercentage * 0.6; //0.3~1.2
  const scoreRatio = winnerScore >= loserScore ? 0 : Math.sqrt(scorePercentage);
  var scoreEarn = 50 * (1 + scoreRatio + gameRatio);

  if (scoreEarn > winnerScore) {
    scoreEarn = winnerScore;
  }
  return Math.round(scoreEarn);
}

/**
 * When the game ends, clean up the room, update the two players' overall score
 * @param   {String}  gameId  game _id
 * @param   {String}  roomId  room _id
 * @return  {Object}  winner Info
 */
async function gameEnd(gameId, roomId) {
  try {
    const res = await gameModel.findById(gameId).lean().exec();

    // Draw Situation
    if (res.scoreX === res.scoreO) {
      await gameModel.findByIdAndUpdate(gameId, { isFinished: true });

      await userModel.findByIdAndUpdate(res.playerX, {
        $push: {
          gameRecords: res._id,
        },
        $inc: {
          matches: 1,
        },
      });

      await userModel.findByIdAndUpdate(res.playerO, {
        $push: {
          gameRecords: res._id,
        },
        $inc: {
          matches: 1,
        },
      });

      await roomModel.findByIdAndUpdate(roomId, {
        isOngoing: false,
      });

      return { draw: true, scoreEarn: 0 };
    } else {
      const winner = res.scoreX > res.scoreO ? "X" : "O";
      const loser = winner === "X" ? "O" : "X";
      const winnerUserId = res[`player${winner}`];
      const loserUserId = res[`player${loser}`];

      const winnerChess = winner === "X" ? res.scoreX : res.scoreO;
      const loserChess = winner === "X" ? res.scoreO : res.scoreX;

      const winnerUser = await userModel.findById(winnerUserId);
      const loserUser = await userModel.findById(loserUserId);

      const scoreEarn = computeScore(
        winnerChess,
        winnerUser.score,
        loserChess,
        loserUser.score
      );

      await gameModel.findByIdAndUpdate(gameId, {
        $set: {
          winner: winnerUserId,
          isFinished: true,
        },
      });
      // Update Winner
      await userModel.findByIdAndUpdate(winnerUserId, {
        $push: {
          gameRecords: res._id,
        },
        $inc: {
          score: scoreEarn,
          matches: 1,
        },
      });
      // Update Loser
      await userModel.findByIdAndUpdate(loserUserId, {
        $push: {
          gameRecords: res._id,
        },
        $inc: {
          matches: 1,
        },
      });
      // Update Room Status
      await roomModel.findByIdAndUpdate(roomId, {
        isOngoing: false,
      });
      return { winner: winner, winnerId: winnerUserId, scoreEarn: scoreEarn };
    }
  } catch (e) {
    console.error(e);
    return { message: e.message };
  }
}

function checkAvailableMoves(board, letter) {
  return game.checkAvailableMoves(board, letter);
}

/**
 * helper function
 * @param {String} gameId _id
 */
async function getGameInfo(gameId) {
  try {
    const game = await gameModel.findById(gameId).lean().exec();
    return game;
  } catch (e) {
    console.error(e);
    return { message: e.message };
  }
}

module.exports = {
  initializeGame: initializeGame,
  addPlayerToGame: addPlayerToGame,
  makeMove: makeMove,
  checkAvailableMoves: checkAvailableMoves,
  gameEnd: gameEnd,
  getGameInfo: getGameInfo,
};
