import { socket } from '/js/scriptsCommon.js';

const chatInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const receiver = document.getElementById('receiver-data');

socket.emit('joinGroupChat', receiver.value);
socket.on('groupMessage', (message) => {
  console.log('groupMessage: ' + message);
})

sendButton.onclick = () => {
  sendGroupMessage();
}

function sendGroupMessage() {
  const message = chatInput.value;
  const groupReceiverID = receiver.value;
  socket.emit('groupMessage', { message, groupReceiverID });
  chatInput.value = '';
}