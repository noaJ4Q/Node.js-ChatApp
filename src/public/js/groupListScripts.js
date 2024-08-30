import { socket } from '/js/commonScripts.js';

const modal = document.getElementById('create-group-modal');
const openModalButton = document.getElementById('create-group');
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

window.onclick = (e) => {
  if (e.target == modal) {
    closeModal();
  }
}

function renderGroup(group) {
  const chatPicture = document.createElement('img');
  chatPicture.src = 'https://i.pinimg.com/736x/fa/47/30/fa4730338dabbd71947d73239891f059.jpg';
  chatPicture.alt = 'Chat picture';
  chatPicture.className = 'avatar';

  const chatName = document.createElement('h3');
  chatName.className = 'name font-semibold text-base';
  chatName.textContent = `${group.name}`;

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