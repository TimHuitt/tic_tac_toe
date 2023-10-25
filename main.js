// todo: track score
// todo: remove pieces on cell selection
// todo: finish updateGameState
// todo: finish win logic
// todo: handle clicks on occupied cells
// todo: game ending/restarting
// todo: add reset options

//*----- constants -----*//

const gameState = {
  a1: 0,
  a2: 0,
  a3: 0,
  b1: 0,
  b2: 0,
  b3: 0,
  c1: 0,
  c2: 0,
  c3: 0
}

//*----- state variables -----*//

let turn; // -1 / 0 / 1 (= X / empty / O = red / empty / blue)
let xScore;
let oScore;
let xLeft;
let oLeft;

//*----- cached elements  -----*//

body = document.querySelector('body')
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

// set initial onload positions
function init() {

  // loop cells
  // add starting properties to each cell and container
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

  // remove starting properties
  cells.forEach((cell) => {
    cell.classList.remove('initial')
    cell.classList.remove('selected')
    gameContainer.classList.remove('initial')  
  })

  firstCell.classList.remove('start')
  mainContainer.classList.remove('initial')
  firstCell.innerText = ''
  firstCell.removeEventListener('click', initGame)
  
  // add opening flicker to main
  main.classList.add('flicker')

  setTimeout(() => {
    main.style.backgroundColor = '#555'
  }, 1100)

  // disable interaction during animations
  setTimeout(() => {
    body.classList.remove('disable')
  }, 2500)

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
  
  // determine and set border colors based on turn
  setTimeout(() => {
    if (turn > 0) {
      playerx.classList.add('turn')
      playerx.classList.add('flicker')
      playero.classList.remove('turn')
      playero.classList.remove('flicker')
    } else {
      playero.classList.add('turn')
      playero.classList.add('flicker')
      playerx.classList.remove('turn')
      playerx.classList.remove('flicker')
    }
  }, 1000)

  // re-enable user interaction
  setTimeout(() => {
    body.classList.remove('disable')
  }, 1500)
}

// update selected cell
function renderSelectedCell(cell) {
  // set current color based on turn
  const currentColor = (turn < 0) ? "red" : "blue"
  
  // timing for selection animations
  setTimeout(function() {
    cell.classList.add('selected')
  }, 10)
  setTimeout(function() {
    cell.style.borderColor = currentColor
  }, 500)
}


//*----- handlers -----*//

// todo: implement updates
function updateGameState(cell) {
  console.log(cell.id)
}

// handle each turn based on clicked cell
function handleTurn(cell) {
  const currentPiece = (turn > 0) ? 'X' : 'O'
  const currentClass = (turn > 0) ? 'x' : 'o'
  setTurn()

  // add x or o to selected cell
  if (cell.querySelector('div') === null) {
    const newEl = document.createElement('div')
    newEl.classList.add(currentClass)
    newEl.innerText = currentPiece
    cell.appendChild(newEl)
  }

  renderSelectedCell(cell)
  updateGameState(cell)
  isWin()
}

// set up next turn
function setTurn() {
  // disable interaction
  body.classList.add('disable')

  // if new game, select random start player
  if (!turn) turn = Math.random()

  // determine next turn to set up
  // if turn is -1 (x), 1 (o)
  // if turn is 1 (o), -1 (x)
  // if turn is 0-.49 (rng), -1 (x)
  // if turn is .5-.99 (rng), 1 (o)
  turn = (turn > .5) ? -1 : 1
  
  renderCurrentPlayer(turn)
}


// check for winning conditions
function isWin() {

  // build array of possible winning states 
  const winStateInit = [
    ['a1', 'a2', 'a3'],
    ['b1', 'b2', 'b3'],
    ['c1', 'c2', 'c3'],
    ['a1', 'b1', 'c1'],
    ['a2', 'b2', 'c2'],
    ['a3', 'b3', 'c3'],
    ['a1', 'b2', 'c3'],
    ['a3', 'b2', 'c1']
  ]

  // create a copy of winning states for alteration
  let winState = [...winStateInit]

  // loop each winning state block
  for (const block of winState) {
    // loop each cell within the block
    for (const cell of block) {
      // loop each cell state in gameState
      for (const state in gameState) {
        // if cell and state match, replace winState cell with current value
        if (cell === state) {
          const stateBlock = winState[winState.indexOf(block)]
          const cellPos = stateBlock.indexOf(cell)
          stateBlock[cellPos] = gameState[cell]
        }
      }
    }
  }
  // todo: determine if any blocks equal 3 or -3 for win
  // todo: determine if no turns left for draw
  console.log(winState)
}