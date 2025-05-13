// # Connect 4 Game

// This is the classic ***connect 4*** game where there are rounded two colored token (Red and Blue), there will be two player in the game User vs PC or User vs User.

// Pseudocode 
// 1- As the game starts it will ask user to choose the game mode (Player vs Player) or (Player vs Computer)
// 2- Then the player will be asked to choose the preferred token color (Red or Blue), if selected then the other player/computer will have the other color.
// 3- Game will start by showing empty grid of 7 columns and 6 rows rounded cells
// 4- The game will randomly choose which token color will start playing first.
// 5- Players will choose which of the 7 columns to drop the token, noting that filled columns should be skipped.
// 6- Players will be given turns in alternating way.
// 7- Winner is the first to have horizontal, vertical, or diagonal line of 4 tokens.
// 8- If all the game board is filled then its a tie,
// 9- The game will have a counter of how many times each wins and when its a tie none will get a point.
// 10- There should be a button to restart the game.
// 11- There should be a button to "play another round", in that case the winning counter will keep adding.

// More Visual Effects
// 1- The game will have background sound playing in loop
// 2- Tokens will be animated when falling down into the selected column
// 3- Tokens will create sliding and hitting sounds effects,
// 4- When we have the game mode (Player vs computer) then if the player looses then play loose sound, if player wins play winning sound.
// 5- There should be a visual animated pop up showing the final results (ex. Red (0) - Blue (0))
// 6- The winning combination should be highlighted in different color, with swinging animation.

/* To Do

    // [X] Ask user to choose board size
    // [ ] Choose Player vs Computer or Playre vs Player
    // [ ] Check winner
    // [ ] initaite winner an tie variable as false
    // [ ] Clear Wining Combo
    // [ ] Configure Back Sound
    // [ ] Render Messages
*/
/*-------------------------------- Constants --------------------------------*/
const boardSizes = [
    [4,5],
    [5,6],
    [6,7],
    [7,8],    
]

let emptyGameGrid = [];
let emptyRow = [];

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
/*-------------------------------- Functions --------------------------------*/

const selectBoardSize = (e) => {

    selectedBoardSize = boardSizes[e.target.id.slice(5)]
    messageElement.style.display = 'none';
    rows = selectedBoardSize[0]
    columns = selectedBoardSize[1]
    init(rows, columns);

}

// Budiling the grid of rows and columns with empty strings
const buildGrid = (rows, columns) => {

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            emptyRow.push("");
        }
        gameGrid.push(emptyRow);
        emptyRow = [];
    }

    emptyGameGrid = gameGrid.map(row => [...row]);

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

const updateBoard = () => {

    gameGrid.forEach((rows, row) => {
        rows.forEach((cells, column) => {
            console.log(row)
            document.getElementById(`col${column}_row${row}`).style.backgroundColor = cells === "R" ? "red" : cells === "G" ? "green" : "None";

        });
    });

};

const checkForWinner = (row, col) => {
    const player = gameGrid[row][col];

    const directions = [
        [0, 1],  // horizontal
        [1, 0],  // vertical
        [1, 1],  // diagonal \
        [1, -1], // diagonal /
    ];

    const isValid = (r, c) =>
        r >= 0 && r < rows && c >= 0 && c < columns;

    let winningCombos = [];
    emptyGameGrid[row][col] = "#";

    directions.forEach(([dr, dc]) => {
        let temp = [[row, col]]

        // console.log(dr, dc)
        // Check forward
        for (let i = 1; i <= rows * columns; i++) {
            const r = row + dr * i;
            const c = col + dc * i;

            if (!isValid(r, c) || gameGrid[r][c] !== player) break;
            emptyGameGrid[r][c] = i;

            temp.push([r, c])
        }

        for (let i = 1; i <= rows * columns; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (!isValid(r, c) || gameGrid[r][c] !== player) break;
            emptyGameGrid[r][c] = i;
            temp.push([r, c])
        }

        if (temp.length >= 4) {
            temp.forEach(el => {
                winningCombos.push(el);
            });
        }

    });

    if (winningCombos.length >= 4) {
        console.log(`${player} is a Winner!`);
        // console.log(winningCombos)

        winningCombos.forEach((ele) => {
                console.log(ele[0], ele[1])
                document.getElementById(`col${ele[1]}_row${ele[0]}`).style.backgroundColor = "Yellow";
        });

    }

};


const switchTokens = () => {

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
    switchTokens()
    updateBoard();

}

const init = (rows, columns) => {
    buildGrid(rows, columns);
    buildDOMElements(rows, columns);
    turn = "R"
    updateBoard();
}

/*----------------------------- Event Listeners -----------------------------*/
boardElement.addEventListener('click', handleClick)
boardSizeElement.forEach(element => {element.addEventListener('click', selectBoardSize)});