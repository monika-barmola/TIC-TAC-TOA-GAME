const cells = document.querySelectorAll("[data-cell]");
const gameStatus = document.getElementById("game-status");
const restartBtn = document.getElementById("restartBtn");
const difficultySelect = document.getElementById("difficulty");
let currentPlayer = "X"; // Player
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let difficulty = "easy";

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

// Handle player click on cell
function handleClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (board[cellIndex] !== "" || !gameActive || currentPlayer !== "X") {
        return;
    }

    updateBoard(cell, cellIndex, "X"); // Player move
    checkWinner();

    if (gameActive) {
        setTimeout(computerPlay, 500);  // Delay for computer move
    }
}

// Update board after a move
function updateBoard(cell, index, player) {
    board[index] = player;
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
}

// Check for winner or draw
function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameStatus.textContent = `${currentPlayer === "X" ? "YOU" : "COMPUTER"} wins!`;
        gameActive = false;
    } else if (!board.includes("")) {
        gameStatus.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        gameStatus.textContent = currentPlayer === "X" ? "Your turn" : "Computer's turn";
    }
}

// Computer plays its turn based on difficulty
function computerPlay() {
    let move;

    switch (difficulty) {
        case "easy":
            move = getRandomMove();
            break;
        case "medium":
            move = getBlockingMove() || getRandomMove();
            break;
        case "hard":
            move = getBestMove();
            break;
    }

    if (move !== undefined && gameActive) {
        const cellElement = cells[move];
        updateBoard(cellElement, move, "O"); // Computer move
        checkWinner();
    }
}

// Get a random available move
function getRandomMove() {
    const availableCells = board.map((val, index) => val === "" ? index : null).filter(val => val !== null);
    return availableCells[Math.floor(Math.random() * availableCells.length)];
}

// Get the best move using minimax algorithm
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

// Minimax algorithm to calculate the best move
function minimax(board, depth, isMaximizing) {
    const scores = { X: -1, O: 1, tie: 0 };
    let result = checkGameResult();
    if (result !== null) {
        return scores[result];
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

// Get the move that blocks the player
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

// Restart the game
function restartGame() {
    currentPlayer = "X";
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    gameStatus.textContent = "Your turn";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o");
    });
}

// Set difficulty level on change
difficultySelect.addEventListener("change", (e) => {
    difficulty = e.target.value;
});

// Add event listeners
cells.forEach(cell => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", restartGame);
