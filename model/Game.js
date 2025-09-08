const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  gameId: {
    type: String,
  },
  board: {
    type: [String],
  },
  lastMoveBoard: {
    type: [String],
  },
  playerX: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
  },
  playerO: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
  },
  turn: {
    type: String,
    default: "X",
  },
  currentPlayers: {
    type: [mongoose.Schema.Types.ObjectID],
    ref: "User",
  },
  lastMove: {
    type: [String],
  },
  flippedCells: {
    type: [String],
  },
  isStarted: {
    type: Boolean,
    default: false,
  },
  isFinished: {
    type: Boolean,
    default: false,
  },
  winner: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
  },
  timeLast: {
    type: Date,
  },
  scoreX: {
    type: Number,
    default: 0,
  },
  scoreO: {
    type: Number,
    default: 0,
  },
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Game", gameSchema);
