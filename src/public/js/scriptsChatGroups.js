import { socket } from '/js/scriptsCommon.js';

const modal = document.getElementById('create-group-modal');
const openModalButton = document.getElementById('create-group');
const closeModalButton = document.getElementById('close-modal');
const form = document.getElementById('create-group-form');

socket.on('groups', (groups) => {
  console.log(groups);
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

function openModal() {
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
}