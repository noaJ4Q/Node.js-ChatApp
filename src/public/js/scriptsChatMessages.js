import { socket } from '/js/scriptsCommon.js';

const chatMessagesWrapper = document.getElementById('messages');
const chatInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const receiver = document.getElementById('receiver');

sendButton.onclick = () => {
  const message = chatInput.value;
  const receiverSessionID = receiver.value;
  socket.emit('message', { message, receiverSessionID });
  chatInput.value = '';
}

socket.on('message', (message) => {
  renderMessage(message);
})

function renderMessage(message) {
  console.log(message);
}