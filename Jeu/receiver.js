window.addEventListener("load", (event) => {
    console.log("Snake v2.0");
  });
const context = cast.framework.CastReceiverContext.getInstance();
const CHANNEL = 'urn:x-cast:snakeGame';
context.addCustomMessageListener(CHANNEL, handleMessageFromSender);

function handleMessageFromSender(message) {
    console.log('Message reçu du sender:', message);
    if (message && message.msg) {
        const { x, y } = message.msg;
        updateSnakePosition(x, y);
    }
}
function updateSnakePosition(newX, newY) {
    snakeX = newX;
    snakeY = newY;
    initGame();
}


const options = new cast.framework.CastReceiverOptions();
context.start(options);



const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;

highScoreElement.innerText = `High Score: ${highScore}`;

function handleControllerInput (direction){
    
    if (direction === "up" ) {
        velocityX = 0;
        velocityY = -1;
    } else if (direction === "down" ) {
        velocityX = 0;
        velocityY = 1;
    } else if (direction === "left" ) {
        velocityX = -1;
        velocityY = 0;
    } else if (direction === "right" ) {
        velocityX = 1;
        velocityY = 0;
    }
};




function handleGameOver(){
    
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
};


function updateFoodPosition(){
    
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};


const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Checking if the snake hit the food
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Pushing food position to snake body array
        score++; // increment score by 1
        /*highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);*/
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("high-score", highScore);
        }
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
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
};


controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

function receiveControllerInput(direction){
    handleControllerInput(direction);
    const positionObj = { x: snakeX, y: snakeY }; 
    let message = {msg: positionObj}; message = JSON.stringify(message);
    const namespace = 'snakeGame'; 
    sendMessage(namespace, message); 
};

const controllerButtons = document.querySelectorAll(".controller-button");
controllerButtons.forEach(button => {
    button.addEventListener("click", () => {
        const direction = button.dataset.direction; 
        receiveControllerInput(direction);
    });
});

updateFoodPosition();
setIntervalId = setInterval(initGame, 120);