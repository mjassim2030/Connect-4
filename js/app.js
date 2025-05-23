/*-------------------------------- Constants --------------------------------*/

// Array to hold different board sizes by [row, column]
const boardSizes = [
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
]


// Array to hold directions in which the code will check 
// if we have 4 simmilar tokens in row
const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
];

const gameData = {
    firstTime: true,
    boardSize: [],
    playerOneColor: 'R',
    playerTwoColor: "G",
    computerAI: false,
    difficulty: 'easy',
    dropTokenFunction: '',
    wins: 0,
    alienImage: "./assets/images/alien.png",
    astroImage: "./assets/images/astro.png"
}

/*------------------------ Cached Element References ------------------------*/
const boardElement = document.querySelector('.board');
const screenElement = document.querySelector('.screen')
const fallingTokens = document.getElementById("fallingTokens")
const clickSound = document.getElementById("clickSound");
const startSound = document.getElementById("startSound");
const tokenSound = document.getElementById("tokenSound");
const loseSound = document.getElementById("loseSound");
const tieSound = document.getElementById("tieSound");
const backSound = document.getElementById("backSound");
const winSound = document.getElementById("winSound");
const backButton = document.getElementById("backButton")
const winsText = document.getElementById("winsText");
const clearBtn = document.getElementById("clearWins");
const howToElement = document.getElementById("howTo");
const bottomOptions = document.querySelector(".bottomOptions");
const resetBtn = document.getElementById('reset')
const newGameElement = document.getElementById('newGame')
const headerElement = document.querySelector('.header')

/*-------------------------------- Variables --------------------------------*/
let rows = 0;
let columns = 0;
let gameGrid = [];
let html = '';
let turn;
let winner = false;
let tie = false;
let step = 0;
let allowMove = false
let unlockNormalMode = 1;
let screenSequence = []

/*-------------------------------- UI Functions --------------------------------*/
const showScreen = (message, buttonsText, icons, timer, nextStep, delay) => {
    let screenContent = '';
    screenElement.style.display = 'flex'
    screenElement.innerHTML = "";
    screenContent = `<button class="backButton" id="backButton" ${nextStep <= 2 ? `hidden` : ""}>⬅️ Back</button><p>${message}</p>`
    if (buttonsText.length > 0) {
        screenContent = screenContent + `<div class="buttons">`
        buttonsText.forEach((buttonText, index) => {
            if (gameData.computerAI && nextStep === 3 && index === 1 && Number(gameData.wins) < unlockNormalMode) {
                let comments = `</br></br>You have to win ${unlockNormalMode} time in easy mode, or vs player to unlock Normal Difficulty`;
                screenContent += `<button class="options" disabled style="width: 200px;">${buttonText}${comments}</button>`;
            } else {
                screenContent += `<button onclick="playSound(1)" class="options" id="${index}">
            ${icons.length > 0 ? `<img class="options2" src="${icons[index]}" style="width: 4rem;" alt="Button Icon"/>` : ''}
            ${buttonText}</button>`;
            }
        });
        screenContent = screenContent + "</div>"
    }
    screenElement.innerHTML = screenContent;

    step = nextStep

    if (timer) {
        setTimeout(() => {
            screenElement.style.display = 'none'
        }, delay)
    }

}

const screenSelector = (id, targetID, back) => {
    switch (id) {
        case 1:
            showScreen("Select your Game Mode", ['Player vs Player', 'Player vs Computer'], [], false, 2)
            break;
        case 2:
            if (!back) gameData.computerAI = (targetID.id === '1')
            if (gameData.computerAI) {
                showScreen("Choose Diffculty Level", ['Easy Mode', 'Normal Mode'], [], false, 3)
            } else {
                showScreen("Select Board Size", ['4x5', '5x6', '6x7', '7x8'], [], false, 4)
            }
            break;
        case 3:
            if (!back) {
                if (targetID.id === '0') {
                    gameData.difficulty = 'easy'
                    gameData.dropTokenFunction = dropTokenComputerEasyMode
                } else {
                    gameData.difficulty = 'normal'
                    gameData.dropTokenFunction = dropTokenComputerNormalMode
                }
                step++;
            }
            showScreen("Select Board Size", ['4x5', '5x6', '6x7', '7x8'], [], false, 4)
            break;
        case 4:
            if (!back) {
                gameData.boardSize = [targetID.innerText.split("x")[0], targetID.innerText.split("x")[1]]
                step++;
            }
            showScreen("Are you with us or with the Aliens!?", ['Aliens', 'Astrounts'], [gameData.alienImage, gameData.astroImage], false, 5)
            break;
        case 5:
            gameData.playerOneColor = targetID.innerText.trim() === "Aliens" ? "R" : "G";
            gameData.playerTwoColor = gameData.playerOneColor === "R" ? "G" : "R";
            rows = gameData.boardSize[0]
            columns = gameData.boardSize[1]
            init(rows, columns);
            step = 0;

            turnToken.style.backgroundColor = gameData.playerOneColor === "R" ? "red" : "green";
            turnToken.style.backgroundImage = gameData.playerOneColor === "R" ? `url(${gameData.alienImage})` : `url(${gameData.astroImage})`;
            turnToken.ariaLabel = 'Token Image';
            turnToken.style.backgroundSize = "cover";

            screenElement.style.display = 'none'
            headerElement.style.display = 'flex';
            boardElement.style.display = 'flex';
            bottomOptions.style.display = 'flex';

            playSound(2)

            if (!localStorage.getItem("firstTime") || localStorage.getItem("firstTime") == 0) {
                localStorage.setItem("firstTime", 1);
                gameData.firstTime = true;
            } else {
                gameData.firstTime = false;
            }
            if (gameData.firstTime) {
                howToScreen(1200);
            }
            break;
        case -1:
            allowMove = true
            screenElement.style.display = 'none'
            break;
    }
}

