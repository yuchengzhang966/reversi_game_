/*

Version 1.0.0
@author: Yulong He

This file contains source code for the Interactive Game: Reversi

 */

const rev = require("./reversi");
const readlineSync = require("readline-sync");
const fs = require("fs");

// Pass in the Argument for reading JSON Configuration
process.argv.forEach((val, index) => {});

//Check if user type the config file and then read the file

// Declare presetting variables
let readData, letter, ScriptedBoard;
let playerMoves = [];
let botMoves = [];

// Variables to store Game Information

if (process.argv[2] !== undefined) {
  fs.readFile(process.argv[2], "utf8", function (err, data) {
    if (err) {
      console.log("Error in reading the config file!");
    } else {
      // Read the Data from JSON
      readData = JSON.parse(data);
      letter = readData.boardPreset.playerLetter;
      ScriptedBoard = readData.boardPreset.board;
      playerMoves = readData.scriptedMoves.player;
      botMoves = readData.scriptedMoves.computer;

      // load the board
      console.log("Scripted Board Loaded Successfully!");
      const board = ScriptedBoard;

      rev.boardToString(board);

      GamePlay(board, letter, playerMoves, botMoves);
    }
  });
} else {
  IntializeGame();
}

function assignRandomRoomId (){
  return Math.random().toString(36).substring(2, 8)
}



/**
 * Initialize Game without the scripted moving
 *   # it will ask player the width of the board
 *   # it will ask player the letter
 *   # it will initialize the board based on player's setting
 * @param   {Number}  width
 * @return  {Object}  board
 */

function IntializeGame(width) {

  // Initialize Variables
  let isValid = true;

  // Reset switch
  isValid = true;

  // Initialize the Board with 4 pieces in the center

  const CenterPositionIndex = width / 2 - 1;

  const board = rev.generateBoard(width, width, " ");

  // Place four pieces in the center
  board[rev.rowColToIndex(board, CenterPositionIndex, CenterPositionIndex)] =
    "O";
  board[
    rev.rowColToIndex(board, CenterPositionIndex + 1, CenterPositionIndex + 1)
  ] = "O";
  board[
    rev.rowColToIndex(board, CenterPositionIndex, CenterPositionIndex + 1)
  ] = "X";
  board[
    rev.rowColToIndex(board, CenterPositionIndex + 1, CenterPositionIndex)
  ] = "X";

  // Return the Initialized Board
  return board;


}

module.exports = {
  IntializeGame: IntializeGame,
};
