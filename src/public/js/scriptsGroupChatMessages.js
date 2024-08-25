import { socket } from '/js/scriptsCommon.js';

const chatInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const receiver = document.getElementById('receiver-data');

const messagesWrapper = document.getElementById('chat-messages');

socket.emit('joinGroupChat', receiver.value);

socket.on('groupMessage', (message) => {
  renderReceiverGroupMessage(message);
})

sendButton.onclick = () => {
  sendGroupMessage();
}

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendGroupMessage();
  }
})

function sendGroupMessage() {
  const message = chatInput.value;
  renderSenderGroupMessage(message);
  const groupReceiverID = receiver.value;
  socket.emit('groupMessage', { message, groupReceiverID });
  chatInput.value = '';
}

function renderSenderGroupMessage(message) {
  const chatContent = document.createElement('p');
  chatContent.className = 'message';
  chatContent.textContent = message;

  const chatMessage = document.createElement('div');
  chatMessage.className = 'sender';
  chatMessage.appendChild(chatContent);

  messagesWrapper.appendChild(chatMessage);
}

function renderReceiverGroupMessage(message) {
  console.log(message);
  const chatContent = document.createElement('p');
  chatContent.className = 'message';
  chatContent.textContent = message;

  const chatMessage = document.createElement('div');
  chatMessage.className = 'receiver';
  chatMessage.appendChild(chatContent);

  messagesWrapper.appendChild(chatMessage);
}