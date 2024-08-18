import { socket } from '/js/scriptsCommon.js';

const chatInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const receiver = document.getElementById('receiver-data');

const messagesWrapper = document.getElementById('chat-messages');

sendButton.onclick = () => {
  const message = chatInput.value;
  renderSenderMessage(message);
  const receiverSessionID = receiver.value;
  socket.emit('message', { message, receiverSessionID });
  chatInput.value = '';
}

socket.on('message', (message) => {
  renderReceiverMessage(message);
})

function renderSenderMessage(message) {
  const chatContent = document.createElement('p');
  chatContent.className = 'message';
  chatContent.textContent = message;

  const chatMessage = document.createElement('div');
  chatMessage.className = 'sender';
  chatMessage.appendChild(chatContent);

  messagesWrapper.appendChild(chatMessage);
}

function renderReceiverMessage(message) {
  const chatContent = document.createElement('p');
  chatContent.className = 'message';
  chatContent.textContent = message;

  const chatMessage = document.createElement('div');
  chatMessage.className = 'receiver';
  chatMessage.appendChild(chatContent);

  messagesWrapper.appendChild(chatMessage);
}