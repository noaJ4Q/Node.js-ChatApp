import { socket } from '/js/commonScripts.js';

const chatInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const receiver = document.getElementById('receiver-data');

const messagesWrapper = document.getElementById('chat-messages');

sendButton.onclick = () => {
  sendMessage();
}

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
})

socket.on('userMessage', (message) => {
  renderReceiverMessage(message);
})

function sendMessage() {
  const message = chatInput.value;
  renderSenderMessage(message);
  const receiverSessionID = receiver.value;
  socket.emit('userMessage', { message, receiverSessionID });
  chatInput.value = '';
}

function renderSenderMessage(message) {
  const chatContent = document.createElement('p');
  chatContent.className = 'message w-fit ml-auto mr-0 bg-indigo-600 rounded-lg px-3 py-2 my-2 text-white';
  chatContent.textContent = message;

  const chatMessage = document.createElement('div');
  chatMessage.className = 'sender';
  chatMessage.appendChild(chatContent);

  messagesWrapper.appendChild(chatMessage);
}

function renderReceiverMessage(message) {
  const chatContent = document.createElement('p');
  chatContent.className = 'message w-fit ml-0 mr-auto bg-gray-200 rounded-lg px-3 py-2 my-2 text-black';
  chatContent.textContent = message;

  const chatMessage = document.createElement('div');
  chatMessage.className = 'receiver';
  chatMessage.appendChild(chatContent);

  messagesWrapper.appendChild(chatMessage);
}