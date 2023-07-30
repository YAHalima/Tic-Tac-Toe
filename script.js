const cellElement= document.querySelectorAll('.player-card');
const messageWon = document.querySelector('.won');
const messageTie = document.querySelector('.tie');
const messageLost = document.getElementById('solo');
const messageRestart = document.querySelector('.restart');
const messageMulti = document.querySelector('#multi-player');
const cpu_Btn = document.querySelector('.cpu');
const playerBtn = document.querySelector('.player');
const gameBoard = document.querySelector('.active');
const board = document.querySelector('.board');
const phase1 = document.querySelector('.phase-1');
const selectX = document.getElementById('x-mark-style');
const selectO = document.getElementById('o-mark-style');
const resetBtn = document.querySelector('#reset');
const quitBtn = document.querySelectorAll('.quit');
const cancelBtn = document.getElementById('cancel');
const refreshBtn = document.getElementById('refresh');
const nextBtn = document.querySelectorAll('.next');
const msgWrapper = document.querySelectorAll('.wrapper');
const xmark = document.querySelector('.xmark');
const circlemark = document.querySelector('.circlemark')
const takeRoundText = document.getElementById('takes-round');
let tieScores = document.querySelector('.ties')
let playerScores = document.querySelector('.player-scores');
let compScores = document.querySelector('.cpu-scores')
let xClass = 'xClass';
let circleClass = 'oClass';
let circleTurn;
let p1 = 'x';
let p2 =  'o';
let newBoard = new Array(9);
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

window.addEventListener('load', toggleO);

const newPlayer = new Object;
let opponent;

function switchactive(off, on) {
    off.classList.remove('selected');
    on.classList.add('selected')
}

//SELECTING X AS YOUR MARK
selectX.addEventListener('click', toggleX)
function toggleX(){
    newPlayer.playerOne = 'xClass';
    newPlayer.computer = 'oClass';
    newPlayer.playerTwo = 'oClass';
    switchactive(selectO, selectX);
    document.querySelector('svg').style.fill = '#1a2a33';
    document.querySelector('#o').style.fill = '#abbfc9';
    p1 = 'x';
    p2 = 'o';
};

//SELECTING O AS YOUR MARK
selectO.addEventListener('click', toggleO)
function toggleO(){
    newPlayer.playerOne = 'oClass';
    newPlayer.computer = 'xClass';
    newPlayer.playerTwo = 'xClass';
    switchactive(selectX, selectO);
    document.querySelector('#o').style.fill = '#1a2a33';
    document.querySelector('#x').style.fill = '#abbfc9';
    p1 = 'o';
    p2 = 'x';
    
};

function changeTurns() {
    circleTurn = !circleTurn;
}


// RESET BUTTON REMOVES ALL MARKS FROM THE CELL
function resetGame() {
    messageRestart.style.display = 'block';
}
resetBtn.addEventListener('click', resetGame);

// ACTIVATING THE QUIT BUTTTONS
function back() {
   window.location.reload();
}
quitBtn.forEach((btn) =>{
    btn.addEventListener('click', back);
})


//PLAYING WITH HUMAN AS OPPONENT
playerBtn.addEventListener('click', playGameWithHuman)
function playGameWithHuman() {
    opponent = 'player';
    gameBoard.style.display = 'block';
    phase1.style.display = 'none';
   compScores.innerHTML = 'O (P1)  <br> <span>0</span>';
    if (newPlayer.playerOne === xClass) {
        playerScores.innerHTML = 'X (P1) <br> <span>0</span>';
        compScores.innerHTML = 'O (P2)  <br> <span>0</span>';
    } else {
        playerScores.innerHTML = 'X (P2) <br> <span>0</span>';
        compScores.innerHTML = 'O (P1)  <br> <span>0</span>';
    }


//GAMEBOARD
// GAME STARTS
startGame()
function startGame() {
    circleTurn = false;
    cellElement.forEach(cell => {
    cell.addEventListener('click', handleClick, {once: true});
    cell.classList.remove(xClass);
    cell.classList.remove(circleClass); 
});
    boardHoverClass();
}

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
});

// ACTIVATING THE CANCEL BUTTTONS
cancelBtn.addEventListener('click', () => {
    messageRestart.style.display = 'none';
    startGame();  
})

let currentMark = circleTurn? circleClass : xClass;

