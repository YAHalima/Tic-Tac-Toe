const cellElement= document.querySelectorAll('.player-card');
const messageWon = document.querySelector('.won');
const messageTie = document.querySelector('.tie');
const messageLost = document.querySelector('.lost');
const messageRestart = document.querySelector('.restart');
const messageMulti = document.querySelector('#multi-player');
const cpu_Btn = document.querySelector('.cpu');
const human_Btn = document.querySelector('.player');
const gameBoard = document.querySelector('.active');
const board = document.querySelector('.board');
const phase1 = document.querySelector('.phase-1');
const selectX = document.getElementById('select-x');
const selectO = document.getElementById('select-o');
const resetBtn = document.querySelector('#reset');
const quitBtn = document.querySelectorAll('.quit');
const cancelBtn = document.getElementById('cancel');
const refreshBtn = document.getElementById('refresh');
const nextBtn = document.querySelectorAll('.next');
const msgWrapper = document.querySelectorAll('.wrapper');
const turnBtn = document.querySelector('.turn');
let tieScores = document.querySelector('.ties')
let playerScores = document.querySelector('.player-scores');
let compScores = document.querySelector('.cpu-scores')
let xClass = 'xClass';
let circleClass = 'oClass';
let circleTurn;
let gameOver;
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],

];

const newPlayer = new Object;
let opponent;

function switchactive(off, on) {
    off.classList.remove('selected');
    on.classList.add('selected')
}

//SELECTING X AS YOUR MARK
selectX.addEventListener('click', function(){
    newPlayer.man = 'select-x';
    newPlayer.computer = 'select-o';
    newPlayer.friend = 'select-o';
    switchactive(selectO, selectX);
});

//SELECTING O AS YOUR MARK
selectO.addEventListener('click', function(){
    newPlayer.man = 'select-o';
    newPlayer.computer = 'select-x';
    newPlayer.friend = 'select-x';
    switchactive(selectX, selectO);
    circleTurn = true;
    
});

function changeTurns() {
    circleTurn = !circleTurn;
}


// RESET BUTTON REMOVES ALL MARKS FROM THE CELL
function resetGame() {
    messageRestart.style.display = 'block';
}
resetBtn.addEventListener('click', resetGame);

// ACTIVATING THE CANCEL BUTTTON
cancelBtn.addEventListener('click', () => {
    messageRestart.style.display = 'none';  
})

// ACTIVATING THE QUIT BUTTTONS
function back() {
   window.location.reload();
}
quitBtn.forEach((btn) =>{
    btn.addEventListener('click', back);
})


//PLAYING WITH HUMAN AS OPPONENT
human_Btn.addEventListener('click', playGameWithHuman)
function playGameWithHuman(){
    opponent = 'player';
    gameBoard.style.display = 'block';
    phase1.style.display = 'none';
    playerScores.innerHTML = 'player 1 <br> <span>0</span>';
    compScores.innerHTML = 'player 2 <br> <span>0</span>';



//GAMEBOARD
// GAME STARTS
startGame()
function startGame() {
    circleTurn = false;
    cellElement.forEach(cell => {
    cell.addEventListener('click', handleClick, {once: true});
    cell.classList.remove(xClass);
    cell.classList.remove(circleClass); 
})
    boardHoverClass();
}
let gameOver = false;

// RESTART BUTTON SETS THE GAMEBOARD TO ITS INITIAL STATE
refreshBtn.addEventListener('click', ()=> {
    messageRestart.style.display = 'none';
    window.location.reload();
})

// ACTIVATING THE NEXT ROUND BUTTTONS
function Wrapper() {
    msgWrapper.forEach((msg) => {
        msg.style.display = 'none';
    })
}
nextBtn.forEach((btn) => {
    btn.addEventListener('click', ()=> {
        Wrapper();
        startGame();
    })
})

// FOR EACH CELL CLICKED
function handleClick(e) {
   const cell = e.target; 
   let currentMark = circleTurn? circleClass : xClass;
 
   placeMark(cell, currentMark);
   
   if (checkWin(currentMark, scores)) {
    endGame(false);
    earnPoints();
   }else if (isDraw(currentMark, scores)) {
    endGame(true);
    earnPoints();
   }

   changeTurns();
   boardHoverClass();
}
// DISPLAY WHETHER THE GAME IS TIE OR WON 
function endGame(draw) {
    if (draw) {
       messageTie.style.display = 'block';
    } else {
        messageWon.style.display = 'block';
    }
}

function isDraw() {
    return [...cellElement].every(cell => {
        return cell.classList.contains(xClass) || cell.classList.contains(circleClass)
    });       
}


function placeMark(cell, currentMark) {  
    cell.classList.add(currentMark);   
}

function checkWin(currentMark, scores) {
    let hasWon = winningCombos.some(combination => {
        return combination.every(index => {
            return cellElement[index].classList.contains(currentMark);
        });
    });

    if (hasWon) {
        if (gameOver) { // Check if the game is still ongoing
            updateScore(currentMark, scores); // Call updateScore with the currentMark and scores
            gameOver = true; // Set gameOver to true to indicate that the game has ended
        }
        return true;
    } else {
        return false;
    }
}
function boardHoverClass() {
    board.classList.remove(xClass);
    board.classList.remove(circleClass);
    if (circleTurn) {
        board.classList.add(circleClass);
    } else {
        board.classList.add(xClass);
    }
}

// UPDATING SCORES
let scores = 0;
let currentMark = circleTurn ? circleClass : xClass;

function earnPoints() {
    scores++;
    updateScore(currentMark, scores);
    scores++;

}

let player1Score = 0;
let player2Score = 0;
let drawScore = 0;

function updateScore(currentMark, scores) {
    if (checkWin(currentMark, scores)) {
        if (currentMark === xClass) {
            player1Score++;
            playerScores.innerHTML = 'Player 1 <br>' + player1Score;
        } else if (currentMark === circleClass) {
            player2Score++;
            compScores.innerHTML = 'Player 2 <br>' + player2Score;
        }
    } else if (isDraw(currentMark, scores)) {
        drawScore++;
        tieScores.innerHTML = 'Ties <br>' + scores;
    }
}

 };


