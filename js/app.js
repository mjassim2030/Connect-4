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

/*-------------------------------- Constants --------------------------------*/
const numberOfColumns = 7;
const numberOfRows = 6;
let gameGrid = [];
let emptyRow = [];
let html = '';
let turn;
directions = [
    // [row, col]
    // [0,0],  // Current
    // [0, 1],  // Right
    // [0, -1], // Left
    // [1, 0],  // Down
    // [-1, 0], // Up
    [1, 1],  // Diagonal Down Right
    // [-1, 1], // Diagonal Up Right
    // [1, -1], // Diagonal Down Left
    // [-1, -1],// Diagonal Up Left
]

/*------------------------ Cached Element References ------------------------*/
const boardElement = document.querySelector('.board');
// const cellElement = document.querySelectorAll('.cell');

/*-------------------------------- Variables --------------------------------*/



/*-------------------------------- Functions --------------------------------*/

// Budiling the grid of rows and columns with empty strings
const buildGrid = (rows, columns) => {

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            emptyRow.push("");
        }
        gameGrid.push(emptyRow);
        emptyRow = [];
    }

};

const buildDOMElements = (rows, columns) => {

    // let cell = 0
    for (let col = 0; col < columns; col++) {

        html += `<div class="column col${col}">`;

        for (let row = 0; row < rows; row++) {
            // cell++
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

const checkForWinner = (currentRow, currentColumn) => {
    let previousRow = 0;
    let previousColumn = 0;


    directions.forEach(dir => {

    previousRow = currentRow + dir[0];
    previousColumn = currentColumn;

    }

    // for (let col = numberOfColumns; col > 0; col--) {


    //     for (let row = numberOfRows; row > 0; row--) {

    //         currentRow = row + 1
    //         currentColumn = col + 1
    //         //previousRow = currentRow
    //         //previousColumn = currentColumn

    //         console.log(`(${currentRow}, ${currentColumn})`)
    //     }

    // }


}

const switchTokens = () => {

    if (turn === 'R') {
        turn = 'B'
    }
    else {
        turn = "R"
    }

};

const handleClick = (e) => {

    // console.log(e.target.classList.contains("cell"))
    // if (!e.target.classList.contains("column") || !e.target.classList.contains("cell")) return

    if (e.target.classList.contains("cell")) {
        const tokenColumn = e.target.parentElement.classList[1].slice(3)

        const tokenRow = dropToken(tokenColumn)
        console.log(tokenRow)
        checkForWinner(tokenRow, tokenColumn);
        switchTokens()

    }
}

const init = () => {
    buildGrid(numberOfRows, numberOfColumns);
    buildDOMElements(numberOfRows, numberOfColumns);
    turn = "R"
    // Ask user to choose board size
    // Choose Player vs Computer or Playre vs Player
    // Check winner
    // initaite winner an tie variable as false
    // Clear Wining Combo
    // Configure Back Sound
    // Render Messages
}
init()
console.log(gameGrid)

// gameGrid[0] = ["0", "1", "2", "3", "4", "5", "6"]
// gameGrid[1] = ["7", "8", "9", "10", "11", "12", "13"]
// gameGrid[2] = ["14", "15", "16", "17", "18", "19", "20"]
// gameGrid[3] = ["21", "22", "23", "24", "25", "26", "27"]
// gameGrid[4] = ["28", "29", "30", "31", "32", "33", "34"]
// gameGrid[5] = ["35", "36", "37", "38", "39", "40", "41"]

/*----------------------------- Event Listeners -----------------------------*/
boardElement.addEventListener('click', handleClick)















/*
Steps to identify winner
 
assume with have index (i), then we have to check 
 
[r][c] = [r][c+1] = [r][c+2] = [r][c+3]   -----> Horizontal
[r][c] = [r+1][c] = [r+2][c] = [r+3][c]   -----> Vertical Down
[r][c] = [r+1][c+1] = [r+2][c+2] = [r+3][c+3]   -----> Diagonal Down Right
[r][c] = [r+1][c-1] = [r+2][c-2] = [r+3][c-3]   -----> Diagonal Down Left
 
    |O|O|O|O|O|O|O|
    |O|O|O|O|O|O|O|
    |O|O|O|O|O|O|O|
    |O|O|O|O|O|O|O|
    |O|O|O|O|O|O|O|
    |O|O|O|O|O|O|O| 
 
*/

let winningCombos = [];
let i = 0;
winningCombos = [];


let count = 0;
let remCol = numberOfColumns;
let remRow = numberOfRows;

/*
I want to count how many R's and and how many "B" in line of minimum 4 in every direction of the gameGrid
I also want to store the winning combinations arrays in winningCombos array.

speicify the winner R or B at the end.

I want the code to capture all matching combinations of 4 in a row, column or diagonal at that time.

use reduce function to count the number of R's and B's in the winningCombos array.

*/



// const numberOfColumns = 7;
// const numberOfRows = 6;

// let counter = 0;
// const checkWinner = () => {
//     let newR = 0;
//     let newC = 0;
//     let prevR = 0;
//     let prevC = 0;


//     // directions.forEach(dir => {

//     for (let r = 0; r < numberOfColumns; r++) {

//         newR = prevR + 1
//         newC = prevC + 1

//         // console.log(`(${newR}, ${newC})`)

//         prevR = newR
//         prevC = newC

//         // // newR = r;
//         // // newC = 0;
//         // for (let c = 0; c < numberOfColumns; c++) {

//         //     // gameGrid[newR][newC] = counter

//         //     console.log(`(${r}, ${c}) - (${newR}, ${newC})`)

//         //     newR = r + dir[0]
//         //     newC = c + dir[1]
//         // counter++

//         // console.log(`(${newR}, ${newC})`)
//         // console.log(gameGrid[newR][newC]);
//         //     if (gameGrid[r][c] === "R") {
//         //         newR = r + dir[0]
//         //         newC = c + dir[1]
//         //         while (gameGrid[newR][newC] === "R") {
//         //             newR = r + dir[0]
//         //             newC = c + dir[1]
//         //             counter++
//         //             console.log(gameGrid[newR][newC]);
//         //         }
//         //     }
//         // });
//     }

// }
// //     }
// // });

// // }
// // directions.forEach(dir => {

// //     while (newR < numberOfRows - 1 && newC < numberOfColumns - 1) {

// //         if (gameGrid[newR][newC] == "R") {

// //             counter++
// //         }else {
// //             break;
// //         }
// //         newR = r + dir[0]
// //         newC = c + dir[1]
// //     }

// });



// checkWinner()
// console.log(gameGrid);
