# 🚀 Connect 4 Game (Space Theme)

![Connect 4 Game Header Image](./assets/images/header.png)

A playful and interactive web-based Connect 4 game with a space-themed twist, featuring animated astronaut and alien tokens, sound effects, dynamic gameplay modes, and multiple difficulty levels. Built using vanilla JavaScript, HTML, and CSS for a fully responsive and engaging user experience.

## 🧑‍💻 Features
- 🧑‍🚀 Player vs Player and Player vs Computer modes
- 👽 AI Difficulty Modes: Easy and unlockable Normal
- 🪐 Multiple board sizes: 4×5, 5×6, 6×7, and 7×8
- 🪐 Custom token design: Astronaut (Green) and Alien (Red)
- 🔊 Game sounds for click, drop, start, and win events
- 💾 Win count is saved using LocalStorage
- 📱 Responsive and interactive UI with falling token animation
- 🧠 Intelligent computer opponent in normal mode

## 🕹️ Gameplay Instructions
1. Launch the game in your browser.
2. Click START GAME to begin.
3. Choose game mode (Player vs Player / Player vs Computer).
4. If Player vs Computer, select Easy or Normal (unlocks after a win).
5. Choose your board size and token (Alien or Astronaut).
6. Take turns dropping tokens into the grid.
7. First to connect four tokens horizontally, vertically, or diagonally wins!
8. The game announces wins, tracks score, and allows reset or clear.

## 📁 Folder Structure
```plaintext
.
├── index.html
├── css/
│ └── style.css
├── js/
│ └── app.js
├── assets/
│ ├── images/
│ │ ├── alien.png
│ │ └── astro.png
│ └── sounds/
│ ├── click.mp3
│ ├── start.mp3
│ ├── token.mp3
│ ├── loose.mp3
| ├── tie.mp3
| ├── back.mp3
│ └── win.mp3
└── README.md
```

## 🧠 Technical Highlights
- **DOM construction:** Board and cells are generated based on selected board size.
- **Token drop animation:** Tokens visually fall from the top cell to their final spot.
- **Winner detection:** Checks for 4 in raw combination of tokens in all directions.
- **AI behavior:**
    - **Easy:** Random column selection.
    - **Normal:** Tries to win or block opponent if none then random columns selection.

## ⚙️ Code Functions
#### 🎨 UI Functions
- 🖥️ showScreen: Displays a screen with a message, buttons, icons, and optional timer for auto-hide.
- 🔀 screenSelector: Manages transitions between setup screens based on user input.
- 🧭 screensCallBack: Responds to user interactions and moves forward/backward through the screen flow.

#### 🏗️ Constructor Functions
- 📐 constructGrid: Creates a 2D array to represent the empty game board.
- 🧱 constructDOMElements: Dynamically builds the HTML elements for the game grid.

#### 🛠️ Utility Functions
- 📊 getAvailableColumns: Returns a list of columns that still have space for a token.
- ✅ validCell: Checks whether a given cell is within valid bounds.
- 🎞️ animateTokensFalling: Animates the visual drop of a token into place.
- 🔊 playSound: Plays sound effects for actions like click, start, drop, or win.
- 💾 readStorage: Loads win count from localStorage if available.
- 📝 updateWinText: Updates the UI text with the current number of wins.
- 📈 updateStorage: Increases win count and stores it locally.
- 🧹 clearWins: Resets the win count to zero and updates the UI.

#### 🤖 Computer Moves Functions
- 🧠 dropTokenComputerNormalMode: Attempts to win or block strategically, or plays randomly as fallback.
- 🎲 dropTokenComputerEasyMode: Selects a move entirely at random.
- ⚙️ executeMove: Runs the logic to place a token, check outcome, and refresh the board.
- 🔍 simulate: Tests if a simulated move could result in a win.

#### 🎮 Game Flow Functions
- 🖼️ render: Displays outcome messages (Win/Lose/Tie) and updates score if needed.
- ⬇️ dropToken: Finds the lowest available slot in a column to place the token.
- 🤝 checkTie: Determines if the game ended in a tie by checking board fullness.
- 🎨 updateBoard: Applies the token colors/images to the board.
- 🏆 checkForWinner: Detects any winning combination of four aligned tokens.
- 🔄 switchTokens: Switches to the next player's token.
- 👆 handleClick: Processes a player’s click to initiate a move or AI response.
- 🚀 init: Initializes the game board and resets state for a new game.

## 📷 Screenshots
![Screenshot 1](./assets/images/screenshots/screenshot1.png)
![Screenshot 2](./assets/images/screenshots/screenshot2.png)
![Screenshot 3](./assets/images/screenshots/screenshot3.png)
![Screenshot 4](./assets/images/screenshots/screenshot4.png)

## 🎮 Demo
Game Demo can be access by visiting this [link](https://mjassim2030.github.io/Connect-4/)

## 📌 Development Roadmap
- Add animated background transitions
- Responsive Design for Small screens
- Online Multiplayer 
- Enhanced sound and music settings
- Scoreboard and timer modes

## 🪐 Credits
- Icons & illustrations: AI Generated
- Sound effects: Free licensedself-made
Developed by: Mohamed AlMehaiza

## 📚 References

#### MDN Web Docs
- [setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [HTMLAudioElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
- [Element.getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)

#### W3Schools
- [CSS Flexbox](https://www.w3schools.com/css/css3_flexbox.asp)
- [HTML Audio](https://www.w3schools.com/tags/tag_audio.asp)
- [JavaScript Timing Events](https://www.w3schools.com/js/js_timing.asp)