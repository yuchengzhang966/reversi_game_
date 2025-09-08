// reversi.js This will contain the helper function for the programs
// documentation for this file: go to the link below:
// https://www.yuque.com/gkz71a/playreversi



function repeat (value, n){

    const arr = [];
    for (let i=0; i < n; i++){
        arr.push(value);
    }
    return arr;

}

function generateBoard(rows, columns, initialCellValue) {

    return repeat(initialCellValue,rows*columns);

}

function rowColToIndex(board, rowNumber, columnNumber) {

    const boardLength = Math.sqrt(board.length);
    const index = (rowNumber*boardLength) + columnNumber;
    return index;


}

function indexToRowCol(board, i){

    const boardLength = Math.sqrt(board.length);
    const row = Math.floor(i / boardLength);
    const column = i % boardLength;
    const rowCol = {'row':row,'col':column};
    return rowCol;

}

function setBoardCell(board, letter, row, col) {

    const updatedBoard = board.slice();
    updatedBoard[rowColToIndex(board,row,col)] = letter;
    return updatedBoard;

}

function isLetter(c){
    return /^[A-Z]$/i.test(c);
}

function algebraicToRowCol(algebraicNotation) {

    // Check the invalid length
    if (algebraicNotation.split('').length > 3 || algebraicNotation.split('').length < 2 ){
        return undefined;
    }

    const algebraicArr = algebraicNotation.split('');

    //Check Invalid Characters

    let c;

    for (c of algebraicArr){

        // Uppercase Letter: 65-90
        // Lowercase Letter: 97-122
        // Char Numbers: 48-57

        const characterASCII = String(c).charCodeAt(0);
        if(characterASCII > 122){return undefined;}
        if(characterASCII >= 91 && characterASCII <= 96){return undefined;}
        if(characterASCII >= 58 && characterASCII <= 64){return undefined;}
        if(characterASCII <= 47){return undefined;}

    }


    // Check if the first character is letter
    if (isLetter(algebraicArr[0]) === false){
        return undefined;
    }

    // Check the rest of character is number
    for (let i=1; i<algebraicArr.length;i++){
        if (isNaN(algebraicArr[i])){
            return undefined;
        }
    }
    // Check the invalid number of roles
    if (algebraicArr[1] === '0'){
        return undefined;
    }

    // Calculate the column number by offsetting character ASCII
    const column = algebraicArr[0].toUpperCase().charCodeAt(0) - 65;

    // Check and Convert the row number
    let rowNumber = undefined;
    if (algebraicArr.length > 2){
        rowNumber = parseInt(algebraicArr[1] + algebraicArr[2]) - 1;
    }else {
        rowNumber = parseInt(algebraicArr[1]) - 1;
    }

    const rowColResult = {'row':rowNumber,'col':column};
    return rowColResult;

}

function placeLetters(board, letter, ...algebraicNotation){

    // put algebraicNotation into array
    const algebraicArr = algebraicNotation;
    let row = undefined;
    let column = undefined;
    let updatedBoard = board.slice();

    // place the letters into the new board
    for (let i=0; i<algebraicArr.length; i++){

        // Handle exceptions
        if (algebraicToRowCol(algebraicArr[i]) === undefined){
            console.log('Wrong Algebraic Notation!');
            return undefined;
        }

        row = algebraicToRowCol(algebraicArr[i]).row;
        column = algebraicToRowCol(algebraicArr[i]).col;
        updatedBoard = setBoardCell(updatedBoard,letter,row,column);

    }

    return updatedBoard;

}

function boardToString(board) {

    const boardLength = Math.sqrt(board.length);
    let letter = ' '; // placeholder for letter
    // print the fixed first line with characters
    const letterASCII = 65; // Initial ASCII is 'A'
    let firstLine = ' '.repeat(5) + String.fromCharCode(letterASCII);
    for (let i=1; i<boardLength; i++){

        firstLine = firstLine.concat(' '.repeat(3) + String.fromCharCode(letterASCII+i));

    }
    // print the fixed second line
    const secondLine = ' '.repeat(3) + '+---'.repeat(boardLength) + '+';
    let rowLine = ''; // Actual row in the board

    console.log(firstLine);
    console.log(secondLine);

    let letterIndex = 0; // Index for traversing through array

    // Outer loop to print out each row
    for (let i=1;i <= boardLength; i++){

        if (i < 10){
            rowLine = ' ' + i + ' ';
        }else {
            rowLine = i + ' ';
        }


        // Inner loop to print out each column
        for (let rowIndex=0; rowIndex < boardLength; rowIndex++){

            if (board[letterIndex] !== ' '){

               board[letterIndex] === 'X' ? letter = 'X' : letter = 'O';

            }else{
                letter = ' ';
            }

            const boardSpace = '| ' + letter + ' ';
            rowLine = rowLine.concat(boardSpace);
            letterIndex ++;

        }
        rowLine = rowLine.concat('|');
        // print out the row and bar
        console.log(rowLine);
        console.log(secondLine);
    }

}

