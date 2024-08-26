import { socket } from '/js/commonScripts.js';

socket.on('message', (message) => {
  console.log(message);
});