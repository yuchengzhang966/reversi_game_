const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  roomHost:{
    type: mongoose.Schema.Types.ObjectID,
    ref: 'User'
  },
  currentPlayers: {
    type: [{type: mongoose.Schema.Types.ObjectID, ref: 'User'}],
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Game",
  },
  isFull: {
    type: Boolean,
    default: false,
  },
  isOngoing: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  spectators:{
      type: [mongoose.Schema.Types.ObjectID],
      ref: "User",
  },
  sessionId: {
    type: [String],
  },
});

module.exports = mongoose.model("Room", roomSchema);
