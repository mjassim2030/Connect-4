// # Connect 4 Game

/* To Do

    # MVP
    [X] Ask user to choose board size
    [ ] Choose Player vs Computer or Playre vs Player - will be skipped in the mean time.
    [ ] Let the user choose color of token
    [X] initaite winner and tie variable as false
    [X] Winner is the first to have horizontal, vertical, or diagonal line of 4 tokens.
    [X] Check winner
    [X] Alternate turns
    [ ] If all the game board is filled then its a tie
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
const boardSizes = [
    [4, 4],
    [5, 6],
    [6, 7],
    [7, 8],
]

const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
];

/*------------------------ Cached Element References ------------------------*/
const boardElement = document.querySelector('.board');
const boardSizeElement = document.querySelectorAll('.boardSize')
const messageElement = document.querySelector('.message')
/*-------------------------------- Variables --------------------------------*/
let selectedBoardSize = []
let rows = 0;
let columns = 0;
let gameGrid = [];
let html = '';
let turn;
let winner = false;
let tie = false;
let computerAI = false;
/*-------------------------------- Functions --------------------------------*/

const selectBoardSize = (e) => {

    selectedBoardSize = boardSizes[e.target.id.slice(5)]
    messageElement.style.display = 'none';
    boardSizeElement.forEach(element => { element.style.display = 'none'; });
    boardElement.style.display = 'flex';
    rows = selectedBoardSize[0]
    columns = selectedBoardSize[1]
    init(rows, columns);

}

// Budiling the grid of rows and columns with empty strings
const buildGrid = (rows, columns) => {
    let emptyRow = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            emptyRow.push("");
        }
        gameGrid.push(emptyRow);
        emptyRow = [];
    }

};

const buildDOMElements = (rows, columns) => {

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

const render = () => {

    if (!tie && winner) {
        messageElement.style.display = 'flex';
        messageElement.innerText = `${turn} is a Winner!`
    } else if (tie && !winner) {
        messageElement.style.display = 'flex';
        messageElement.innerText = `It's a Tie!`
    }

}

const dropToken = (column) => {

    //Check if the column has empty cells

    for (let row = gameGrid.length - 1; row >= 0; row--) {

        if (gameGrid[row][column] === "") {
            gameGrid[row][column] = turn

            document.getElementById(`col${column}_row${row}`).style.backgroundColor = turn === "R" ? "red" : "green";
            return row
        }
    }
};

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

const updateBoard = () => {
    if (winner) return
    gameGrid.forEach((rows, row) => {
        rows.forEach((cells, column) => {
            // console.log(row)
            document.getElementById(`col${column}_row${row}`).style.backgroundColor = cells === "R" ? "red" : cells === "G" ? "green" : "None";

        });
    });

};

const validDrop = (r, c) =>
    r >= 0 && r < rows && c >= 0 && c < columns;

const checkForWinner = (row, col) => {
    const token = gameGrid[row][col];



    let winningCombos = [];

    directions.forEach(([dr, dc]) => {
        let temp = [[row, col]]

        for (let i = 1; i <= rows * columns; i++) {
            const r = row + dr * i;
            const c = col + dc * i;

            if (!validDrop(r, c) || gameGrid[r][c] !== token) break;
            temp.push([r, c])
        }

        for (let i = 1; i <= rows * columns; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (!validDrop(r, c) || gameGrid[r][c] !== token) break;
            temp.push([r, c])
        }

        if (temp.length >= 4) {
            temp.forEach(el => {
                winningCombos.push(el);
            });
        }

    });

    if (winningCombos.length >= 4) {
        console.log(`${token} is a Winner!`);
        winner = true
        winningCombos.forEach((ele) => {
            console.log(`col${ele[1]}_row${ele[0]}`)
            document.getElementById(`col${ele[1]}_row${ele[0]}`).style.backgroundColor = "yellow";
        });


    }

};


const switchTokens = () => {
    if (winner) return

    if (turn === 'R') {
        turn = 'G'
    }
    else {
        turn = "R"
    }

};

const handleClick = (e) => {

    // if (!e.target.classList.contains("column") || !e.target.parentElement.classList.contains("column")) return

    let tokenColumn = null;

    if (e.target.classList.contains("column")) {
        tokenColumn = e.target.classList[1].slice(3);
    } else if (e.target.parentElement.classList.contains("column")) {
        tokenColumn = e.target.parentElement.classList[1].slice(3)
    }

    const tokenRow = dropToken(tokenColumn)
    checkForWinner(tokenRow, Number(tokenColumn));
    checkTie()
    switchTokens()
    updateBoard();
    render();
}

const init = (rows, columns) => {
    buildGrid(rows, columns);
    buildDOMElements(rows, columns);
    turn = "R"
    updateBoard();
}

/*----------------------------- Event Listeners -----------------------------*/
boardElement.addEventListener('click', handleClick)
boardSizeElement.forEach(element => { element.addEventListener('click', selectBoardSize) });