// FOR EACH CELL CLICKED
function handleClick(e) {
   const cell = e.target; 
   let currentMark = circleTurn? circleClass : xClass;
 
   placeMark(cell, currentMark);
   changeTurns();
   boardHoverClass();


   if (checkWin(currentMark)) {
    cellElement.forEach(cell => {
    cell.removeEventListener('click', handleClick, {once: true});
    });
    endGame('won');
    earnPoints(currentMark);
   }
   else if (isDraw()) {
    cellElement.forEach(cell => {
    cell.removeEventListener('click', handleClick, {once: true});
    });
    endGame('draw');
    earnPoints();
   }

   if (currentMark === circleClass) {
    circlemark.style.display = 'block';
    xmark.style.display = 'none'
   }
   if (currentMark === xClass) {
    xmark.style.display = 'block';
    circlemark.style.display = 'none';
   }

}
// DISPLAY WHETHER THE GAME IS TIE OR WON 
function endGame(status) {
    if (status === 'draw') {
       messageTie.style.display = 'block';
    } 
    else if (status === 'won') {
        const takeRoundText = document.getElementById('take-round');
        const playerWonText = document.getElementById('status')

       if (currentMark === newPlayer.playerOne) {
        setTimeout(() => {
                   messageWon.style.display = 'block';
                }, 500)

                const src = newPlayer.playerOne === circleClass? './assets/icon-o.svg' : './assets/icon-x.svg';
                takeRoundText.innerHTML = `<img src=${src} /> takes the round`;
                takeRoundText.style.color = newPlayer.playerOne === circleClass? '#F2B137' : '#A8BFC9';
                playerWonText.innerHTML = 'Player 1 wins!';
       
       }
        else {
        setTimeout(() => {
                   messageWon.style.display = 'block';
                }, 500)
                const src = newPlayer.playerTwo === circleClass? './assets/icon-o.svg' : './assets/icon-x.svg';
                takeRoundText.innerHTML = `<img src=${src} /> takes the round`;
                takeRoundText.style.color = newPlayer.playerTwo === circleClass? '#F2B137' : '#A8BFC9';
                playerWonText.innerHTML = 'Player 2 wins!';
       }
   
    }   
       
}


function placeMark(cell, currentMark) {  
    cell.classList.add(currentMark); 
}

function isDraw() {
    return [...cellElement].every(cell => {
        return cell.classList.contains(xClass) || cell.classList.contains(circleClass)
    });       
}


function checkWin(currentMark) {
    hasWon = winningCombos.some(combination => {
        return combination.every(index => {
            return cellElement[index].classList.contains(currentMark);
        });
    });

    if (hasWon) {
        let gameOver = false;
        if (gameOver) { // Check if the game is still ongoing
            updateScore(currentMark); // Call updateScore with the currentMark
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
function earnPoints(currentMark) {
    updateScore(currentMark);
}

let player1Score = 0;
let player2Score = 0;
let drawScore = 0;

function updateScore(currentMark) {
    if (checkWin(currentMark)) {
        if (currentMark === xClass) {
            player1Score++;
            newPlayer.playerOne === xClass? playerScores.innerHTML = 'X (P1) <br>' + player1Score : playerScores.innerHTML = 'X (P2) <br>' + player1Score;
        } 
        else {
            player2Score++;
            newPlayer.playerTwo === circleClass? compScores.innerHTML = 'O (P2) <br>' + player2Score : compScores.innerHTML = 'O (P2) <br>' + player2Score;
        }
    } else if (isDraw()) {
        drawScore++;
        tieScores.innerHTML = 'Ties <br>' + drawScore;
    }
}

 


}



//PLAYING WITH COMPUTER AS OPPONENT
cpu_Btn.addEventListener('click', playGameWithComputer)
function playGameWithComputer() {
    opponent = 'cpu';
    gameBoard.style.display = 'block';
    phase1.style.display = 'none';

    if (newPlayer.playerOne === xClass) {
        playerScores.innerHTML = 'X (YOU) <br> <span>0</span>';
        compScores.innerHTML = 'O (CPU)  <br> <span>0</span>';
        p1 = 'x';
        p2 = 'o';

    } else if (newPlayer.computer === xClass) {
        playerScores.innerHTML = 'X (CPU) <br> <span>0</span>';
        compScores.innerHTML = 'O (YOU)  <br> <span>0</span>';
        p1 = 'o';
        p2 = 'x';
    }
      
    function getBoard() {
    for (let i = 0; i < cellElement.length; i++) {
        let btn = cellElement[i]
        btn.id = i;
        btn.addEventListener('click', handleClick)
    }
}
let currentMark = circleTurn? circleClass : xClass; 
  startGame()
  
  function startGame() {
   //circleTurn = false;
    let ai = newPlayer.computer;
    if (ai === 'xClass') {  
        circleTurn = false;
        setTimeout(swapTurnsToComputer, 500);
    }
    
    cellElement.forEach(cell => {
    cell.addEventListener('click', handleClick, {once: true});
    cell.classList.remove(xClass);
    cell.classList.remove(circleClass); 
    cell.classList.remove('x-active');
    cell.classList.remove('o-active');
})
   boardHoverClass(currentMark); 

   if (currentMark === xClass) {
        getBoard()
    }
    else if (currentMark === circleClass) {
        boardHoverClass(currentMark);
        currentMark = xClass
        turn(currentMark)
    }


}

// RESTART BUTTON SETS THE GAMEBOARD TO ITS INITIAL STATE
refreshBtn.addEventListener('click', ()=> {
    messageRestart.style.display = 'none';
    window.location.reload();
});

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
        newBoard = new Array(9);
    });
});

