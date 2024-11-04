const startGameBtn = document.querySelector(".start-btn");
const winnerOutput = document.querySelector(".winner");
const resultContainer = document.querySelector(".result");

// Data 

const gameBoardGame = (function() {
    let gameBoard = ["", "", "", "", "", "", "", "", ""];

    const getGameBoard = () => {
        return gameBoard;
    }

    const cleanGameBoard = () => {
        gameBoard = ["", "", "", "", "", "", "", "", ""];
    }

    const processNewMove = (coord, symbol) => {
        gameBoard[coord] = symbol;
    }

    return {
        getGameBoard,
        cleanGameBoard,
        processNewMove,
    }
})();

// Game function

const game = (function() {
    let player1;
    let player2;
    let playerTurn = true;

    const checkEquality = (a, b, c) => {
        return a === b && b === c && a !== "";
    }

    const gameOver = () => {
        let [a1, a2, a3, b1, b2, b3, c1, c2, c3] = gameBoardGame.getGameBoard();
        return (checkEquality(a1, a2, a3) || 
                checkEquality(b1, b2, b3) ||
                checkEquality(c1, c2, c3) ||
                checkEquality(a1, b1, c1) ||
                checkEquality(a2, b2, c2) ||
                checkEquality(a3, b3, c3) ||
                checkEquality(a1, b2, c3) ||
                checkEquality(a3, b2, c1));
    }

    const newTurn = (event) => {
        const numCell = event.currentTarget.id.slice(1);
        if (playerTurn) player1.playTurn(numCell);
        else player2.playTurn(numCell);

        if (gameOver()) {
            winnerOutput.textContent = `${playerTurn ? player1.name : player2.name} won`;
            startGameBtn.textContent = "New Game";
            resultContainer.style.display = "flex";
            setTimeout(() => {
                resultContainer.style.transform = "scale(1)";
            }, 10)
            document.querySelector(".table").style.pointerEvents = "none";
        }

        playerTurn = !playerTurn; // To exchange turns
    }

    const startGame = () => {
        do {
            player1 = createPlayer("player1", "x");
            player2 = createPlayer("player2", "o");
        } while (player1.playerSymbol === player2.playerSymbol);
        playerTurn = true; // Player 1 starts
        // Animations
        resultContainer.style.transform = "scale(0)";
        setTimeout(() => {
            resultContainer.style.display = "none";
        }, 200);
        // Set up GameBoard
        domManipulator.emptyGameBoard();
        gameBoardGame.cleanGameBoard();
        document.querySelector(".table").style.pointerEvents = "";
    }

    return {
        newTurn,
        startGame,
    }
})();

// DOM

const domManipulator = (function() {
    const emptyGameBoard = () => {
        [...document.querySelectorAll(".table > div")].forEach(cell => cell.textContent = "");
    }

    const createGameBoard = () => {
        const container = document.querySelector(".container");
        const table = document.createElement("div");
        table.classList.add("table");
        let index = 0;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const coord = String.fromCharCode(i + 97) + index;
                const cell = document.createElement("div");
                cell.id = coord;
                cell.style.gridArea = coord;
                cell.classList.add("cell");
                cell.addEventListener("click", game.newTurn);
                table.appendChild(cell);
                index++;
            }
        }

        table.style.pointerEvents = "none";
        container.appendChild(table);
    }

    const drawSymbol = (cellNum, symbol, color) => {
        const coord = ((cellNum < 3 ? "a" :
                      cellNum < 6 ? "b" :
                      "c")
                      + cellNum);
        const cell = document.querySelector(`#${coord}`);
        cell.textContent = symbol;
        cell.style.color = color;
    }

    return {
        createGameBoard,
        drawSymbol,
        emptyGameBoard,
    }
})();

// Player creator

let playerChoice = false; // To style symbols

function createPlayer(name, playerSymbol) {
    let playerSymbolColor = playerChoice ? "blue" : "red"
    playerChoice = !playerChoice;

    if (!name || !playerSymbol) {
        do {
            name = prompt("Name:");
            playerSymbol = prompt("Symbol (digit one digit)");
        } while (name === "" || name === null || playerSymbol === "" || playerSymbol === null);
    }

    playerSymbol = playerSymbol[0];

    const playTurn = (numCell) => {
        gameBoardGame.processNewMove(numCell, playerSymbol);
        domManipulator.drawSymbol(numCell, playerSymbol, playerSymbolColor);
    }

    return {
        name,
        playerSymbol,
        playTurn,
    }
}

// Start game

startGameBtn.addEventListener("click", game.startGame);

// Make GameBoard

domManipulator.createGameBoard();

