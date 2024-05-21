console.log("Snake v20.0");
const context = cast.framework.CastReceiverContext.getInstance();
const CHANNEL = 'urn:x-cast:snakeGame';
const applicationID = 'B46033B3';
context.addCustomMessageListener(CHANNEL, handleMessageFromSender);
const options = new cast.framework.CastReceiverOptions();
context.start(options);

let snakeX = 5, snakeY = 5;
let vitesseX = 0, vitesseY = 0;
let gameOver = false;
let foodX, foodY;
let snakeBody = [];
let score = 0;
let setIntervalId;
let gameStarted = false;

function handleMessageFromSender(event) {
    const data = event.data;
    if (data.command === 'start') {
        startGame();
    } else if (data.direction) {
        handleControllerInput(data.direction);
    }
}

function handleControllerInput(direction) {
    if (!gameStarted) return;
    if (direction === "up") {
        vitesseX = 0;
        vitesseY = -1;
    } else if (direction === "down") {
        vitesseX = 0;
        vitesseY = 1;
    } else if (direction === "left") {
        vitesseX = -1;
        vitesseY = 0;
    } else if (direction === "right") {
        vitesseX = 1;
        vitesseY = 0;
    }
}

function updateFoodPosition() {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

function handleGameOver() {
    clearInterval(setIntervalId);
    alert("Game Over! Votre score est de " + score + " !");
    location.reload();
}

const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");

function startGame() {
    document.querySelector(".wrapper").style.display = 'flex';
    scoreElement.style.display = 'block';
    document.getElementById("accueil").style.display = 'none';
    gameStarted = true;
    updateFoodPosition();
    setIntervalId = setInterval(initGame, 120);
}

function initGame() {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        scoreElement.innerText = `Score: ${score}`;
    }

    snakeX += vitesseX;
    snakeY += vitesseY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}
