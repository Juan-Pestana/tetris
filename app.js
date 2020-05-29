document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  

  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    'blue',
    'red',
    'green',
    'orange',
    'yellow',
    'purple',
    'cian'
  ]

  // arrays with the picture of the different Tetrominoes and the different rotations

  const lTetromino = [
    [1, width+1, width*2+1,2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]
  const lRTetromino = [
    [0, 1, width+1, width*2+1],
    [2, width+2, width+1, width],
    [width*2+1, width*2, width, 0],
    [width*2, width, width+1, width+2]
  ]
  const zTetromino = [
    [1, 2, width, width+1],
    [0, width, width+1, width*2+1],
    [1, 2, width, width+1],
    [0, width, width+1, width*2+1]
  ]
  const zRTetromino = [
    [1, width, width+1, width*2],
    [0, 1, width+1, width+2],
    [1, width, width+1, width*2],
    [0, 1, width+1, width+2],
  ]
  const tTetromino = [
    [width, 1, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1],
  ]
  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
  ]
  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
]
//array with the different tipes of tetrominos
  const theTetrominoes = [lTetromino, lRTetromino, zTetromino, zRTetromino, tTetromino, oTetromino, iTetromino]
  console.log(theTetrominoes)

  let currentPosition = 4
  let currentRotation = 0

  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  // draw the first rotation of the random Tetromino
  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  function undraw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  // auto move the tetromino down in 1seg interval

  // timerId = setInterval(moveDown, 1000) //un-invoqued because we set this functionality on the Start/Stop Button

  // assign function to KeyCodes
  function control (e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    } else if (e.keyCode === 38) {
      rotate()
    }
  }
  document.addEventListener('keyup', control)

  function moveDown () {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }
// freeze  function to stop the tetromino when it reaches the bottom

  function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //draw a new tetrominos falling
      random = nextRandom
      nextRandom = Math.floor(Math.random()* theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

// move the tetromino left, unless it is at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftEdge) currentPosition -=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }

//move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    

    if(!isAtRightEdge) currentPosition +=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }

    draw()
  }

// rotate tetrominos
  function rotate() {
    undraw()
    currentRotation ++
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(isAtRightEdge || isAtLeftEdge) currentRotation -=1
    if(currentRotation === current.length){
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]

    draw()
  }

  // show next tetromino in mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 1

//The tetrominos first rotations

const upNextTetrominoes = [
  [1, displayWidth+1, displayWidth*2+1, 2], //l tetromino
  [0, 1, displayWidth+1, displayWidth*2+1], //l reverse tetronimo
  [0, displayWidth, displayWidth+1, displayWidth*2+1], // z tetromino
  [1, displayWidth, displayWidth+1, displayWidth*2], // z reverse tetronimo
  [1, displayWidth, displayWidth+1, displayWidth+2], // t tetromino
  [0, 1, displayWidth, displayWidth+1], // O tetromino
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // I Tetromino
]

// function to show in the grid
function displayShape() {
  //remove tetromino class from the entire grid
  displaySquares.forEach(square => {
    square.classList.remove('tetromino')
    square.style.backgroundColor = ""
  })
  upNextTetrominoes[nextRandom].forEach( index => {
    displaySquares[displayIndex + index].classList.add('tetromino')
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
  })
}



// make the start/stop button work
  startBtn.addEventListener('click', () => {
    let level = document.getElementById('nivel').value
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw ()
      timerId = setInterval(moveDown, level)
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      displayShape()
      
    }
  })

  function addScore () {
    for (let i = 0; i < 199; i+=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ""
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }
function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      alert('Eres un Paquete')
      clearInterval(timerId)
  }
}


})
