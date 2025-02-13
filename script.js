const cells = document.querySelectorAll('.cell');
const result = document.getElementById('result');
const restartButton = document.getElementById('restart-button');
const gameModeSelect = document.getElementById('game-mode');
let currentPlayer = 'X';
let gameBoard = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];
let gameMode = 'player'; // Default to two players

// Function to check for a win
const checkWin = () => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (gameBoard[Math.floor(a / 3)][a % 3] &&
        gameBoard[Math.floor(a / 3)][a % 3] === gameBoard[Math.floor(b / 3)][b % 3] &&
        gameBoard[Math.floor(a / 3)][a % 3] === gameBoard[Math.floor(c / 3)][c % 3]) {
      return gameBoard[Math.floor(a / 3)][a % 3];
    }
  }

  return null; // No winner
};

// Function to check for a draw
const checkDraw = () => {
  for (let row of gameBoard) {
    for (let cell of row) {
      if (cell === '') {
        return false; // Game is not a draw
      }
    }
  }
  return true; // Game is a draw
};

// Function to make AI move with a delay
const aiMove = () => {
  setTimeout(() => {
    let bestScore = -Infinity;
    let move;

    // Prioritize center move
    if (gameBoard[1][1] === '') {
      move = { i: 1, j: 1 };
    } else {
      // Prioritize corner moves
      const corners = [
        [0, 0], [0, 2], [2, 0], [2, 2]
      ];
      for (const [i, j] of corners) {
        if (gameBoard[i][j] === '') {
          move = { i, j };
          break;
        }
      }

      // If no corners are available, choose an edge
      if (!move) {
        const edges = [
          [0, 1], [1, 0], [1, 2], [2, 1]
        ];
        for (const [i, j] of edges) {
          if (gameBoard[i][j] === '') {
            move = { i, j };
            break;
          }
        }
      }
    }

    if (move) {
      gameBoard[move.i][move.j] = 'O';
      updateBoard();
    }

    if (checkWin()) {
      result.textContent = `${currentPlayer} wins!`;
    } else if (checkDraw()) {
      result.textContent = "It's a draw!";
    } else {
      currentPlayer = 'X'; 
    }

  }, 500); // Delay of 500 milliseconds (adjust as needed)
};

// Minimax algorithm for AI (omitted for brevity)

// Function to update the board
const updateBoard = () => {
  cells.forEach((cell) => {
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));
    cell.textContent = gameBoard[row][col];
  });
};

// Function to handle player moves
const handlePlayerMove = (row, col) => {
  if (gameBoard[row][col] === '' && !checkWin() && !checkDraw()) {
    gameBoard[row][col] = currentPlayer;
    updateBoard();

    if (checkWin()) {
      result.textContent = `${currentPlayer} wins!`;
    } else if (checkDraw()) {
      result.textContent = "It's a draw!";
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (gameMode === 'ai' && currentPlayer === 'O') {
        aiMove();
      }
    }
  }
};

// Event listeners
cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));
    handlePlayerMove(row, col);
  });
});

restartButton.addEventListener('click', () => {
  gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  currentPlayer = 'X';
  updateBoard();
  result.textContent = '';
});

gameModeSelect.addEventListener('change', () => {
  gameMode = gameModeSelect.value;
  restartGame(); 
});

// Initial game setup
updateBoard();