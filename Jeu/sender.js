

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


let currentSession;

const applicationID = 'B46033B3';


document.getElementById('connectButton').addEventListener('click', () => {
    initializeApiOnly();
});

document.getElementById('connectButton').addEventListener('click', () => {
    if (currentSession) {
        loadMedia("https://transfertco.ca/SnakeGame/Jeu/receiver.html");
    } else {
        alert('Connectez-vous sur chromecast en premier');
    }
});


document.getElementById('pauseStart_button').addEventListener('click', () => {
    if (currentMediaSession) {
        if (isPlaying) {
            currentMediaSession.pause(null, onMediaCommandSuccess, onError);
        } else {
            currentMediaSession.play(null, onMediaCommandSuccess, onError);
        }
        isPlaying = !isPlaying;
    }
});














function onInitSuccess() {
    console.log('Chromecast init success');
}

function onError(error) {
    console.error('Chromecast initialization error', error);
}

function onMediaCommandSuccess() {
    console.log('Media command success');
}

function initializeApiOnly() {
    
    const sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);

    chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

function sessionListener(newSession) {
    currentSession = newSession;
    console.log('Chromecast session connected');
}
function receiverListener(availability) {
    if (availability === cast.framework.CastState.AVAILABLE) {
        console.log('Chromecast disponible');
    } else {
        console.log('Chromecast indisponible');
    }
}

function loadMedia(gameUrl) {
    currentVideoUrl = gameUrl;
    const mediaInfo = new chrome.cast.media.MediaInfo(gameUrl);
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    const remotePlayer = new cast.framework.RemotePlayer();
    const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);

    currentSession.loadMedia(request, mediaSession => {
        console.log('Jeu chargé avec succès');
      }, onError);
}
function sendMessage(namespace, message) {
    if (currentSession) {
        currentSession.sendMessage(namespace, message, () => {
            console.log("Message envoyé avec succès :", message);
        }, (error) => {
            console.error("Erreur lors de l'envoi du message :", error);
        });
    } else {
        console.error("Session Chromecast non trouvée.");
    }
}

function receiveMessage(message) {
    console.log("Message reçu de l'application Chromecast :", message);
}

function receiveControllerInput(direction) {
    handleControllerInput(direction); 
    const positionObj = { x: snakeX, y: snakeY }; 
    const message = JSON.stringify({ msg: positionObj }); 
    const namespace = 'votre_namespace'; 
    sendMessage(namespace, message); 
}


