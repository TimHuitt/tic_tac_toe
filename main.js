/*----- constants -----*/


/*----- state variables -----*/


/*----- cached elements  -----*/


/*----- event listeners -----*/
cells = document.querySelectorAll('.cell')
gameContainer = document.querySelector('.game-container')
firstCell = document.querySelector('#a1')

function renderBoard() {
  cells.forEach((cell) => {
    cell.addEventListener('click', function(event) {
      if (cell.querySelector('div') === null) {
        const newEl = document.createElement('div')
        newEl.classList.add('x')
        newEl.innerText = 'X'
        cell.appendChild(newEl)
        setTimeout(function() {
          cell.classList.add('selected')
        }, 10)
        setTimeout(function() {
          cell.style.borderColor = "red"
        }, 500)
      }
    })
  })
}

function initGame() {
  cells.forEach((cell) => {
    cell.classList.remove('initial')
    cell.classList.remove('selected')
    gameContainer.classList.remove('initial')  
  })
  
  firstCell.innerText = ''
  firstCell.removeEventListener('click', initGame)
  
  renderBoard()
}

function init() {
  cells.forEach((cell) => {
    cell.classList.add('initial')
    cell.classList.add('selected')
    gameContainer.classList.add('initial')  
  })

  firstCell.classList.remove('initial')
  firstCell.innerText = 'Start Game'
  firstCell.addEventListener('click', initGame)
}

init();

/*----- functions -----*/