import { socket } from '/js/scriptsCommon.js';

const modal = document.getElementById('create-group-modal');
const openModalButton = document.getElementById('create-group');
const closeModalButton = document.getElementById('close-modal');
const form = document.getElementById('create-group-form');
const groupsWrapper = document.getElementById('groups-wrapper');

socket.emit('reqGroups');

socket.on('groups', (groups) => {
  groupsWrapper.innerHTML = '';
  for (const group of groups) {
    renderGroup(group);
  }
})

form.onsubmit = (e) => {
  e.preventDefault();
  const groupName = form.name.value;
  console.log(groupName);
  socket.emit('create-group', groupName);
  closeModal();
}

openModalButton.onclick = () => {
  openModal();
}

closeModalButton.onclick = () => {
  closeModal();
}

function renderGroup(group) {
  const chatPicture = document.createElement('img');
  chatPicture.src = 'https://i.pinimg.com/736x/fa/47/30/fa4730338dabbd71947d73239891f059.jpg';
  chatPicture.alt = 'Chat picture';
  chatPicture.className = 'avatar';

  const chatName = document.createElement('h3');
  chatName.className = 'name';
  chatName.textContent = `${group.name}`;

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
  newLinkChat.href = `/home/groups/${group.id}`;
  newLinkChat.appendChild(newChatRoom);

  groupsWrapper.appendChild(newLinkChat);
}

function openModal() {
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
}