// ACTIVATING THE CANCEL BUTTTONS
cancelBtn.addEventListener('click', () => {
    messageRestart.style.display = 'none';
    startGame();  
})

//FOR EACH CELL CLICKED
function handleClick(e) {
   const cell = e.target;
   newBoard[cell.id] = currentMark

   switch (currentMark) {
    case xClass:
        cell.classList.add('x-active');
        cell.classList.add(xClass);
        break;
    
    case circleClass:
        cell.classList.add('o-active');
        cell.classList.add(circleClass);
        break;    
   }
   boardHoverClass(currentMark);

   if (checkWin(newBoard, newPlayer.playerOne)) {
       endGame('won')
       earnPoints(newPlayer.playerOne)
    }
    else if (isDraw()) {
        endGame('draw')
        earnPoints()
    }
    else {
        currentMark = currentMark === newPlayer.computer ? newPlayer.playerOne : newPlayer.computer;
        turn(currentMark)
        }

    if (currentMark === circleClass) {
    circlemark.style.display = 'block';
    xmark.style.display = 'none'
   }
   if (currentMark === xClass) {
    xmark.style.display = 'block';
    circlemark.style.display = 'none';
   }
        
    cell.removeEventListener('click', handleClick)


}

function turn(currentMark) {
    if (currentMark == xClass) {
        getBoard();
        setTimeout(swapTurnsToComputer, 500)
    }
    else if (currentMark === circleClass) {
        getBoard();
        setTimeout(swapTurnsToComputer, 500)
    }
}

function bestSpot() {
    return minimax(newBoard, newPlayer.computer);
}

function swapTurnsToComputer() {
    boardHoverClass(currentMark)
    const bestMove = bestSpot()
    const cell = document.getElementById(bestMove.id)
    
    newBoard[bestMove.id] = currentMark
    switch (currentMark) {
        case xClass:
            cell.classList.add('x-active')
            cell.classList.add(xClass)    
            break;

        case circleClass:
            cell.classList.add('o-active')
            cell.classList.add(circleClass)
            break;
    }

    if (checkWin(newBoard, newPlayer.computer)) {
       endGame('won')
       earnPoints(newPlayer.computer)
    }
    else if (isDraw()) {
        endGame('draw')
        earnPoints()
    }
    else {
        currentMark = currentMark === newPlayer.computer ? newPlayer.playerOne : newPlayer.computer
    }

    if (currentMark === circleClass) {
    circlemark.style.display = 'block';
    xmark.style.display = 'none'
   }
   if (currentMark === xClass) {
    xmark.style.display = 'block';
    circlemark.style.display = 'none';
   }

    cell.removeEventListener('click', handleClick)
}


function minimax(newBoard, player) {
	var availSpots = emptySquares(newBoard);

	if (checkWin(newBoard, newPlayer.playerOne)) {
		return {score: -10};
	} else if (checkWin(newBoard, newPlayer.computer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	let moves = [];

	for (let i = 0; i < availSpots.length; i++) {
        let id = availSpots[i]
        let defaultBoard = newBoard[id]

        newBoard[id] = player

		let move = {};
		move.id = id;
		//newBoard[availSpots[i]] = player;

		if (player === newPlayer.computer) {
			var result = minimax(newBoard, newPlayer.playerOne);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, newPlayer.computer);
			move.score = result.score;
		}
		//newBoard[availSpots[i]] = move.index;
        newBoard[id] = defaultBoard
		moves.push(move);
	}

	var bestMove;
	if(player === newPlayer.computer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = moves[i];
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = moves[i];
			}
		}
	}
	return bestMove;
}

 function emptySquares(newBoard) {
    let empty = [];
    for (let id = 0; id < newBoard.length; id++) {
        if (!newBoard[id]) {
            empty.push(id)
        }
    }

    return empty
}


