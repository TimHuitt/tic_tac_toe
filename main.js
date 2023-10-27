//testing
//*----- constants -----*//
// state of game board cells 
// -1 = x / 0 = empty / 1 = o
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
// track player wins
const gameWins = {
  x: 0,
  o: 0
}

//*----- state variables -----*//

let turn;
let xPiece; 
let oPiece;
let winner;
let resetting;
let disableTime;

//*----- cached elements  -----*//

const body = document.querySelector('body')
const cells = document.querySelectorAll('.cells')
const reset = document.querySelector('.reset-button')
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
  main.addEventListener('click', handleTurn)
}

reset.addEventListener('click', resetGame)

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

  // hide player boards
  players.forEach((player) => {
    player.classList.add('initial')
  })

  winsx.innerText = 0
  winso.innerText = 0
  xPiece = 0
  oPiece = 0
  winner = ''
  disableTime = 2000
  main.classList.remove('flicker')
  mainContainer.classList.add('initial')
  reset.classList.add('initial')

  // remove styles and reset
  main.classList.remove('draw')
  main.classList.remove('winner')
  main.classList.remove('x')
  main.classList.remove('o')
  main.classList.remove('bg')
  turn = undefined
  
  // clear cell styles and elements
  for (cell of cells) {
    cell.classList.remove('selectedx')
    cell.classList.remove('selectedo')

    const children = cell.querySelectorAll('.x, .o')
    children.forEach((child) => {
      cell.removeChild(child)
    })
  }

  // move/grow cell a1 into start button position
  firstCell.classList.remove('initial')
  firstCell.classList.add('start')
  firstCell.innerText = 'Start Game'
  main.addEventListener('click', initGame)

  setGameState()
}

// initialize start of game
function initGame() {
  // remove starting properties
  cells.forEach((cell) => {
    cell.classList.remove('initial')
    cell.classList.remove('selected')
    gameContainer.classList.remove('initial')  
  })

  // show gameboard elements
  mainContainer.classList.remove('initial')
  firstCell.innerText = ''
  firstCell.classList.remove('start')
  main.removeEventListener('click', initGame)
  
  // set scoreboard
  winsx.innerText = gameWins['x']
  winso.innerText = gameWins['o']

  // add opening flicker to main
  main.classList.add('flicker')

  setTimeout(() => {
    main.classList.add('bg')
  }, 1500)

  // enable interaction during animations
  setTimeout(() => {
    resetting = false
    main.classList.remove('disable')
  }, disableTime)

  addCellListeners()
  
  // show other elements
  setTimeout(() => {
    renderPlayers()
    reset.classList.remove('initial')
  }, 500)

  setTimeout(() => {
    reset.classList.remove('initial')
    disableTime = 750
  }, 2000)

  setTurn()
}

//*----- renderers -----*//

// initial set up of player boards
function renderPlayers() {
  let xBaseTime = 0
  let oBaseTime = 0
  let pieces;

  // loop x's and o's pieces in player board
  // move into view sequentially
  // display 1 less if other players turn
  xPieces.forEach((piece, idx) => {
    if (turn === -1 && idx === xPieces.length - 1) {
      xPiece++
     return
    }
    setTimeout(() => {
      piece.classList.remove('initial')
    }, 200 + xBaseTime)
    xBaseTime += 200
  })

  oPieces.forEach((piece, idx) => {
    if (turn === 1 && idx === oPieces.length - 1) {
       oPiece++
      return
    }
      setTimeout(() => {
        piece.classList.remove('initial')
      }, 200 + oBaseTime)
      oBaseTime += 200
  })

  // slide player boards into place
  players.forEach((player) => {
    player.classList.remove('initial')
  })

}

// set up player boards
function renderCurrentPlayer(turn) {
  const playerx = document.querySelector('.players:first-child')
  const playero = document.querySelector('.players:last-child')
  
  // determine and set cell styles
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
    main.classList.remove('disable')
  }, disableTime)
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

// make win state changes
function renderWinner(winner) {
  let delay = 2000
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
    if (!resetting) {
      if (winner) setGameState(undefined, winner)
      init()
      initGame()
    }
  }, delay)
}

// remove a piece from the players 'bank'
function removePiece(init) {
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
function handleTurn(event) {
  let cell = event.target

  // determine cell style
  if (turn > 0) cell.classList.add('selectedx')
  if (turn < 0) cell.classList.add('selectedo')

  if (event.target.id) {
    const currentPiece = (turn > 0) ? 'X' : 'O'
    const currentClass = (turn > 0) ? 'x' : 'o'

    // add x or o to selected cell
    if (cell.querySelector('div') === null) {
      const newEl = document.createElement('div')
      newEl.classList.add(currentClass)
      newEl.innerText = currentPiece
      cell.appendChild(newEl)
    }

    setTurn()
    removePiece()
    renderSelectedCell(cell)
    setGameState(cell)
    handleBoard()
  }
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
  main.classList.add('disable')

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

function resetGame() {
  resetting = true
  gameWins.x = 0
  gameWins.o = 0
  main.removeEventListener('click', handleTurn)
  init()
}
