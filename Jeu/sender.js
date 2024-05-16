document.addEventListener("DOMContentLoaded", function () {
    console.log("Version 3.0");

    let currentSession;
    const CHANNEL = 'urn:x-cast:snakeGame'; 
    const applicationID = 'B46033B3';

    document.getElementById('connectButton').addEventListener('click', () => {
        initializeApiOnly();
    });

    document.getElementById('playBtn').addEventListener('click', () => {
        if (currentSession) {
            loadMedia("https://transfertco.ca/SnakeGame/Jeu/receiver.html");
        } else {
            alert('Connectez-vous sur Chromecast en premier');
        }
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

    function loadMedia(gameUrl) {
        const mediaInfo = new chrome.cast.media.MediaInfo(gameUrl);
        const request = new chrome.cast.media.LoadRequest(mediaInfo);
        currentSession.loadMedia(request, () => {
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

    document.querySelectorAll('.controller-button').forEach(button => {
        button.addEventListener('click', () => {
            const direction = button.dataset.direction;
            sendControllerInput(direction);
        });
    });

    function sendControllerInput(direction) {
        let message = { direction: direction };
        let jsonMessage = JSON.stringify(message); 
        sendMessage(CHANNEL, jsonMessage); 
    }

});
