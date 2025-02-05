import { socket } from '/js/commonScripts.js';

const messagesWrapper = document.getElementById('chat-messages');
const chatInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const receiver = document.getElementById('receiver-data');

loadMessages();

socket.on("load messages", ({ messages }) => {
  console.log("past messages", messages);
  messages.forEach(message => {
    if (message.senderId === socket.userId) {
      renderSenderMessage(message.content);
    } else {
      renderReceiverMessage(message.content);
    }
  });
})

socket.on("private message", ({ message, from, to }) => {
  renderReceiverMessage(message);
})

socket.on("user disconnected", ({ userId }) => {
  console.log("user disconnected", userId);
  updateUserStatus("offline");
})

sendButton.onclick = () => {
  console.log('send button clicked');
  sendMessage();
}

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
})

function loadMessages() {
  const userId = receiver.value;
  socket.emit("load messages", { chatWithId: userId });
}

function sendMessage() {
  const message = chatInput.value;
  const userId = receiver.value;
  socket.emit("private message", { message, to: userId });
  renderSenderMessage(message);
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
  console.log('rendering receiver message');
  const chatContent = document.createElement('p');
  chatContent.className = 'message w-fit ml-0 mr-auto bg-gray-200 rounded-lg px-3 py-2 my-2 text-black';
  chatContent.textContent = message;

  const chatMessage = document.createElement('div');
  chatMessage.className = 'receiver';
  chatMessage.appendChild(chatContent);

  messagesWrapper.appendChild(chatMessage);
}

function updateUserStatus(newStatus) {
  const userStatusElement = document.getElementById("user-status");
  const statusSignElement = userStatusElement.getElementsByTagName("span")[0].classList;
  const statusTextElement = userStatusElement.getElementsByTagName("span")[1];
  statusTextElement.textContent = newStatus;
  if (newStatus === "offline") {
    statusSignElement.remove("bg-green-500");
    statusSignElement.add("bg-red-500");
  } else {
    statusSignElement.remove("bg-red-500");
    statusSignElement.add("bg-green-500");
  }
}