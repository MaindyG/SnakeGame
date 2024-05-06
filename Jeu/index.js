

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

function handleControllerInput (direction){
    
    if (direction === "up" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (direction === "down" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (direction === "left" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (direction === "right" && velocityX != -1) {
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


function initGame(){
    var game = document.getElementById("gameplay");
    if (game.style.display === "none") {
        return;
         
    }
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); 
        score++; 
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
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
