import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { sessionMiddleware } from '../../index.js';
import { store } from '../../index.js';
import { GROUPS } from '../../index.js';
import { GroupChat } from '../models/GroupChat.js';
import { Message } from '../models/Message.js';
import { USERS } from '../controllers/homeController.js';

export function socketService(httpServer) {
  const io = new Server(httpServer);
  io.engine.use(sessionMiddleware);

  io.on('connection', (socket) => {
    console.log(`new connection ${socket.id}`);

    io.emit('reqSocketsID');

    // Receiving socket ID from each client
    socket.on('resSocketID', async () => {

      const sockets = await io.fetchSockets();
      const socketFiltered = sockets.find(s => s.id === socket.id);
      const sessionID = socketFiltered.request.session.id;
      const chatRoomsPerUser = filterChats(store.sessions, sessionID);

      // io.to(socket.id).emit('chatRooms', chatRoomsPerUser);
      io.to(socket.id).emit("chatRooms", USERS);

    });

    socket.on('userMessage', async ({ message, receiverSessionID }) => {
      const sockets = await io.fetchSockets();
      const socketFiltered = sockets.find(s => s.request.session.id === receiverSessionID);
      const receiverSocketID = socketFiltered.id;
      console.log(`--- message to: ${receiverSessionID} --- socketID: ${receiverSocketID}`);

      // const newMessage = new Message();

      io.to(receiverSocketID).emit('userMessage', message);
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