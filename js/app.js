// # Connect 4 Game

/* To Do

## Technical Requirements - MVP
    [X] Render the game in the browser using the DOM manipulation techniques demonstrated in lecture.
    [X] Include win/loss logic and render win/loss messages in HTML. The game you chose must have a win/lose condition.
    [X] Include separate HTML, CSS, JavaScript, and JavaScript data files organized in an appropriate file structure.
    [ ] Include all required features specific to your game as defined in the Required
        Features column in the table in the Recommended games document, or as
        discussed with your instructor if doing a custom game.
    [ ] The game is deployed online so the rest of the world can play it.

 ## Code Convention Requirements
    [ ] The game can be played without encountering errors. No errors may be present in
        the console in the browser.
    [ ] The code in the app adheres to coding conventions covered in lessons, like using
        plural names for arrays.
    [ ] There is no remaining dead and/or commented out code or console logs outside of
        a commented out Code Graveyard section of your code.
    [ ] The game may not utilize the prompt() or alert() methods.
    [ ] The game is coded using proper indentation.

## UI/UX Requirements

    [X ] CSS Flexbox or Grid is used for page layout design
    [ ] Instructions about how to play the game are included in your app.
    [X] Colors used on the site have appropriate contrast that meet the WCAG 2.0 level AA standard.
    [ ] All images on the site have alt text.
    [ ] No text is placed on top of an image in a way that makes that text inaccessible.

## Git and GitHub Requirements
    [ ] You are shown as the only contributor to the project on GitHub.
    [ ] The GitHub repository used for the project is named appropriately. For example,
        names like connect-four or adventure-game are appropriate names, whereas
        game-project or ga-project are not. The repo must be publicly accessible.
    [ ] Frequent commits dating back to the very beginning of the project. If you start over
        with a new repo, do not delete the old one.
    [ ] Commit messages should be descriptive of the work done in the commit.

## README Requirements
    [ ] Screenshot/Logo: A screenshot of your app or a logo.
    [ ] Your game's name: Include a description of your game and what it does.
        Background info about the game and why you chose it is a nice touch.
    [ ] Getting started: Include a link to your deployed game and any instructions you
        deem important. This should also contain a link to your planning materials.
    [ ] Attributions: This section should include links to any external resources (such as
        libraries or assets) you used to develop your application that require attribution.
        You can exclude this section if it does not apply to your application.
    [ ] Technologies Used: List of the technologies used, for example: JavaScript, HTML,
        CSS, etc.
    [ ] Next steps: Planned future enhancements (stretch goals).

## Presentation Requirements
    [ ] Present your project in front of the class on the scheduled presentation day.
    [ ] The project you present is the project you were approved by your instructor to
        build.

--------------------------------------------------


    # MVP
    [X] Ask user to choose board size
    [ ] Choose Player vs Computer or Playre vs Player - will be skipped in the mean time.
    [X] Let the user choose color of token
    [X] initaite winner and tie variable as false
    [X] Winner is the first to have horizontal, vertical, or diagonal line of 4 tokens.
    [X] Check winner
    [X] Alternate turns
    [X] If all the game board is filled then its a tie
    [ ] Skip non-Empty Columns
    [ ] Clear Wining Combo
    [ ] Configure Back Sound
    [ ] Render Messages
    [ ] There should be a button to restart the game.

    # Level Ups
    [ ] The game will have a counter of how many times each wins and when its a tie none will get a point.
    [ ] There should be a button to "play another round", in that case the winning counter will keep adding.
    [ ] Store Player Rounds in the browser using local storage

    # Game Visuals
    [ ] The game will have background sound playing in loop
    [ ] Tokens will be animated when falling down into the selected column
    [ ] Tokens will create sliding and hitting sounds effects
    [ ] When we have the game mode (Player vs computer) then if the player looses then play loose sound, if player wins play winning sound.
    [ ] There should be a visual animated pop up showing the final results (ex. Red (0) - Green (0))
    [ ] The winning combination should be highlighted in different color, with swinging animation.
    [ ] Dark mode
    */
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
    baordSize: [],
    playerOneColor: 'R',
    playerTwoColor: "G",
    computerAI: false,
}

