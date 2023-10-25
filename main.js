

//*----- constants -----*//

const gameState = {
  a1: 0,
  a2: 0,
  a3: 0,
  a4: 0,
  a5: 0,
  a6: 0,
  a7: 0,
  a8: 0,
  a9: 0
}

//*----- state variables -----*//

let turn; // 0 or 1 / red or blue
let xScore;
let oScore;
let xLeft;
let oLeft;

//*----- cached elements  -----*//

cells = document.querySelectorAll('.cells')
gameContainer = document.querySelector('.game-container')
mainContainer = document.querySelector('.main-container')
main = document.querySelector('main')
firstCell = document.querySelector('#a1')
xPieces = document.querySelectorAll('.pieces.x > span')
oPieces = document.querySelectorAll('.pieces.o > span')
wins = document.querySelectorAll('.wins')
players = document.querySelectorAll('.players')

//*----- event listeners -----*//

// loop all cells and add listener
function addCellListeners() {
  cells.forEach((cell) => {
    cell.addEventListener('click', function(event) {
      handleTurn(cell, event)
    })
  })
}

//*----- initializations -----*//

init();

// set initial starting positions
function init() {

  // loop cells
  // add starting properties
  cells.forEach((cell) => {
    cell.classList.add('initial')
    cell.classList.add('selected')
    gameContainer.classList.add('initial')  
  })

  // loop x's, o's, scoreboard, and player board
  // apply initial properties
  xPieces.forEach((piece) => {
    piece.classList.add('initial')
  })
  oPieces.forEach((piece) => {
    piece.classList.add('initial')
  })
  wins.forEach((score) => {
    score.classList.add('initial')
  })
  players.forEach((player) => {
    player.classList.add('initial')
  })

  mainContainer.classList.add('initial')

  // move/grow cell a1 into start button position
  firstCell.classList.remove('initial')
  firstCell.classList.add('start')
  firstCell.innerText = 'Start Game'
  firstCell.addEventListener('click', initGame)
}

// initialize start of game
function initGame() {
  cells.forEach((cell) => {
    cell.classList.remove('initial')
    cell.classList.remove('selected')
    gameContainer.classList.remove('initial')  
  })

  firstCell.classList.remove('start')
  mainContainer.classList.remove('initial')
  firstCell.innerText = ''
  firstCell.removeEventListener('click', initGame)
  
  main.classList.add('flicker')
  setTimeout(() => {
    main.style.backgroundColor = '#888'
  }, 1100)

  setTurn()
  addCellListeners()
  renderPlayers()
}

//*----- renderers -----*//

// initial set up of player boards
function renderPlayers() {
  xBaseTime = 0
  oBaseTime = 0
  setTimeout(() => {
    
    // loop x's and o's in player board
    // move into place sequentially
    xPieces.forEach((piece) => {
      setTimeout(() => {
        piece.classList.remove('initial')
      }, 200 + xBaseTime)
      xBaseTime += 200
    })
    oPieces.forEach((piece) => {
      setTimeout(() => {
        piece.classList.remove('initial')
      }, 200 + oBaseTime)
      oBaseTime += 200
    })

    // set up scoreboard
    wins.forEach((score) => {
      score.classList.remove('initial')
    })

    // slide player board into place
    players.forEach((player) => {
      player.classList.remove('initial')
    })

  }, 500)
}

// set up player boards
function renderCurrentPlayer(turn) {
  const playerx = document.querySelector('.players:first-child')
  const playero = document.querySelector('.players:last-child')
  
  // determine and set border colors
  if (turn > 0) {
    playero.classList.remove('turn')
    playerx.classList.add('turn')
  } else {
    playerx.classList.remove('turn')
    playero.classList.add('turn')
  }
}

// update selected cell
function renderSelectedCell(cell) {
  const currentColor = (Math.floor(turn)) ? "red" : "blue"
  
  // determine color by turn
  // timing for animations
  setTimeout(function() {
    cell.classList.add('selected')
  }, 10)
  
  setTimeout(function() {
    cell.style.borderColor = currentColor
  }, 500)
}


//*----- handlers -----*//

function handleTurn(cell, event) {
  setTurn()

  // add x or o to selected cell
  if (cell.querySelector('div') === null) {
    const newEl = document.createElement('div')
    newEl.classList.add('x')
    newEl.innerText = 'X'
    cell.appendChild(newEl)
  }
  
  renderSelectedCell(cell)
}

// set up next turn
function setTurn() {
  // if first round, select random player
  if (!turn) turn = Math.random()

  // else select opposite player
  if (!(Math.floor(turn))) {
    turn = (turn <.5) ? -1 : 1
  } else {
    turn = (turn > 0) ? -1 : 1
  }
  renderCurrentPlayer(turn)
}
