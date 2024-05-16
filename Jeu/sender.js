document.addEventListener("DOMContentLoaded", function() {
console.log("Version 1.0");



let currentSession;
let currentMediaSession;
let isPlaying = false;
const applicationID = 'B46033B3';


document.getElementById('connectButton').addEventListener('click', () => {
    console.time('Bouton Connection : ');
    initializeApiOnly();
    console.timeEnd('Bouton Connection : ');

});

document.getElementById('playBtn').addEventListener('click', () => {
    if (currentSession) {
        // Load the receiver page on the Chromecast device
        loadMedia("https://transfertco.ca/SnakeGame/Jeu/receiver.html");
    } else {
        alert('Connectez-vous sur Chromecast en premier');
    }
});



// document.getElementById('connectButton').addEventListener('click', () => {
//     if (currentMediaSession) {
//         if (isPlaying) {
//             currentMediaSession.pause(null, onMediaCommandSuccess, onError);
//         } else {
//             currentMediaSession.play(null, onMediaCommandSuccess, onError);
//         }
//         isPlaying = !isPlaying;
//     }
// });














function onInitSuccess() {
    console.log('Chromecast init success');
}

function onError(error) {
    console.error('Chromecast initialization error', error);
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
// function receiverListener(availability) {
//     if (availability === cast.framework.CastState.AVAILABLE) {
//         console.log('Chromecast disponible');
//     } else {
//         console.log('Chromecast indisponible');
//     }
// }
function receiverListener(availability) {
    if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
        document.getElementById('connectButton').style.display = 'block';
    } else {
        document.getElementById('connectButton').style.display = 'none';
    }
}

// function loadMedia(gameUrl) {
//     const mediaInfo = new chrome.cast.media.MediaInfo(gameUrl);
//     const request = new chrome.cast.media.LoadRequest(mediaInfo);
//     const remotePlayer = new cast.framework.RemotePlayer();
//     const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);

//     currentSession.loadMedia(request, mediaSession => {
//         console.log('Jeu chargé avec succès');
//     }, onError);}
function loadMedia(receiverUrl) {
    const mediaInfo = new chrome.cast.media.MediaInfo(receiverUrl);
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    
    currentSession.loadMedia(request, mediaSession => {
        console.log('Receiver page loaded successfully');
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
});