function isBoardFull(board){

    for (let i=0; i<board.length; i++){
        if (board[i] === ' '){
            return false;
        }
    }

    return true;

}

function flip(board, row, col) {

    const updatedBoard = board.slice();
    const letter = updatedBoard[rowColToIndex(updatedBoard,row,col)];
    if (letter !== ' '){
        switch (letter) {
            case 'X':
                updatedBoard[rowColToIndex(updatedBoard,row,col)] = 'O';
                break;
            case 'O':
                updatedBoard[rowColToIndex(updatedBoard,row,col)] = 'X';
                break;
            default:
                break;
        }
    }
    return updatedBoard;
}

function flipCells(board, cellsToFlip){

    let updatedBoard = board.slice();
    let rowIndex = undefined;
    let colIndex = undefined;

    // Loop through the 3D Array to get the Row and Columns
    for (let i=0; i<cellsToFlip.length; i++){
        for(let j=0; j<cellsToFlip[i].length; j++){
            rowIndex = cellsToFlip[i][j][0];
            colIndex = cellsToFlip[i][j][1];
            updatedBoard = flip(updatedBoard,rowIndex,colIndex);
        }

    }
    return updatedBoard;
}

function getCellsToFlip(board, lastRow, lastCol) {

    // Initialize the variables, currentRow and currentCol used as pointer index to go through the straight line.
    const flippedGroups = [];
    const HorizontalGroups = [];
    const VerticalGroups = [];
    const DiagonalGroups = [];
    const playerLetter = board[rowColToIndex(board,lastRow,lastCol)];
    let currentRow = lastRow;
    let currentCol = lastCol;
    let currentLetter = undefined;

    function checkLeft() {

        let OpponentPos = [];

        while (currentCol > 0){

            currentCol = currentCol - 1; // Update the currentRow, shift to the up by 1;
            currentLetter = board[rowColToIndex(board,currentRow,currentCol)];

            if (currentLetter === ' '){
                OpponentPos = [];
                break;
            }

            if (playerLetter !== currentLetter && currentLetter !== ' '){
                if(currentCol === 0){ // Check the leftmost case
                    OpponentPos = [];
                    break;
                }
                OpponentPos.push([currentRow,currentCol]); // Record position into array
            }else if(currentLetter === playerLetter){ // Clear Array if the
                break;
            }else {
                OpponentPos = [];
            }

        }

        if (OpponentPos.length > 0){
            HorizontalGroups.push(OpponentPos);
        }

        // Reset
        currentRow = lastRow;
        currentCol = lastCol;

    }

    function checkRight() {

        let OpponentPos = [];
        const maxIndex = Math.sqrt(board.length) - 1;

        while (currentCol < maxIndex){

            currentCol = currentCol + 1; // Update the currentCol, shift to the right by 1;
            currentLetter = board[rowColToIndex(board,currentRow,currentCol)];

            if (currentLetter === ' '){
                OpponentPos = [];
                break;
            }

            if (playerLetter !== currentLetter && currentLetter !== ' '){
                if(currentCol === maxIndex){ // Check the rightmost case
                    OpponentPos = [];
                    break;
                }
                OpponentPos.push([currentRow,currentCol]); // Record position into array
            }else if(currentLetter === playerLetter){ // Clear Array if the
                break;
            }else {
                OpponentPos = [];
            }

        }

        if (OpponentPos.length > 0){
            HorizontalGroups.push(OpponentPos);
        }

        // Reset
        currentRow = lastRow;
        currentCol = lastCol;

    }

    function checkUp() {

        let OpponentPos = [];

        while (currentRow > 0){

            currentRow = currentRow - 1; // Update the currentRow, shift to the up by 1;
            currentLetter = board[rowColToIndex(board,currentRow,currentCol)];

            if (currentLetter === ' '){
                OpponentPos = [];
                break;
            }

            if (playerLetter !== currentLetter && currentLetter !== ' '){
                if(currentRow === 0){ // Check the up most case
                    OpponentPos = [];
                    break;
                }
                OpponentPos.push([currentRow,currentCol]); // Record position into array
            }else if(currentLetter === playerLetter){ // Clear Array if the
                break;
            }else {
                OpponentPos = [];
            }

        }

        if (OpponentPos.length > 0){
            VerticalGroups.push(OpponentPos);
        }

        // Reset
        currentRow = lastRow;
        currentCol = lastCol;

    }

    function checkDown() {

        let OpponentPos = [];
        const maxIndex = Math.sqrt(board.length) - 1;

        while (currentRow < maxIndex){

            currentRow = currentRow + 1; // Update the currentRow, shift to the down by 1;
            currentLetter = board[rowColToIndex(board,currentRow,currentCol)];

            if (currentLetter === ' '){
                OpponentPos = [];
                break;
            }

            if (playerLetter !== currentLetter && currentLetter !== ' '){
                if(currentRow === maxIndex){ // Check the down most case
                    OpponentPos = [];
                    break;
                }
                OpponentPos.push([currentRow,currentCol]); // Record position into array
            }else if(currentLetter === playerLetter){ // Clear Array if the
                break;
            }else {
                OpponentPos = [];
            }

        }

        if (OpponentPos.length > 0){
            VerticalGroups.push(OpponentPos);
        }

        // Reset
        currentRow = lastRow;
        currentCol = lastCol;

    }

    function checkUpperLeftDiagonal() {

        let OpponentPos = [];

        while (currentCol > 0 && currentRow >0){

            currentCol = currentCol - 1; // Update the currentRow, shift to the up by 1;
            currentRow = currentRow - 1;

            currentLetter = board[rowColToIndex(board,currentRow,currentCol)];

            if (currentLetter === ' '){
                OpponentPos = [];
                break;
            }

            if (playerLetter !== currentLetter && currentLetter !== ' '){
                if(currentCol === 0 || currentRow === 0){ // Check the leftmost diagonal case
                    OpponentPos = [];
                    break;
                }
                OpponentPos.push([currentRow,currentCol]); // Record position into array
            }else if(currentLetter === playerLetter){ // Clear Array if the
                break;
            }else {
                OpponentPos = [];
            }

        }

        if (OpponentPos.length > 0){
            DiagonalGroups.push(OpponentPos);
        }

        // Reset
        currentRow = lastRow;
        currentCol = lastCol;

    }

    function checkUpperRightDiagonal() {

        let OpponentPos = [];
        const maxIndex = Math.sqrt(board.length) - 1;

        while (currentCol < maxIndex && currentRow >0){

            currentCol = currentCol + 1; // Update the currentRow, shift to the up by 1;
            currentRow = currentRow - 1;

            currentLetter = board[rowColToIndex(board,currentRow,currentCol)];

            if (currentLetter === ' '){
                OpponentPos = [];
                break;
            }

            if (playerLetter !== currentLetter && currentLetter !== ' '){
                if(currentRow === 0 || currentCol === maxIndex){ // Check the rightmost diagonal case
                    OpponentPos = [];
                    break;
                }
                OpponentPos.push([currentRow,currentCol]); // Record position into array
            }else if(currentLetter === playerLetter){ // Clear Array if the
                break;
            }else {
                OpponentPos = [];
            }

        }

        if (OpponentPos.length > 0){
            DiagonalGroups.push(OpponentPos);
        }

        // Reset
        currentRow = lastRow;
        currentCol = lastCol;

    }

    function checkLowerLeftDiagonal(){

        let OpponentPos = [];
        const maxIndex = Math.sqrt(board.length) - 1;

        while (currentCol > 0 && currentRow < maxIndex){

            currentCol = currentCol - 1; // Update the currentRow, shift to the up by 1;
            currentRow = currentRow + 1;

            currentLetter = board[rowColToIndex(board,currentRow,currentCol)];

            if (currentLetter === ' '){
                OpponentPos = [];
                break;
            }

            if (playerLetter !== currentLetter && currentLetter !== ' '){
                if(currentCol === 0 || currentRow === maxIndex){ // Check the leftmost diagonal case
                    OpponentPos = [];
                    break;
                }
                OpponentPos.push([currentRow,currentCol]); // Record position into array
            }else if(currentLetter === playerLetter){ // Clear Array if the
                break;
            }else {
                OpponentPos = [];
            }

        }

        if (OpponentPos.length > 0){
            DiagonalGroups.push(OpponentPos);
        }

        // Reset
        currentRow = lastRow;
        currentCol = lastCol;


    }

    function checkLowerRightDiagonal() {

        let OpponentPos = [];
        const maxIndex = Math.sqrt(board.length) - 1;

        while (currentCol < maxIndex && currentRow < maxIndex){

            currentCol = currentCol + 1; // Update the currentRow, shift to the up by 1;
            currentRow = currentRow + 1;

            currentLetter = board[rowColToIndex(board,currentRow,currentCol)];

            if (currentLetter === ' '){
                OpponentPos = [];
                break;
            }

            if (playerLetter !== currentLetter && currentLetter !== ' '){
                if(currentCol === maxIndex || currentRow === maxIndex){ // Check the rightmost diagonal case
                    OpponentPos = [];
                    break;
                }
                OpponentPos.push([currentRow,currentCol]); // Record position into array
            }else if(currentLetter === playerLetter){ // Clear Array if the
                break;
            }else {
                OpponentPos = [];
            }

        }

        if (OpponentPos.length > 0){
            DiagonalGroups.push(OpponentPos);
        }

        // Reset
        currentRow = lastRow;
        currentCol = lastCol;

    }

    checkLeft();
    checkRight();
    checkUp();
    checkDown();
    checkUpperLeftDiagonal();
    checkUpperRightDiagonal();
    checkLowerLeftDiagonal();
    checkLowerRightDiagonal();

    //Convert the result of 3D Array to 2D Array for better grouping
    const newHorizontalGroup = [];
    const newVerticalGroup = [];
    const newDiagonalGroup = [];

    //Helper function to convert 3D Arrary into 2D Array
    function convert3DArr(inputArr,outputArr){

        for(let i=0; i<inputArr.length; i++){
            for (let j=0; j<inputArr[i].length; j++){
                outputArr.push(inputArr[i][j]);
            }
        }
    }

    convert3DArr(HorizontalGroups,newHorizontalGroup);
    convert3DArr(VerticalGroups,newVerticalGroup);
    convert3DArr(DiagonalGroups,newDiagonalGroup);

    // Combine Arrays and ready to return
    if (newHorizontalGroup.length > 0){flippedGroups.push(newHorizontalGroup);}
    if (newVerticalGroup.length > 0){flippedGroups.push(newVerticalGroup);}
    if (newDiagonalGroup.length > 0){flippedGroups.push(newDiagonalGroup);}

    // For Debug Purposes
    // console.log(`Current Position: ${currentRow},${currentCol},${playerLetter}`);
    // console.log('Horizontal Groups:');
    // console.log(HorizontalGroups);
    // console.log('Vertical Groups:');
    // console.log(VerticalGroups);
    // console.log('Diagonal Groups:');
    // console.log(DiagonalGroups);
    // console.log(flippedGroups);

    return flippedGroups;

}