function boardHoverClass(currentMark) {
    board.classList.remove(xClass);
    board.classList.remove(circleClass);
    if (currentMark = circleClass) {
        board.classList.add(circleClass);
    } else {
        board.classList.add(xClass);
    }
}

function endGame(status) { 
    if (status === 'won') {
        
        if ((newPlayer.computer === circleClass && p2 === 'o') || (newPlayer.computer === xClass && p2 === 'x')) {

            if (playerScores.innerHTML.includes('CPU') ||compScores.innerHTML.includes('CPU')) {
                setTimeout(() => {
            messageLost.style.display = 'block';
        }, 800);

        const src = newPlayer.computer === circleClass? './assets/icon-o.svg'  :'./assets/icon-x.svg';
        takeRoundText.innerHTML = `<img src=${src} /> takes the round`;
        takeRoundText.style.color = newPlayer.computer === circleClass? '#F2B137' : '#A8BFC9';
            
        cellElement.forEach(cell => {
    cell.removeEventListener('click', handleClick, {once: true});
    });
            }

        } 
        else if  ((newPlayer.playerOne === circleClass && p1 === 'o') || (newPlayer.playerOne === xClass && p1 === 'x')) {
            if (playerScores.innerHTML.includes('YOU') ||compScores.innerHTML.includes('YOU')) {
            setTimeout(() => {
            messageWon.style.display = 'block';   
        }, 800);

            const src = newPlayer.playerOne === circleClass? './assets/icon-o.svg' : './assets/icon-x.svg';
            takeRoundText.innerHTML = `<img src=${src} /> takes the round`;
            takeRoundText.style.color = newPlayer.playerOne === circleClass? '#F2B137' : '#A8BFC9';

           cellElement.forEach(cell => {
    cell.removeEventListener('click', handleClick, { once: true });
  }); 
    }
            
        }
        
    }
      else if (status === 'draw') {
        setTimeout(() => {
            messageTie.style.display = 'block';
        }, 800);
        cellElement.forEach(cell => {
    cell.removeEventListener('click', handleClick, {once: true});
    });
    } 
}

function checkWin(newBoard, newPlayer) {
    for (let i = 0; i < winningCombos.length; i++) {
        let won = true;
        for (let j = 0; j < winningCombos[i].length; j++) {
            if (newBoard[winningCombos[i][j]] !== newPlayer) {
                won = false;
                break;
            }
        }
        if (won) {
            return true;
        }
    }
    return false;
}


function isDraw() {
    return [...cellElement].every(cell => {
        return cell.classList.contains(xClass) || cell.classList.contains(circleClass)
    });
}


// UPDATING SCORES
function earnPoints(newPlayer) {
    updateScore(newPlayer);
}

let player1Score = 0;
let player2Score = 0;
let drawScore = 0;

function updateScore(newPlayer) {
    if (checkWin(newBoard, newPlayer)) {

        if ((newPlayer === circleClass && p1 === 'o') || (newPlayer === xClass && p1 === 'x')) {
            if ((newPlayer === xClass && p1 === 'x')) {
                player1Score++;
                playerScores.innerHTML = 'X (YOU) <br>' + player1Score
            } else if (newPlayer === circleClass && p1 === 'o') {
                compScores.innerHTML = 'O (YOU) <br>' + player1Score++;
            }
        } else if ((newPlayer === circleClass && p2 === 'o') || (newPlayer === xClass && p2 === 'x')) {
             if ((newPlayer === xClass && p2 === 'x')) {
                player2Score++;
                playerScores.innerHTML = 'X (CPU) <br>' + player2Score;
            } else if (newPlayer === circleClass && p2 === 'o') {
                player2Score++;
                compScores.innerHTML = 'O (CPU) <br>' + player2Score;
            }
        }
        
    } else if (isDraw()) {
        drawScore++;
        tieScores.innerHTML = 'Ties <br>' + drawScore;
    }
}




}
