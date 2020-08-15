var originalBoard;
const humanPlayer = '0';
const aiPlayer = 'X';
//arrays that contains all winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

const cells = document.querySelectorAll('.cell'); //stores a reference to each cell that has class = cell
startGame();

function startGame() {
    document.querySelector('.endgame').style.display = 'none';
    originalBoard = Array.from(Array(9).keys()); // array with numbers from 0 to 9
    for (let i = 0; i < cells.length; ++i) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if (typeof originalBoard[square.target.id] == 'number') { //empty cell
        turn(square.target.id, humanPlayer);
        if (!checkTie()) {
            turn(bestSpot(), aiPlayer);
        }
    }
}

function turn(squareId, player) {
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(originalBoard, player);
    if (gameWon) {
        gameOver(gameWon);
    }
}

function checkWin(gameBoard, player) {
    let plays = gameBoard.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []); // goes to every element of a board array a is accumulator and it will be given at the and, has initial value of [], e is the element of a board array that we are going through  and i is index. This is a way to find every index that the played has played in
    let gameWon = null;
    for (let [index, win] of winningCombinations.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) { // determine if the player has played in a winning combo
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winningCombinations[gameWon.index]) {
        document.getElementById(index.toString()).style.backgroundColor = gameWon.player == humanPlayer ? 'blue' : 'red';
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player === humanPlayer ? 'You win!' : 'You lose');
}

function emptySquares() {
    return originalBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(originalBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length == 0) { //every squares are filled up and nobody has won
        for (let i = 0; i < cells.length; ++i) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner('Tie Game!');
        return true;
    }
    return false;
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function minimax(newBoard, player) {
    let availSpots = emptySquares();

    if (checkWin(newBoard, humanPlayer)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }
    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            let result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}