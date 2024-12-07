const boardSize = 10;
const mineCount = 20;
const board = document.getElementById('board');
const resetButton = document.getElementById('reset');
let tiles = [];
let gameOver = false;

function generateBoard() {
  tiles = [];
  gameOver = false;
  board.innerHTML = '';
  let mines = Array(mineCount).fill(true).concat(Array(boardSize * boardSize - mineCount).fill(false));
  mines = shuffle(mines);

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.dataset.row = row;
      tile.dataset.col = col;
      tile.dataset.mine = mines[row * boardSize + col];
      tile.addEventListener('click', handleTileClick);
      tile.addEventListener('contextmenu', handleTileFlag);
      board.appendChild(tile);
      tiles.push(tile);
    }
  }

  for (const tile of tiles) {
    const { row, col } = tile.dataset;
    const neighbors = getNeighbors(parseInt(row), parseInt(col));
    const adjacentMines = neighbors.filter(n => n.dataset.mine === 'true').length;
    tile.dataset.adjacentMines = adjacentMines;
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getNeighbors(row, col) {
  const neighbors = [];
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && c >= 0 && r < boardSize && c < boardSize && (r !== row || c !== col)) {
        const neighbor = tiles.find(t => t.dataset.row == r && t.dataset.col == c);
        neighbors.push(neighbor);
      }
    }
  }
  return neighbors;
}

function handleTileClick(event) {
  if (gameOver) return;
  
  const tile = event.target;
  if (tile.classList.contains('revealed') || tile.classList.contains('flagged')) return;

  if (tile.dataset.mine === 'true') {
    tile.classList.add('game-over');
    alert('Game Over!');
    gameOver = true;
    revealAllMines();
  } else {
    revealTile(tile);
  }
}

function handleTileFlag(event) {
  event.preventDefault();
  if (gameOver) return;

  const tile = event.target;
  if (tile.classList.contains('revealed')) return;

  tile.classList.toggle('flagged');
}

function revealTile(tile) {
  if (tile.classList.contains('revealed')) return;
  tile.classList.add('revealed');

  const adjacentMines = tile.dataset.adjacentMines;
  if (adjacentMines > 0) {
    tile.textContent = adjacentMines;
  } else {
    const neighbors = getNeighbors(tile.dataset.row, tile.dataset.col);
    for (const neighbor of neighbors) {
      revealTile(neighbor);
    }
  }
}

function revealAllMines() {
  for (const tile of tiles) {
    if (tile.dataset.mine === 'true') {
      tile.classList.add('revealed');
      tile.textContent = '💣';
    }
  }
}

resetButton.addEventListener('click', generateBoard);

generateBoard();