/*------------------------ Cached Element References ------------------------*/
const boardElement = document.querySelector('.board');
const screenElement = document.querySelector('.screen')



const boardSizeElement = document.querySelectorAll('.boardSize')
const redTokenElement = document.querySelector('#redToken')
const greenTokenElement = document.querySelector('#greenToken')
const tokenSelector = document.querySelector(".tokenSelector");


const versusPlayerElement = document.querySelector('#versusPlayer')
const versusComputerElement = document.querySelector('#versusComputer')
const modeSelector = document.querySelector(".modeSelector");


/*-------------------------------- Variables --------------------------------*/
let rows = 0;
let columns = 0;
let gameGrid = [];
let html = '';
let turn;
let winner = false;
let tie = false;
let step = 0;

/*-------------------------------- Functions --------------------------------*/

const showScreen = (message, buttonsText, icons, timer) => {
    let screenContent = '';
    screenElement.style.display = 'flex'
    screenContent = `<p>${message}</p><div class="buttons">`
    screenElement.innerHTML = "";
    buttonsText.forEach((buttonText, index) => {
        screenContent = screenContent + (icons ? "" : `<img src="${icons[index]}/>`) + `<button class="options" id="${index}">${buttonText}</button>`
    });
    screenContent += "</div>"

    screenElement.innerHTML = screenContent;

    if (timer) {
        setTimeout(() => {
            screenElement.style.display = 'none'
        }, 3000)
    }

}

showScreen("Select your Game Mode", ['Player vs Player', 'Player vs Computer'], [], false)

const screensCallBack = (e) => {

    if (e.target.classList.contains("options")) {
        if (step === 0) {
            gameData.computerAI = (e.target.id === '1')
            step++;
            showScreen("Select Board Size", ['4x5', '5x6', '6x7', '7x8'], [], false)
        } else if (step === 1) {
            gameData.baordSize.push(e.target.innerText.split("x")[0], e.target.innerText.split("x")[1])
            step++;
            showScreen("Select your prefered token color", ['Red', 'Green'], [], false)
        } else if (step === 2) {
            gameData.playerOneColor = e.target.innerText === "Red" ? "R" : "G";
            gameData.playerTwoColor = gameData.playerOneColor === "R" ? "G" : "R";
            rows = gameData.baordSize[0]
            columns = gameData.baordSize[1]
            init(rows, columns);
            step = 0;
            screenElement.style.display = 'none'
            boardElement.style.display = 'flex';
        }
    }

};

// Construct grid of rows and columns with empty strings
const constructGrid = (rows, columns) => {
    let emptyRow = [];

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

    for (let col = 0; col < columns; col++) {

        html += `<div class="column col${col}">`;
        for (let row = 0; row < rows; row++) {
            html += `<div class="cell" id="col${col}_row${row}"></div>`
        }
        html += "</div>"
        boardElement.innerHTML += html;
        html = ""
    }

};

// Render messages on the UI
const render = () => {

    if (!tie && winner) {
        showScreen(`${turn} is a Winner!`, [], [], true)
    } else if (tie && !winner) {
        showScreen(`It's a Tie!`, [], [], true)
    }

}

// This function triggered when the user drops a token (Clicking on one the columns)
// To place a token (Red or Green)
const dropToken = (column) => {

    for (let row = gameGrid.length - 1; row >= 0; row--) {

        //Check if the column has empty cells
        if (gameGrid[row][column] === "") {
            gameGrid[row][column] = turn

            document.getElementById(`col${column}_row${row}`).style.backgroundColor = turn === "R" ? "red" : "green";
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

        });
    });

};

const getAvailableColumns = () => {
    const cols = [];
    for (let col = 0; col < columns; col++) {
        if (gameGrid[0][col] === "") {
            cols.push(col);
        }
    }
    return cols;
};

