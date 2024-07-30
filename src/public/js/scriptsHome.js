import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const socket = io();
const chatsList = document.getElementById('chats-list');

socket.on('individual chats', (data) => {
  for (const sessionID in data) {
    const sessionData = JSON.parse(data[sessionID]);
    console.log(sessionData);
    renderChat(sessionData);
  }
});

function renderChat(sessionData) {
  const { name, lastName } = sessionData.user;

  const chatPicture = document.createElement('img');
  chatPicture.src = 'https://i.pinimg.com/736x/fa/47/30/fa4730338dabbd71947d73239891f059.jpg';
  chatPicture.alt = 'Chat picture';
  chatPicture.className = 'avatar';

  const chatName = document.createElement('h3');
  chatName.className = 'name';
  chatName.textContent = `${name} ${lastName}`;

  const chatContent = document.createElement('p');
  chatContent.className = 'preview';
  chatContent.textContent = 'chat content';

  const chatTime = document.createElement('p');
  chatTime.className = 'time';
  chatTime.textContent = '1h';

  const newChat = document.createElement('div');
  newChat.className = 'chat';
  newChat.appendChild(chatPicture);
  newChat.appendChild(chatName);
  newChat.appendChild(chatContent);
  newChat.appendChild(chatTime);

  chatsList.appendChild(newChat);
}