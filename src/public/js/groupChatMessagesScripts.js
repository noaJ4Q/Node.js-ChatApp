import { socket } from '/js/commonScripts.js';

const chatInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const receiver = document.getElementById('receiver-data');

const messagesWrapper = document.getElementById('chat-messages');

socket.emit('joinGroupChat', receiver.value);

socket.on('groupMessage', ({ message, sender }) => {
  renderReceiverGroupMessage(message, sender);
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
  chatContent.className = 'message w-fit ml-auto mr-0 bg-indigo-600 rounded-lg px-3 py-2 my-2 text-white';
  chatContent.textContent = message;

  const chatMessage = document.createElement('div');
  chatMessage.className = 'sender';
  chatMessage.appendChild(chatContent);

  messagesWrapper.appendChild(chatMessage);
}

function renderReceiverGroupMessage(message, sender) {
  console.log(message);
  console.log(sender);
  const chatContent = document.createElement('p');
  chatContent.className = 'message w-fit ml-0 mr-auto bg-gray-200 rounded-lg px-3 py-2 my-2 text-black';
  chatContent.textContent = message;

  const chatMessage = document.createElement('div');
  chatMessage.className = 'receiver';
  chatMessage.appendChild(chatContent);

  messagesWrapper.appendChild(chatMessage);
}