// -----------------------------------------------------------------
const wouldWin = (col, token) => {
    // Copy grid
    const tempGrid = gameGrid.map(row => [...row]);

    // Drop the token in the simulated grid
    for (let row = rows - 1; row >= 0; row--) {
        if (tempGrid[row][col] === "") {
            tempGrid[row][col] = token;
            return checkWinSim(row, col, token, tempGrid);
        }
    }

    return false;
};

// const dropTokenComputer = () => {
//     const avaliableColumns = [];

//     for (let col = 0; col < columns; col++) {
//         if (gameGrid[0][col] === "") {
//             avaliableColumns.push(col)
//         }
//     }

//     if (avaliableColumns.length === 0) return;

//     const randomColumn = avaliableColumns[Math.floor(Math.random() * avaliableColumns.length)];

//     const tokenRow = dropToken(randomColumn);
//     checkForWinner(tokenRow, randomColumn);
//     checkTie()
//     switchTokens()
//     updateBoard();
//     render();
// }

const checkWinSim = (row, col, token, grid) => {
    for (let [dr, dc] of directions) {
        let count = 1;

        // Forward
        for (let i = 1; i < 4; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (!validCell(r, c) || grid[r][c] !== token) break;
            count++;
        }

        // Backward
        for (let i = 1; i < 4; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (!validCell(r, c) || grid[r][c] !== token) break;
            count++;
        }

        if (count >= 4) return true;
    }

    return false;
};

const executeComputerMove = (col) => {
    const tokenRow = dropToken(col);
    checkForWinner(tokenRow, col);
    checkTie();
    switchTokens();
    updateBoard();
    render();
};

const dropTokenComputer = () => {
    const availableColumns = getAvailableColumns();

    // 1. Try to win
    for (let col of availableColumns) {
        if (wouldWin(col, platerTwoColor)) {
            executeComputerMove(col);
            return;
        }
    }

    // 2. Block player win
    for (let col of availableColumns) {
        if (wouldWin(col, playerOneColor)) {
            executeComputerMove(col);
            return;
        }
    }

    // 3. Prefer center columns
    const center = Math.floor(columns / 2);
    const sortedCols = availableColumns.sort((a, b) => Math.abs(center - a) - Math.abs(center - b));
    executeComputerMove(sortedCols[0]); // Best next move
};
//---------------------------------------------------------------------

// Check if the cell is valid in the grid rows and columns
const validCell = (r, c) =>
    r >= 0 && r < rows && c >= 0 && c < columns;

// Check for winner by finding 4 in row simmilar tokens, either horizontally
// Verticall, or Diagonaly
const checkForWinner = (row, col) => {
    const token = gameGrid[row][col];

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

    if (winningCombos.length >= 4) {
        winner = true
        winningCombos.forEach((ele) => {
            document.getElementById(`col${ele[1]}_row${ele[0]}`).style.backgroundColor = "yellow";
        });
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

};

// Callback Function called when a column or cell is clicked
const handleClick = (e) => {

    let tokenColumn = null;

    if (e.target.classList.contains("column")) {
        tokenColumn = e.target.classList[1].slice(3);
    } else if (e.target.parentElement.classList.contains("column")) {
        tokenColumn = e.target.parentElement.classList[1].slice(3)
    }
    if (tokenColumn) {
        const tokenRow = dropToken(tokenColumn)

        checkForWinner(tokenRow, Number(tokenColumn));
        checkTie()
        switchTokens()
        updateBoard();
        render();

        if (gameData.computerAI && !winner && !tie && turn === gameData.platerTwoColor) {
            setTimeout(dropTokenComputer, 500)
        }
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
    updateBoard();
}

/*----------------------------- Event Listeners -----------------------------*/
boardElement.addEventListener('click', handleClick)
screenElement.addEventListener('click', screensCallBack)

// boardSizeElement.forEach(element => { element.addEventListener('click', selectBoardSize) });
// redTokenElement.addEventListener('click', selectTokenColor)
// greenTokenElement.addEventListener('click', selectTokenColor)
// versusPlayerElement.addEventListener('click', selectGameMode)
// versusComputerElement.addEventListener('click', selectGameMode)


