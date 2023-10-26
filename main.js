
// todo: fix o border color
// todo: remove turn change after win/draw

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

const gameWins = {
  x: 0,
  o: 0
}

//*----- state variables -----*//

let turn; // -1 / 0 / 1 (= X / empty / O = red / empty / blue)
let xPiece;
let oPiece;
let winner;

//*----- cached elements  -----*//

const body = document.querySelector('body')
const cells = document.querySelectorAll('.cells')
const gameContainer = document.querySelector('.game-container')
const mainContainer = document.querySelector('.main-container')
const main = document.querySelector('main')
const firstCell = document.querySelector('#a1')
const winsx = document.querySelector('.wins.x')
const winso = document.querySelector('.wins.o')
const players = document.querySelectorAll('.players')
let xPieces = document.querySelectorAll('.pieces.x > span')
let oPieces = document.querySelectorAll('.pieces.o > span')

//*----- event listeners -----*//

// add listener to main container
function addCellListeners() {
  main.addEventListener('click', function(event) {
    if (event.target.id) handleTurn(event.target, event)
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

  players.forEach((player) => {
    player.classList.add('initial')
  })

  winsx.innerText = 0
  winso.innerText = 0
  xPiece = 0
  oPiece = 0
  winner = ''
  mainContainer.classList.add('initial')

  // move/grow cell a1 into start button position
  firstCell.classList.remove('initial')
  firstCell.classList.add('start')
  firstCell.innerText = 'Start Game'
  main.addEventListener('click', initGame)
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
  main.removeEventListener('click', initGame)
  
  winsx.innerText = gameWins['x']
  winso.innerText = gameWins['o']

  // add opening flicker to main
  main.classList.add('flicker')

  setTimeout(() => {
    main.classList.add('bg')
  }, 1500)

  // enable interaction during animations
  setTimeout(() => {
    body.classList.remove('disable')
  }, 2500)

  setTurn()
  if (!(gameWins.x + gameWins.o)) addCellListeners()
  renderPlayers()

  setTimeout(() => {
    unrenderPiece('initial')
  }, 2000)
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
  
  if (winner !== 1 && winner != -1 && getBoardSum !== 9) {
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
  }

  // re-enable user interaction
  setTimeout(() => {
    body.classList.remove('disable')
  }, 1500)
}

// update selected cell
function renderSelectedCell(cell) {
  // set current color based on turn
  const currentColor = (turn > 0) ?  "o" : "x"
  
  // timing for selection animations
  setTimeout(function() {
    cell.classList.add('selected')
  }, 10)
  setTimeout(function() {
    cell.classList.add(`selected${currentColor}`)
  }, 500)
}

function renderWinner(winner) {
  let delay = 4000
  switch (winner) {
    case 'x':
      main.classList.add('winner')
      main.classList.add('x')
      break
    case 'o':
      main.classList.add('winner')
      main.classList.add('o')
      break
    default:
      main.classList.add('draw')
      delay = 2000
      break
  }
  setTimeout(() => {
    setGameEnd(winner)
    init()
    initGame()
  }, delay)
}

function unrenderPiece(init) {
  
  if (turn > 0) {
    oPieces.forEach((piece, idx) => {
      const pos = oPieces.length - idx - 1
      if (oPiece === pos) {
        piece.classList.add('initial')
      }
    })
    oPiece++
  } else {
    xPieces.forEach((piece, idx) => {
      const pos = xPieces.length - idx - 1
      if (xPiece === pos) {
        piece.classList.add('initial')
      }
    })
    xPiece++
  }
}

//*----- handlers -----*//

// check for winning conditions
function handleBoard() {
  // build array of possible winning states 
  const winPos = [
    ['a1', 'a2', 'a3'],
    ['b1', 'b2', 'b3'],
    ['c1', 'c2', 'c3'],
    ['a1', 'b1', 'c1'],
    ['a2', 'b2', 'c2'],
    ['a3', 'b3', 'c3'],
    ['a1', 'b2', 'c3'],
    ['a3', 'b2', 'c1']
  ]
  
  //check for winning condition
  winPos.forEach((winConditions) => {
    let winSum = 0 // and loseSum
    winConditions.forEach((cell) => {
      // sum winning combinations
      winSum += gameState[cell]
    })

    // if winning condition matched
    // 3 = o, -3 = x
    if (winSum === 3 || winSum === -3) {
      winner = (turn > 0) ? 'o' : 'x'
      renderWinner(winner)
      return
    }
  })

  // check for draw
  if (getBoardSum() === 9 && !winner) {
    renderWinner('draw')
    return
  }
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

  
  

  unrenderPiece()
  renderSelectedCell(cell)
  setGameState(cell)
  handleBoard()
}

//*----- getters -----*//

// calculate occupied cells
function getBoardSum() {
  let boardSum = 0
  for (const val in gameState) {
    if (gameState[val] !== 0) {
      boardSum += 1
    }
  }
  return(boardSum)
}

//*----- setters -----*//

// update gameState with cell and winner
// reset by passing no arguments
function setGameState(cell, winner) {
  if (cell) {
    gameState[cell.id] = turn
  } else {
    for (state in gameState) {
      gameState[state] = 0
    }
  }
  gameWins[winner] += 1
}

// set up next turn
function setTurn() {
  // disable interaction
  body.classList.add('disable')

  // if new game, select random start player
  if (!turn) {
    turn = Math.random()
  }

  // determine next turn to set up
  // if turn is -1 (x),return 1 (o)
  // if turn is 1 (o),return -1 (x)
  // if turn is .5-.99 (rng),return 1 (o)
  // if turn is 0-.49 (rng),return -1 (x)
  turn = (turn > .5) ? -1 : 1

  renderCurrentPlayer(turn)
  
}


function setGameEnd(winner) {
  main.classList.remove('draw')
  main.classList.remove('winner')
  main.classList.remove('x')
  main.classList.remove('o')
  main.classList.remove('bg')
  turn = undefined
  for (cell of cells) {
    cell.classList.remove('selectedx')
    cell.classList.remove('selectedo')

    const children = cell.querySelectorAll('.x, .o')
    children.forEach((child) => {
      cell.removeChild(child)
    })
  }
  
  setGameState(undefined, winner)
}

