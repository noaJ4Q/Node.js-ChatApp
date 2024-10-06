import { socket } from '/js/commonScripts.js';

const chatRoomsWrapper = document.getElementById('chats-wrapper');

socket.on("user list", (users) => {
  chatRoomsWrapper.innerHTML = '';
  users.forEach(user => {
    if (user.userId !== socket.id) {
      renderChatRoom(user);
    }
  })
});

socket.on("user connected", (user) => {
  console.log("new user connected", user);
})

function renderChatRoom(user) {
  const name = user.userContent.name;
  const lastName = user.userContent.lastName;

  const chatPicture = document.createElement('img');
  chatPicture.src = 'https://i.pinimg.com/736x/fa/47/30/fa4730338dabbd71947d73239891f059.jpg';
  chatPicture.alt = 'Chat picture';
  chatPicture.className = 'avatar';

  const chatName = document.createElement('h3');
  chatName.className = 'name font-semibold text-base';
  chatName.textContent = `${name} ${lastName}`;

  const chatTime = document.createElement('p');
  chatTime.className = 'time text-slate-400 font-semibold';
  chatTime.textContent = '1h';

  const chatContent = document.createElement('p');
  chatContent.className = 'preview text-slate-500';
  chatContent.textContent = 'chat content';

  const newChatRoom = document.createElement('div');
  newChatRoom.className = 'chat p-3 rounded-lg hover:bg-indigo-50 duration-300';
  newChatRoom.appendChild(chatPicture);
  newChatRoom.appendChild(chatName);
  newChatRoom.appendChild(chatTime);
  newChatRoom.appendChild(chatContent);

  const newLinkChat = document.createElement('a');
  newLinkChat.href = `/home/chat/${user.userId}`;
  newLinkChat.className = '';
  newLinkChat.appendChild(newChatRoom);

  chatRoomsWrapper.appendChild(newLinkChat);
}