//PLAYING WITH COMPUTER AS OPPONENT
cpu_Btn.addEventListener('click', playGameWithComputer)
function playGameWithComputer() {
    opponent = 'cpu';
    gameBoard.style.display = 'block';
    phase1.style.display = 'none';

  startGame()
   var currentMark = circleTurn ? circleClass : xClass;

  function startGame() {
    let ai = newPlayer.computer;
    if (ai === 'select-x') {  
        circleTurn = false;
        swapTurnsToComputer();
    }
    cellElement.forEach(cell => {
    cell.addEventListener('click', handleClick, {once: true});
    cell.classList.remove(xClass);
    cell.classList.remove(circleClass); 
})
   boardHoverClass(); 
}

// RESTART BUTTON SETS THE GAMEBOARD TO ITS INITIAL STATE
refreshBtn.addEventListener('click', ()=> {
    messageRestart.style.display = 'none';
    window.location.reload();
})

//ACTIVATING THE NEXTROUND BUTTONS
function Wrapper() {
    msgWrapper.forEach((msg) => {
        msg.style.display = 'none';

    })
}
nextBtn.forEach((btn) => {
    btn.addEventListener('click', ()=> {
        Wrapper();
        startGame();
    });
})

//FOR EACH CELL CLICKED
function handleClick(e) {
   const cell = e.target;
// HUMAN'S TURN 
   let currentMark = circleTurn ? circleClass : xClass;
   placeMark(cell, currentMark);

    if (checkWin(currentMark)) {
       endGame('won');
       cellElement.forEach(cell =>cell.removeEventListener('click', handleClick, {once: true}));
       earnPoints();

   } else if (isDraw()) {
      endGame('draw');
      cellElement.forEach(cell =>cell.removeEventListener('click', handleClick, {once: true}));
       earnPoints();

   } else if (checkLost(currentMark)) {
       endGame('lost');
       cellElement.forEach(cell =>cell.removeEventListener('click', handleClick, {once: true}));
       earnPoints();
   }
    
//COMPUTER'S TURN 
    setTimeout(()=> {
        swapTurnsToComputer()
        //boardHoverClass();
     }, 1000);

    boardHoverClass();

}

function placeMark(cell, currentMark) {
    cell.classList.add(currentMark); 
    cell.classList.add('activeCell');
    changeTurns();
}

function swapTurnsToComputer() {
  if (!isDraw() || !checkWin(currentMark) || !checkLost(currentMark)) placeMark(bestSpot(), currentMark);
}  

function emptyCell() {
   const emptyCells = [...cellElement].filter(element => !element.classList.contains("activeCell"));
    return emptyCells[Math.ceil(Math.random()*emptyCells.length-1)]
}

function bestSpot() {
    return emptyCell();
}


function boardHoverClass() {
    board.classList.remove(xClass);
    board.classList.remove(circleClass);
    if (circleTurn) {
        board.classList.add(circleClass);
    } else {
        board.classList.add(xClass);
    }
}

function endGame(status) {     
    if (status === 'won') {
        setTimeout(() => {
            messageWon.style.display = 'block';   
        }, 1500);
        cellElement.forEach(cell => {
    cell.removeEventListener('click', handleClick, { once: true });
  }); 
    }
      else if (status === 'draw') {
        setTimeout(() => {
            messageTie.style.display = 'block';
        }, 1500);
        cellElement.forEach(cell => {
    cell.removeEventListener('click', handleClick, {once: true});
    });
    } 
    else if (status === 'lost') {
         setTimeout(() => {
            messageLost.style.display = 'block';
        }, 1500)
        cellElement.forEach(cell => {
    cell.removeEventListener('click', handleClick, {once: true});
    });
}
}

function checkWin(currentMark) {
    return winningCombos.some(combination => {
        return combination.every(index => {
            return cellElement[index].classList.contains(currentMark)
        })
    });
}

function isDraw() {
    return [...cellElement].every(cell => {
        return cell.classList.contains(xClass) || cell.classList.contains(circleClass)
    });
}

function checkLost(currentMark) {
    return !(winningCombos.some(combination => {
        return combination.every(index => {
            return !(cellElement[index].classList.contains(currentMark))
        })
    }))
}


// UPDATING SCORES
let scores = 0;
function earnPoints() {
    scores++;
    updateScore(currentMark)
}

function updateScore(currentMark) {
    if (checkWin(currentMark)) {
        scores++;
       playerScores.innerHTML = 'X(YOU) <br>' + scores; 
    } else if (isDraw()) {
        scores++;
       tieScores.innerHTML = 'Ties <br>' + scores;
    }else if (checkLost(currentMark)) {
        scores++;
        compScores.innerHTML = 'O(CPU) <br>' + scores;
    }
    
}


}
