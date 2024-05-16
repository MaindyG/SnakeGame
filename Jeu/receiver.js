window.addEventListener("load", (event) => {
    console.log("Snake v3.0");
    const context = cast.framework.CastReceiverContext.getInstance();
    const CHANNEL = 'urn:x-cast:snakeGame';
    const applicationID = 'B46033B3'
    context.addCustomMessageListener(CHANNEL, handleMessageFromSender);
    const options = new cast.framework.CastReceiverOptions();
    context.start(options);
});

let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let gameOver = false;
let foodX, foodY;
let snakeBody = [];
let score = 0;
let setIntervalId;

function handleMessageFromSender(event) {
    const direction = event.data.direction;
    handleControllerInput(direction);
}

function handleControllerInput(direction) {
    if (direction === "up") {
        velocityX = 0;
        velocityY = -1;
    } else if (direction === "down") {
        velocityX = 0;
        velocityY = 1;
    } else if (direction === "left") {
        velocityX = -1;
        velocityY = 0;
    } else if (direction === "right") {
        velocityX = 1;
        velocityY = 0;
    }
}

function updateFoodPosition() {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

function handleGameOver() {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

function initGame() {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${score}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

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

updateFoodPosition();
setIntervalId = setInterval(initGame, 120);
