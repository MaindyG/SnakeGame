

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








let currentSession;
let currentMediaSession;
let isPlaying = true;
let currentVideoIndex = 0;
let currentVideoUrl;
let updateInterval;
const seekSlider = document.getElementById('seekSlider');
const currentTimeElement = document.getElementById('currentTime');
const muteToggle = document.getElementById('muteButton');
const totalTimeElement = document.getElementById('totalTime');


document.getElementById('connectButton').addEventListener('click', () => {
    initializeApiOnly();
});

document.getElementById('playBtn').addEventListener('click', () => {
    if (currentSession) {
        loadMedia('SnakeGame/Jeu/jeu.html'); 
    } else {
        alert('Connectez-vous sur chromecast en premier');
    }
});


function Play() {
    var playBtn = document.getElementById('playBtn'); 
    playBtn.classList.add("clicked");
    setTimeout(function () {
        playBtn.classList.remove("clicked");
    }, 100);
    
    if (currentMediaSession) {
        if (isPlaying) {
            currentMediaSession.pause(null, onMediaCommandSuccess, onError);
        } else {
            currentMediaSession.play(null, onMediaCommandSuccess, onError);
        }
        isPlaying = !isPlaying;
    }
};


document.getElementById('muteButton').addEventListener('click', () => {
    initializeMuted();
});


document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentSession) {
        if (currentVideoIndex < videoList.length - 1) {
            currentVideoIndex++;
            loadMedia(videoList[currentVideoIndex]);
            
        }
        
    } else {
        alert('Connectez-vous sur chromecast en premier');
    }
});


document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentSession) {
        currentVideoIndex = (currentVideoIndex - 1) % videoList.length;
        loadMedia(videoList[currentVideoIndex]);
    } else {
        alert('Connectez-vous sur chromecast en premier');
    }
});

function addButtonClickedEffect(buttonId) { const button = document.getElementById(buttonId); button.classList.add('clicked'); setTimeout(() => { button.classList.remove('clicked'); }, 100); }



function sessionListener(newSession) {
    currentSession = newSession;
    document.getElementById('playBtn').style.display = 'block';
    document.getElementById('nextBtn').style.display = 'block';
}



function initializeSeekSlider(remotePlayerController, mediaSession) {
    currentMediaSession = mediaSession;
    document.getElementById('playBtn').style.display = 'block';
    seekSlider.max = mediaSession.media.duration;

    updateInterval = setInterval(() => {
        const currentTime = mediaSession.getEstimatedTime();
        const totalTime = mediaSession.media.duration;

        seekSlider.value = currentTime;
        currentTimeElement.textContent = formatTime(currentTime);
        totalTimeElement.textContent = formatTime(totalTime);
    }, 1000); 

    seekSlider.addEventListener('input', () => {
        const seekTime = parseFloat(seekSlider.value);
        remotePlayerController.seek(seekTime);
    });
}

function receiverListener(availability) {
    if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
        document.getElementById('connectButton').style.display = 'block';
    } else {
        document.getElementById('connectButton').style.display = 'none';
    }
}

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

function loadMedia(htmlContent) {
    const mediaInfo = new chrome.cast.media.HtmlMediaInfo();
    mediaInfo.contentUrl = htmlContent; // Provide the URL of the HTML content
    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
    mediaInfo.metadata.title = 'Snake Game'; // Set a title for the media

    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    const remotePlayer = new cast.framework.RemotePlayer();
    const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);

    currentSession.loadMedia(request, mediaSession => {
        console.log('Media loaded successfully');
    }, onError);
}



function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function Login() {
    document.getElementById('connectButton').addEventListener('click', () => {
        initializeApiOnly();
    });
}


function initializeMuted() {
    var muteButton = document.getElementById("muteButton");

    muteButton.classList.add("clicked");

    setTimeout(function () {
        muteButton.classList.remove("clicked");
    }, 100);

    muteToggle.addEventListener('click', () => {
        if (currentMediaSession.volume.muted) {

            const volume = new chrome.cast.Volume(lastVolumeLevel, false);
            const volumeRequest = new chrome.cast.media.VolumeRequest(volume);
            currentMediaSession.setVolume(volumeRequest, onMediaCommandSuccess, onError);
        } else {


            lastVolumeLevel = currentMediaSession.volume.level;

            const volume = new chrome.cast.Volume(0, true);
            const volumeRequest = new chrome.cast.media.VolumeRequest(volume);
            currentMediaSession.setVolume(volumeRequest, onMediaCommandSuccess, onError);
        }
    });
}





function VolumeUp() {
    var volumeUpBtn = document.getElementById("volumeUpBtn");

    volumeUpBtn.classList.add("clicked");

    setTimeout(function () {
        volumeUpBtn.classList.remove("clicked");
    }, 100);

    if (currentMediaSession) {
        const currentVolume = currentMediaSession.volume.level;
        const newVolume = Math.min(currentVolume + 0.1, 1.0);
        setVolume(newVolume);
    }
}

function VolumeDown() {
    var volumeDownBtn = document.getElementById("volumeDownBtn");

    volumeDownBtn.classList.add("clicked");

    setTimeout(function () {
        volumeDownBtn.classList.remove("clicked");
    }, 100);

    if (currentMediaSession) {
        const currentVolume = currentMediaSession.volume.level;
        const newVolume = Math.max(currentVolume - 0.1, 0.0);
 
        setVolume(newVolume);
    }
}

function setVolume(volumeLevel) {
    if (currentMediaSession) {
        const volume = new chrome.cast.Volume(volumeLevel);
        const volumeRequest = new chrome.cast.media.VolumeRequest(volume);
        currentMediaSession.setVolume(volumeRequest, onMediaCommandSuccess, onError);
    }
}



