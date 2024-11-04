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

    const logGameBoard = () => {
        let log = "";
        gameBoard.forEach((box, i) => {
            log += box ? box : "#";
            if (((i + 1) % 3) === 0) log +="\n";
        })
        console.log(log);
    }

    return {
        getGameBoard,
        cleanGameBoard,
        processNewMove,
        logGameBoard,
    }
})();

const game = (function() {
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

    let playerTurn = true;
    const newTurn = (event) => {
        const numCell = event.currentTarget.id.slice(1);
        if (playerTurn) player1.playTurn(numCell);
        else player2.playTurn(numCell);

        if (gameOver()) {
            gameBoardGame.cleanGameBoard();
            domManipulator.removeGameBoard();
            alert(`${playerTurn ? "player1" : "player2"} won`);
        }

        playerTurn = !playerTurn;
    }

    return {
        newTurn,
    }
})();

function createPlayer() {
    const name = prompt("select name")
    const playerSymbol = prompt("select one character")[0];

    const playTurn = (numCell) => {
        gameBoardGame.processNewMove(numCell, playerSymbol);
        domManipulator.drawSymbol(numCell, playerSymbol);
    }

    return {
        name,
        playTurn,
    }
}

const domManipulator = (function() {
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
                cell.addEventListener("click", game.newTurn);
                table.appendChild(cell);
                index++;
            }
        }

        container.appendChild(table);
    }

    const drawSymbol = (cellNum, symbol) => {
        const coord = ((cellNum < 3 ? "a" :
                      cellNum < 6 ? "b" :
                      "c")
                      + cellNum);
        document.querySelector(`#${coord}`).textContent = symbol;
    }

    const removeGameBoard = () => {
        document.querySelector(".table").remove();
    }

    return {
        createGameBoard,
        drawSymbol,
        removeGameBoard,
    }
})()

const player1 = createPlayer();
const player2 = createPlayer();
domManipulator.createGameBoard();
