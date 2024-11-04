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
    let playerTurn = true; // Alternate turns
    let ticTaToe; // It serves to know what line finished the game

    const checkEquality = (a, b, c) => {
        if (a === b && b === c && a !== "") return true;
        else { ticTaToe++; return false };
    }

    const gameOver = () => {
        ticTaToe = 0;
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
        const numCell = event.currentTarget.id.slice(1); // Cell clicked
        if (playerTurn) player1.playTurn(numCell);
        else player2.playTurn(numCell);

        if (gameOver()) {
            domManipulator.paintLine(ticTaToe); // Paint the line that finished the game
            document.querySelector(".table").style.pointerEvents = "none"; // Block clicks to gameBoard

            // Print result
            winnerOutput.textContent = `${playerTurn ? player1.name : player2.name} won`;
            startGameBtn.textContent = "New Game";

            // Animation
            resultContainer.style.display = "flex";
            setTimeout(() => {
                resultContainer.style.transform = "scale(1)";
            }, 10)
        }

        playerTurn = !playerTurn; // To exchange turns
    }

    const startGame = () => {
        // Set up players
        do {
            player1 = createPlayer();
            player2 = createPlayer();
        } while (player1.playerSymbol === player2.playerSymbol);
        playerTurn = true;

        // Set up GameBoard
        domManipulator.cleanGameBoard();
        gameBoardGame.cleanGameBoard();
        document.querySelector(".table").style.pointerEvents = "";

        // Animation
        resultContainer.style.transform = "scale(0)";
        setTimeout(() => {
            resultContainer.style.display = "none";
        }, 200);
    }

    return {
        newTurn,
        startGame,
    }
})();

// DOM

const domManipulator = (function() {
    const cleanGameBoard = () => {
        [...document.querySelectorAll(".table > div")].forEach(cell => {
            cell.textContent = "";
            cell.style.background = "white";
        });
    }

    const getCoord = (index) => {
        const coord = ((index < 3 ? "a" :
                       index < 6 ? "b" :
                       "c")
                       + index);
        return coord
    }

    const paintLine = (drawLine) => {
        possibleResults[drawLine].split(" ").forEach(coord => {
            console.log(coord);
           document.querySelector(`#${coord}`).style.background = "rgb(255, 120, 120)"; 
        });
    }

    const createGameBoard = () => {
        const container = document.querySelector(".container");
        const table = document.createElement("div");
        table.classList.add("table");
        let index = 0;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const coord = getCoord(index);
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
        const coord = getCoord(cellNum);
        const cell = document.querySelector(`#${coord}`);
        cell.textContent = symbol;
        cell.style.color = color;
    }

    return {
        createGameBoard,
        drawSymbol,
        cleanGameBoard,
        paintLine,
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

// Draw line

const possibleResults = {
    0: "a0 a1 a2",
    1: "b3 b4 b5",
    2: "c6 c7 c8",
    3: "a0 b3 c6",
    4: "a1 b4 c7",
    5: "a2 b5 c8",
    6: "a0 b4 c8",
    7: "a2 b4 c6",
}

// Make GameBoard

domManipulator.createGameBoard();
