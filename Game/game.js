const { func } = require("joi");
const rev = require("./reversi");

/**
 * set up the board
 * @param {Number}  width
 */
function initializeGame(width) {
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

  return board;
}

/**
 * Dynamically created the 64 Algrebraic Array
 */

const row = [];
for (let i = 1; i <= 8; i++) {
  const col = [];
  for (let j = 1; j <= 8; j++) {
    col.push(String.fromCharCode(64 + i) + j);
  }
  row.push(col);
}

function rowColtoAlgebraic(rowCol) {
  return row[rowCol[1]][rowCol[0]];
}

/**
 * Check Avaiable Moves Algrebraically
 * @param {String} board
 * @param {String} letter
 */
function checkAvailableMoves(board, letter) {
  const validMoves = rev.getValidMoves(board, letter);
  if (validMoves.length > 0) {
    const validMovesAlgrebraic = validMoves.map((e) => rowColtoAlgebraic(e));
    return validMovesAlgrebraic;
  } else {
    return [];
  }
}

/**
 * Calculate the flipped cells, and reurn the algebraic values
 * @param {*} cellsToFlip
 */
function getFlippedCellsAlgebraic(cellsToFlip) {
  let rowIndex, colIndex;
  let converted = [];

  for (let i = 0; i < cellsToFlip.length; i++) {
    for (let j = 0; j < cellsToFlip[i].length; j++) {
      rowIndex = cellsToFlip[i][j][0];
      colIndex = cellsToFlip[i][j][1];
      converted.push(rowColtoAlgebraic([rowIndex, colIndex]));
    }
  }

  return converted;
}

/**
 * Player make move
 * @param {String} board
 * @param {String} letter
 * @param {String} move
 */
function makeMove(board, letter, move) {
  try {
    // Copy the board
    let newBoard = board.slice();

    // Get total available moves from the board
    const availableMoves = rev.getValidMoves(newBoard, letter);

    // If the notation is invalid, then return
    if (!rev.isValidMoveAlgebraicNotation(newBoard, letter, move)) {
      throw new Error("Invalid Move");
    }

    // TODO: Take the final turn here
    // If there is no available move, return
    if (availableMoves.length === 0) {
      throw new Error("No Available Moves");
    }

    // Place the letter to the new board
    newBoard = rev.placeLetters(newBoard, letter, move);
    // Get the cells that are able to flip and then flip the cells
    const flippedCells = rev.getCellsToFlip(
      newBoard,
      rev.algebraicToRowCol(move).row,
      rev.algebraicToRowCol(move).col
    );

    newBoard = rev.flipCells(newBoard, flippedCells);

    // Calculate Score
    const currentScore = rev.getLetterCounts(newBoard);

    return {
      lastMove: move,
      oldBoard: board,
      board: newBoard,
      score: currentScore,
      availableMoves: availableMoves,
      flippedCells: getFlippedCellsAlgebraic(flippedCells),
    };
  } catch (e) {
    return { message: e.message };
  }
}

module.exports = {
  initializeGame: initializeGame,
  makeMove: makeMove,
  checkAvailableMoves: checkAvailableMoves,
};
