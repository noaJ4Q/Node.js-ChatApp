import { socket } from '/js/scriptsCommon.js';

const chatInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const receiver = document.getElementById('receiver-data');

const senderMessagesWrapper = document.getElementById('sender');
const receiverMessagesWrapper = document.querySelector('#receiver .messages');

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
  const chatContent = document.createElement('span');
  chatContent.textContent = message;

  const chatMessage = document.createElement('p');
  chatMessage.className = 'message';
  chatMessage.appendChild(chatContent);

  senderMessagesWrapper.appendChild(chatMessage);
}

function renderReceiverMessage(message) {
  const chatContent = document.createElement('span');
  chatContent.textContent = message;

  const chatMessage = document.createElement('p');
  chatMessage.className = 'message';
  chatMessage.appendChild(chatContent);

  receiverMessagesWrapper.appendChild(chatMessage);
}