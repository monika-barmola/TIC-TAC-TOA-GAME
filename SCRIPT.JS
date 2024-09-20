const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty');
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let difficulty = 'easy';

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Handle player click
function handleClick(e) {
    const index = e.target.getAttribute('data-index');

    if (board[index] !== "" || !gameActive) {
        return;
    }

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase());

    if (checkGameResult()) {
        endGame(checkGameResult());
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (currentPlayer === "O") {
        computerMove();
    }
}

// Computer's move based on difficulty
function computerMove() {
    let move;
    if (difficulty === 'easy') {
        move = getRandomMove();
    } else if (difficulty === 'medium') {
        move = getBlockingMove() || getRandomMove();
    } else {
        move = getBestMove();
    }

    board[move] = "O";
    cells[move].textContent = "O";
    cells[move].classList.add('o');

    if (checkGameResult()) {
        endGame(checkGameResult());
    }

    currentPlayer = "X";
}

// Get random move
function getRandomMove() {
    let availableMoves = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Minimax algorithm for hard difficulty
function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let result = checkGameResult();
    if (result !== null) {
        if (result === "O") return 10;
        if (result === "X") return -10;
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check game result
function checkGameResult() {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return board.includes("") ? null : "tie";
}

// End the game
function endGame(result) {
    let message;
    if (result === "X") {
        message = "You Win!";
    } else if (result === "O") {
        message = "Computer Wins!";
    } else {
        message = "It's a Tie!";
    }

    // Store result in localStorage and navigate to result page
    localStorage.setItem('gameResult', message);
    setTimeout(() => {
        window.location.href = "win.html";
    }, 500);
}

// Get blocking move in medium difficulty
function getBlockingMove() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "X";
            if (checkGameResult() === "X") {
                board[i] = "";
                return i;
            }
            board[i] = "";
        }
    }
    return null;
}

// Restart game
function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x', 'o');
    });
    currentPlayer = "X";
    gameActive = true;
}

// Add event listeners
cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
difficultySelect.addEventListener('change', (e) => difficulty = e.target.value);