function isValidMove(board, letter, row, col){

    const intendedMoveIndex = rowColToIndex(board,row,col);

    function isEmptySquare() {

        if (board[intendedMoveIndex] === ' '){
            // console.log("Is Blank!")    //debug
            return true;
        }else {
            return false;
        }

    }

    function isInBoundary() {


        if(row < 0 || col < 0){
            return false;
        }

        if (board[intendedMoveIndex] === undefined){
            // console.log("Not in boundary")  //debug
            return false;
        }else {
            // console.log("In Boundary!")
            return true;
        }

    }

    function isOpponentFlipped() {

        const intendedBoard = board.slice();
        intendedBoard[rowColToIndex(intendedBoard,row,col)] = letter; //place the intended letter
        const flipped = getCellsToFlip(intendedBoard,row,col);

        // console.log(flipped);   //debug

        if (flipped.length !== 0){
            // console.log("Opponent Flipped!")    //debug
            return true;
        }else {
            return false;
        }
    }

    return isEmptySquare() && isInBoundary() && isOpponentFlipped();

}

function isValidMoveAlgebraicNotation(board, letter, AlgebraicNotation){

    const convertedRolCol = algebraicToRowCol(AlgebraicNotation);
    let row;
    let col;

    if (convertedRolCol !== undefined){
        row = convertedRolCol.row;
        col = convertedRolCol.col;
    }
    return isValidMove(board,letter,row,col);

}