const howToScreen = (delay) => {
    allowMove = false

    // How to play
    setTimeout(() => {
        showScreen(`
                    How to Play
                    </br>
                    <small style="font-size: 1rem;"></br>
                    When it's your turn, 
                    Click on your desired column to drop your token.
                    </small>
                    
                    <small style="font-size: 1rem;">
                    To win, drop  <span style="font-size: 2rem; color: yellow;"> 4 </span> successive tokens 
                    <span style="font-size: 2rem;"> ↔️ </span>Horizontally, <span style="font-size: 2rem;"> ↕️ </span>Vertically, or <span style="font-size: 2rem;"> ↙️↘️↗️↖️ </span>Diagonally
                    </small>
                    
                    <div style="display: flex; flex-direction: row;">
        
                        ${`<div class="cell" ariaLabel="Token Image" style="background-color: ${gameData.playerOneColor === "R" ? "red" : "green"}; 
                        background-image: url(${gameData.playerOneColor === "R" ? gameData.alienImage : gameData.astroImage}); 
                        width: 4vw; aspect-ratio: 1/1;"></div>`.repeat(4)}

                    </div>
                    `, ["OK"], [gameData.playerOneColor === "R" ? gameData.alienImage : gameData.astroImage], false, -1, 0);

    }, delay)
};

const screensCallBack = (e) => {

    if (e.target.classList.contains("backButton") && screenSequence.length > 0) {
        screenSequence.pop()

        screenSelector(screenSequence[screenSequence.length - 1], e.target, true)
    }
    if (e.target.classList.contains("options") || e.target.classList.contains("options2")) {
        if (step !== -1) screenSequence.push(step)
        if (e.target.classList.contains("options2"))
            screenSelector(step, e.target.parentElement, false)
        else
            screenSelector(step, e.target, false)
    }
};


/*-------------------------------- Constructor Functions --------------------------------*/
// Construct grid of rows and columns with empty strings
const constructGrid = (rows, columns) => {
    let emptyRow = [];
    gameGrid = []
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            emptyRow.push("");
        }
        gameGrid.push(emptyRow);
        emptyRow = [];
    }

};

// Dynamically construct Document Object Model (DOM) elements
// to ensure the game's flexibility and scalability.
const constructDOMElements = (rows, columns) => {
    boardElement.innerHTML = "";
    for (let col = 0; col < columns; col++) {

        html += `<div class="column col${col}">`;
        for (let row = 0; row < rows; row++) {
            html += `<div ariaLabel="Token Image" class="cell" id="col${col}_row${row}"></div>`
        }
        html += "</div>"
        boardElement.innerHTML += html;
        html = ""
    }

};


/*-------------------------------- Utility Functions --------------------------------*/
const getAvailableColumns = () => {
    const cols = [];
    for (let col = 0; col < columns; col++) {
        if (gameGrid[0][col] === "") {
            cols.push(col);
        }
    }
    return cols;
};

// Check if the cell is valid in the grid rows and columns
const validCell = (r, c) =>
    r >= 0 && r < rows && c >= 0 && c < columns;

const animateTokensFalling = (row, column) => {
    playSound(3);
    const locatedCell = document.getElementById(`col${column}_row${row}`);
    const topLevelRow = document.getElementById(`col${column}_row${0}`);
    const locatedRect = locatedCell.getBoundingClientRect();
    const topCellRect = topLevelRow.getBoundingClientRect();
    fallingTokens.style.backgroundColor = turn === "R" ? "red" : "green";
    fallingTokens.background = ''
    fallingTokens.style.width = `${locatedRect.width - 5}px`;
    fallingTokens.style.height = `${locatedRect.height - 5}px`;
    fallingTokens.style.backgroundSize = "cover";
    fallingTokens.style.backgroundImage = turn === "R" ? `url(${gameData.alienImage})` : `url(${gameData.astroImage})`
    fallingTokens.ariaLabel = "Token Image"
    fallingTokens.style.display = 'flex';
    fallingTokens.style.top = `${topCellRect.top + window.screenY}px`;
    fallingTokens.style.left = `${locatedRect.left + window.scrollX}px`;

    setTimeout(() => {
        fallingTokens.style.top = `${locatedRect.top + window.scrollY}px`;

    }, 100)

    setTimeout(() => {
        fallingTokens.style.top = 0;
        fallingTokens.style.display = 'none';
    }, 1000)
};

const playSound = (id) => {
    let sound;
    switch (id) {
        case 0:
            sound = backSound
            sound.currentTime = 0;
            sound.volume = 0.3;
            break
        case 1:
            sound = clickSound;
            sound.currentTime = 0;
            sound.volume = 0.2;
            break;
        case 2:
            sound = startSound;
            sound.currentTime = 0;
            sound.volume = 0.7;
            break;
        case 3:
            sound = tokenSound;
            sound.currentTime = 0;
            sound.volume = 0.6;
            break;
        case 4:
            sound = winSound;
            sound.currentTime = 0;
            sound.volume = 0.7;
            break;
        case 5:
            sound = loseSound;
            sound.currentTime = 0;
            sound.volume = 0.8;
            break;
        case 6:
            sound = tieSound;
            sound.currentTime = 0;
            sound.volume = 0.8;
            break;
        default:
            return;
    }

    try {
        sound.play()
    } catch (error) {
        console.warn("Error attempting to play sound:", error);
    }
};

const readStorage = () => {
    if (!localStorage.getItem("win")) {
        localStorage.setItem("win", 0);
    } else {
        gameData.wins = localStorage.getItem("win");
    }
    updateWinText();
}

const updateWinText = () => {
    winsText.innerText = gameData.wins;
};

const updateStorage = () => {
    readStorage()
    gameData.wins++
    localStorage.setItem("win", gameData.wins);
    updateWinText();
}

const clearWins = () => {
    localStorage.setItem("win", 0);
    localStorage.setItem("firstTime", 0);
    gameData.wins = 0;
    updateWinText();
};

const executeMove = (col) => {
    const tokenRow = dropToken(col);
    checkForWinner(tokenRow, Number(col));
    checkTie();
    switchTokens();
    setTimeout(() => updateBoard(), 1000)
    setTimeout(() => render(), gameData.computerAI && !winner ? 2000 : winner || tie ? 1500 : 0)
};

/*-------------------------------- Computer Moves Functions --------------------------------*/
const dropTokenComputerNormalMode = () => {
    const availableColumns = getAvailableColumns();
    allowMove = false;
    // Try to win
    for (let col of availableColumns) {
        if (simulate(col, gameData.playerTwoColor)) {
            executeMove(col);
            return;
        }
    }

    // Block player
    for (let col of availableColumns) {
        if (simulate(col, gameData.playerOneColor)) {
            executeMove(col);
            return;
        }
    }

    // Play Randomly
    const randomColumn = availableColumns[Math.floor(Math.random() * availableColumns.length)];
    executeMove(randomColumn);

}

const dropTokenComputerEasyMode = () => {
    allowMove = false;
    const availableColumns = getAvailableColumns();
    const randomColumn = availableColumns[Math.floor(Math.random() * availableColumns.length)];
    executeMove(randomColumn);
}

const simulate = (col, token) => {
    for (let row = rows - 1; row >= 0; row--) {
        if (gameGrid[row][col] === "") {
            return checkForWinner(row, col, true, token)
        }
    }
};

/*-------------------------------- Game Flow Functions --------------------------------*/
// Render messages on the UI
const render = () => {

    if (!allowMove) {
        if (!tie && winner) {
            if (gameData.computerAI && gameData.playerOneColor === turn) {
                playSound(4);
                showScreen(`You are the Winner!`, [], [], true, 0, 3000)
                updateStorage()
            } else if (gameData.computerAI && gameData.playerTwoColor === turn) {
                playSound(5);
                showScreen(`You Lose!`, [], [], true, 0, 3000);
            } else {
                playSound(4);
                if (gameData.playerOneColor === turn) {
                    updateStorage()
                }
                showScreen(`${['Aliens', 'Astrounts'][turn === "R" ? 0 : 1]} are the Winners!`, [], [], true, 0, 3000)
            }

        } else if (tie && !winner) {
            playSound(6);
            showScreen(`It's a Tie!`, [], [], true, 0, 3000)
        }
    }
    allowMove = true;

}

// When the user drops a token (Clicking on one of the columns to plave a token)
const dropToken = (column) => {

    for (let row = gameGrid.length - 1; row >= 0; row--) {

        //Check if the column has empty cells
        if (gameGrid[row][column] === "") {
            gameGrid[row][column] = turn
            animateTokensFalling(row, column)
            return row
        }
    }
};

// Check if we have tie situation 
// when all grid cells are filled with tokens with no winner
const checkTie = () => {

    const check = gameGrid.reduce((acc, value, index) => {

        if (!acc[index]) {
            acc[index] = value.includes("");
        }
        return acc
    }, []);

    if (!check.includes(true)) {
        tie = true;
    }
}

// Update the Board corresponding locations with the dropped token color
const updateBoard = () => {
    if (winner) return
    gameGrid.forEach((rows, row) => {
        rows.forEach((cells, column) => {
            document.getElementById(`col${column}_row${row}`).style.backgroundColor = cells === "R" ? "red" : cells === "G" ? "green" : "None";
            document.getElementById(`col${column}_row${row}`).style.backgroundImage = cells === "R" ? `url(${gameData.alienImage})` : cells === "G" ? `url(${gameData.astroImage}) ` : "None";
        });
    });

};

// Check for winner by finding 4 in row simmilar tokens, either horizontally
// Verticall, or Diagonaly
const checkForWinner = (row, col, simulated, simulatedToken) => {

    const token = simulatedToken ? simulatedToken : gameGrid[row][col];

    let winningCombos = [];

    directions.forEach(([dr, dc]) => {
        let temp = [[row, col]]

        for (let i = 1; i <= rows * columns; i++) {
            const r = row + dr * i;
            const c = col + dc * i;

            if (!validCell(r, c) || gameGrid[r][c] !== token) break;
            temp.push([r, c])
        }

        for (let i = 1; i <= rows * columns; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (!validCell(r, c) || gameGrid[r][c] !== token) break;
            temp.push([r, c])
        }

        if (temp.length >= 4) {
            temp.forEach(el => {
                winningCombos.push(el);
            });
        }
    });

    if (simulated && winningCombos.length >= 4) return true;
    if (winningCombos.length >= 4) {
        winner = true
        setTimeout(() => {
            winningCombos.forEach((ele) => {
                document.getElementById(`col${ele[1]}_row${ele[0]}`).style.backgroundColor = "yellow";
                document.getElementById(`col${ele[1]}_row${ele[0]}`).style.backgroundImage = token === "R" ? `url(${gameData.alienImage})` : `url(${gameData.astroImage})`;
                document.getElementById(`col${ele[1]}_row${ele[0]}`).classList.add('animate');
            });
        }, 1000);

    }

};

// Switch token colors for next player move
const switchTokens = () => {
    if (winner) return

    if (turn === 'R') {
        turn = 'G'
    }
    else {
        turn = "R"
    }
    turnToken.style.backgroundColor = turn === "R" ? "red" : "green";
    turnToken.style.backgroundImage = turn === "R" ? `url(${gameData.alienImage})` : `url(${gameData.astroImage})`;
    turnToken.style.backgroundSize = "cover";
};

// Callback Function called when a column or cell is clicked
const handleClick = (e) => {
    if (winner || !allowMove) return
    allowMove = false;

    let tokenColumn = null;

    if (e.target.classList.contains("column")) {
        tokenColumn = e.target.classList[1].slice(3);
    } else if (e.target.parentElement.classList.contains("column")) {
        tokenColumn = e.target.parentElement.classList[1].slice(3)
    }
    if (tokenColumn && getAvailableColumns().includes(Number(tokenColumn))) {

        executeMove(tokenColumn)

        setTimeout(() => {
            if (gameData.computerAI && !winner && !tie && turn === gameData.playerTwoColor) {
                gameData.dropTokenFunction();
            }
        }, 1500);

    } else {
        allowMove = true
    }
}

// Initial fun function called upon selecting a board size, 
// which will construct the grid of with empty strings,
// and construct cells DOM elements on the HTML
// It will also initialize the turn token color, and update the board data.
const init = (rows, columns) => {
    constructGrid(rows, columns);
    constructDOMElements(rows, columns);
    turn = gameData.playerOneColor
    winner = false;
    tie = false;
    allowMove = true
    updateBoard();
    playSound(0);
}

const newGame = () => {
    readStorage();
    headerElement.style.display = 'none';
    boardElement.style.display = 'none';
    bottomOptions.style.display = 'none';
    showScreen("Are you ready!", ['START GAME'], [], false, 1)
}

newGame();

/*----------------------------- Event Listeners -----------------------------*/
boardElement.addEventListener('click', handleClick)
screenElement.addEventListener('click', screensCallBack)
clearBtn.addEventListener('click', clearWins)
resetBtn.addEventListener('click', () => init(rows, columns))
howToElement.addEventListener('click', () => howToScreen(0))
newGameElement.addEventListener('click', newGame)