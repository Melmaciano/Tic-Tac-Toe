const gameBoardGame = (function() {
    let gameBoard = ["", "", "", "", "", "", "", "", ""];

    const getGameBoard = () => {
        return gameBoard;
    }

    const cleanGameBoard = () => {
        gameBoard = ["", "", "", "", "", "", "", "", ""];
    }

    const placeNewSymbol = (coord, symbol) => {
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
        placeNewSymbol,
        logGameBoard,
    }
})();

const game = (function() {
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

    const turn = () => {
        if (playerTurn) player1.nextMove()
        else player2.nextMove();

        gameBoardGame.logGameBoard();

        if (gameOver()) {
            gameBoardGame.cleanGameBoard();
            alert(`${playerTurn ? "player1 won" : "player2 won"}`);
            return false;
        }

        playerTurn = !playerTurn;
        return true;
    }

    return {
        turn,
    }
})();

function createPlayer() {
    const name = prompt("select name")
    const playerSymbol = prompt("select one character")[0];
    let newCoord;

    const nextMove = () => {
        do {
            newCoord = prompt("choice where put the mark (a number between 0 and 8)")
        } while (gameBoardGame.getGameBoard()[newCoord]);
        
        gameBoardGame.placeNewSymbol(newCoord, playerSymbol);
    }

    return {
        name,
        nextMove,
    }
}

const player1 = createPlayer();
const player2 = createPlayer();
let result;
do {
    result = game.turn();
} while (result);