function getLetterCounts(board){

    // Initialize the 'X' and 'O'
    let X = 0;
    let O = 0;
    let letter;

    for (letter of board){
        switch (letter) {

            case 'X':
                X++;
                break;

            case 'O':
                O++;
                break;

            default:
                break;

        }
    }

    return {'X':X,'O':O};

}

function getValidMoves(board, letter) {

    // Initialize the Moving Index
    let rowIndex = 0;
    let colIndex = 0;
    const validMoves = [];

    for (let i = 0; i < board.length; i++) {

        rowIndex = indexToRowCol(board, i).row;
        colIndex = indexToRowCol(board, i).col;

        if (isValidMove(board, letter, rowIndex, colIndex)) {
            validMoves.push([rowIndex, colIndex]);
        }


    }

    return validMoves;
}

module.exports = {

    repeat: repeat,
    generateBoard:generateBoard,
    rowColToIndex:rowColToIndex,
    indexToRowCol:indexToRowCol,
    setBoardCell:setBoardCell,
    algebraicToRowCol:algebraicToRowCol,
    placeLetters:placeLetters,
    boardToString:boardToString,
    isBoardFull:isBoardFull,
    flip:flip,
    flipCells:flipCells,
    getCellsToFlip:getCellsToFlip,
    isValidMove:isValidMove,
    isValidMoveAlgebraicNotation:isValidMoveAlgebraicNotation,
    getLetterCounts:getLetterCounts,
    getValidMoves:getValidMoves


};



