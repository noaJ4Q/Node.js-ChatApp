import { io } from 'https://cdn.socket.io/4.7.5/socket.io.esm.min.js';

export const socket = io();

socket.onAny((event, ...args) => {
  console.log(event, args);
});
