import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { sessionMiddleware } from '../../index.js';
import { store } from '../../index.js';
import { GROUPS } from '../../index.js';
import { GroupChat } from '../models/GroupChat.js';

export function socketService(httpServer) {
  const io = new Server(httpServer);
  io.engine.use(sessionMiddleware);

  io.on('connection', (socket) => {
    console.log(`new connection ${socket.id}`);

    io.emit('reqSocketsID');

    // Receiving socket ID from each client
    socket.on('resSocketID', async () => {

      // get socket object based on socketID to get session object
      const sockets = await io.fetchSockets();
      const socketFiltered = sockets.find(s => s.id === socket.id);
      // get sessionID from session object
      const sessionID = socketFiltered.request.session.id;
      // use sessionID to filter sessions and get chat rooms
      const chatRoomsPerUser = filterChats(store.sessions, sessionID);
      // console.log(`----- chat rooms for user: ${sessionID} -----`);
      // console.log(chatRoomsPerUser);

      // return chat rooms to respective client
      io.to(socket.id).emit('chatRooms', chatRoomsPerUser);

    });

    socket.on('message', async ({ message, receiverSessionID }) => {
      const sockets = await io.fetchSockets();
      const socketFiltered = sockets.find(s => s.request.session.id === receiverSessionID);
      const receiverSocketID = socketFiltered.id;
      console.log(`--- message to: ${receiverSessionID} --- socketID: ${receiverSocketID}`);
      io.to(receiverSocketID).emit('message', message);
    })

    socket.on('reqGroups', () => {
      io.emit('groups', GROUPS);
    });

    socket.on('create-group', (groupName) => {
      const newGroup = new GroupChat(uuid(), groupName);
      GROUPS.push(newGroup);
      io.emit('groups', GROUPS);
    })

    socket.on('joinGroupChat', (groupID) => {
      socket.join(groupID);
    });

    socket.on('groupMessage', async ({ message, groupReceiverID }) => {
      const senderSocketId = socket.id;
      const sockets = await io.fetchSockets();
      const senderSocket = sockets.find(s => s.id === senderSocketId);

      socket.broadcast.to(groupReceiverID).emit('groupMessage', { message: message, sender: senderSocket.request.session.user });
    })

    socket.on('disconnect', () => {
      io.emit('reqSocketsID');
      console.log('disconnected: ' + socket.id);
    });
  });
}

function filterChats(sessions, userSessionID) {
  return Object.keys(sessions).filter(sessionID => sessionID !== userSessionID)
    .reduce((obj, key) => {
      obj[key] = sessions[key];
      return obj;
    }, {});
}