const { initializeGame } = require("./game");
const rev = require("./reversi");
const game = require('./game');
let botPass;
let botLetter;
let currentScore;

function IntializeGame(width) {
  
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

// Input: player board, player letter, player move
// return: bot move, bot old board, bot new board
function botOptimalMove(playerBoard, playerLetter, playerMove) {
    // stimulate player move
    // check for validity     
    const result = game.makeMove(playerBoard, playerLetter, playerMove); 
    console.log(result);
    let playerNewBoard = result.board;
    console.log(playerNewBoard);

    // player's move is valid
    // find bot's optimal next move using greedy search algorithm

    if (playerLetter == "X") {
        botLetter = "O";
    } else{
        botLetter = "X";
    }
    
    // produce all possible valid moves for bot
    const botAvailableMoves = rev.getValidMoves(playerNewBoard, botLetter);
    if (botAvailableMoves.length === 0) {
        readlineSync.question(
        "BOT does not have valid move. BOT chooses to PASS! Press <Enter> to continue "
        );
    } else {
        let optimal = 0;
        let optimalMove;

        // greedy search algorithm
        for(i = 0; i < botAvailableMoves.length; i++){
            const currentMove = botAvailableMoves[i];
            let currentBoard = playerNewBoard.slice();
            currentBoard[
                rev.rowColToIndex(currentBoard, currentMove[0], currentMove[1])
            ] = botLetter;
            
            const botCurrentFlippedCells = rev.getCellsToFlip(
                currentBoard,
                currentMove[0],
                currentMove[1]
            );
        
            if (botLetter === "X") {
                currentScore = rev.getLetterCounts(currentBoard).X;
            }
            else{
                currentScore = rev.getLetterCounts(currentBoard).O;
            }
            if (currentScore > optimal){
                optimal = currentScore;
                optimalMove = botAvailableMoves[i];
            }
        }

        let newBoard = playerNewBoard.slice();
        // Place optimal move and update the board
        newBoard[
        rev.rowColToIndex(newBoard, optimalMove[0], optimalMove[1])
        ] = botLetter;

        // Update the board and score
        const botFlippedCells = rev.getCellsToFlip(
        newBoard,
        optimalMove[0],
        optimalMove[1]
        );
        newBoard = rev.flipCells(newBoard, botFlippedCells);

        // Print out the board before the bot moves;
        rev.boardToString(playerNewBoard)

        // Print out the board after the bot moves;
        rev.boardToString(newBoard);
        
        // Tell player which move the bot makes
        console.log("-".repeat(30));
        console.log(
        `The BOT placed letter at [${optimalMove[0] + 1},${optimalMove[1] + 1}]`
        );
        console.log("-".repeat(30));
    }
}

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
        return {
        lastMove: move,
        oldBoard: board,
        board: newBoard,
        availableMoves: availableMoves,
        };
    } catch (e) {
        return { message: e.message };
    }
}

let playerBoard = initializeGame(8);
const result = botOptimalMove(playerBoard, "X", "E6");
console.log(result);