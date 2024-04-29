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
const defaultContentType = 'video/mp4';
const videoList = [
    'https://transfertco.ca/video/DBillPrelude.mp4',
    'https://transfertco.ca/video/DBillSpotted.mp4',
    'https://transfertco.ca/video/usa23_7_02.mp4'
    // Add more video URLs as needed
];

document.getElementById('connectButton').addEventListener('click', () => {
    initializeApiOnly();
});

document.getElementById('startBtn').addEventListener('click', () => {
    if (currentSession) {
        loadMedia(videoList[currentVideoIndex]);
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

function loadMedia(videoUrl) {
    currentVideoUrl = videoUrl;
    const mediaInfo = new chrome.cast.media.MediaInfo(videoUrl, defaultContentType);
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    const remotePlayer = new cast.framework.RemotePlayer();
    const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);

    currentSession.loadMedia(request, mediaSession => {
        console.log('Media chargé avec succès');
        initializeSeekSlider(remotePlayerController, mediaSession);
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



