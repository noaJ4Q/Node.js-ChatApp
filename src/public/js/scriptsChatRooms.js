import { socket } from '/js/scriptsCommon.js';

const chatRoomsWrapper = document.getElementById('chats-wrapper');

socket.on('reqSocketsID', () => {
  socket.emit('resSocketID', socket.id);
});

socket.on('chatRooms', (data) => {
  chatRoomsWrapper.innerHTML = '';
  for (const sessionID in data) {
    const sessionData = JSON.parse(data[sessionID]);
    renderChatRoom(sessionID, sessionData);
  }
});

function renderChatRoom(sessionID, sessionData) {
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

  const newChatRoom = document.createElement('div');
  newChatRoom.className = 'chat';
  newChatRoom.appendChild(chatPicture);
  newChatRoom.appendChild(chatName);
  newChatRoom.appendChild(chatContent);
  newChatRoom.appendChild(chatTime);

  const newLinkChat = document.createElement('a');
  newLinkChat.href = `/home/chat/${sessionID}`;
  newLinkChat.appendChild(newChatRoom);

  chatRoomsWrapper.appendChild(newLinkChat);
}