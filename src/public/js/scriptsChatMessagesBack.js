import { socket } from '/js/scriptsCommon.js';

socket.on('message', (message) => {
  console.log(message);
});