document.addEventListener("DOMContentLoaded", function () {
    console.log("Version 10.0");

    let currentSession;
    const CHANNEL = 'urn:x-cast:snakeGame';
    const applicationID = '925F4741';

    document.getElementById('connectButton').addEventListener('click', () => {
        initializeApiOnly();
    });

    function onInitSuccess() {
        console.log('Chromecast init success');
    }

    function onError(error) {
        console.error('Chromecast initialization error', error);
    }

    function initializeApiOnly() {
        const sessionRequest = new chrome.cast.SessionRequest(applicationID);
        const apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
        chrome.cast.initialize(apiConfig, onInitSuccess, onError);
    }

    function sessionListener(newSession) {
        currentSession = newSession;
        console.log('Chromecast session connected');
    }

    function receiverListener(availability) {
        if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
            document.getElementById('connectButton').style.display = 'block';
        } else {
            document.getElementById('connectButton').style.display = 'block';
        }
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

    document.querySelectorAll('.controller-button').forEach(button => {
        button.addEventListener('click', () => {
            const direction = button.dataset.direction;
            sendControllerInput(direction);
        });
    });

    document.getElementById('playBtn').addEventListener('click', () => {
        sendMessage(CHANNEL, { command: 'start' });
    });

    function sendControllerInput(direction) {
        let message = { direction: direction };
        sendMessage(CHANNEL, message);
    }
});


   // function loadMedia(gameUrl) {
    //     const mediaInfo = new chrome.cast.media.MediaInfo(gameUrl);
    //     const request = new chrome.cast.media.LoadRequest(mediaInfo);
    //     currentSession.loadMedia(request, () => {
    //         console.log('Receiver page loaded successfully');
    //     }, onError);
    // }
   
    // document.getElementById('playBtn').addEventListener('click', () => {
    //     if (currentSession) {
    //         loadMedia("https://transfertco.ca/SnakeGame/Jeu/receiver.html");
    //         gameStarted = true; 
    //         sendControllerInput('right');

    //     } else {
    //         alert('Connectez-vous sur Chromecast en premier');
    //     }
    // });