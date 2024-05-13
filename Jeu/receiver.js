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