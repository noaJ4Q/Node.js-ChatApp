import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import express from 'express';
import session from 'express-session';
import { v4 as uuid } from 'uuid';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

import { homeRouter } from './src/routes/homeRoutes.js';
import { loginRouter } from './src/routes/loginRoutes.js';
import { GroupChat } from './src/models/GroupChat.js';

// Server setup
const app = express();
const http = createServer(app);
const io = new Server(http);
export const store = new session.MemoryStore();

// Views setup
app.set('views', path.join(process.cwd(), 'src/views'));
app.use(express.static(path.join(process.cwd(), 'src/public')));

// Middleware
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET, // go bati
  saveUninitialized: false,
  resave: false,
  store
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

// Routes
app.use('/', homeRouter);
app.use('/', loginRouter);

export const GROUPS = [];

// Socket
io.on('connection', (socket) => {
  console.log(`new connection ${socket.id}`);

  io.emit('reqSocketsID');

  // Receiving socket ID from each client
  socket.on('resSocketID', async (socketID) => {

    // get socket object based on socketID to get session object
    const sockets = await io.fetchSockets();
    const socketFiltered = sockets.find(s => s.id === socketID);
    // get sessionID from session object
    const sessionID = socketFiltered.request.session.id;
    // use sessionID to filter sessions and get chat rooms
    const chatRoomsPerUser = filterChats(store.sessions, sessionID);
    // console.log(`----- chat rooms for user: ${sessionID} -----`);
    // console.log(chatRoomsPerUser);

    // return chat rooms to respective client
    io.to(socketID).emit('chatRooms', chatRoomsPerUser);

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

  socket.on('groupMessage', ({ message, groupReceiverID }) => {
    io.to(groupReceiverID).emit('groupMessage', message);
  })

  socket.on('disconnect', () => {
    io.emit('reqSocketsID');
    console.log('disconnected: ' + socket.id);
  });
});

http.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});

function filterChats(sessions, userSessionID) {
  return Object.keys(sessions).filter(sessionID => sessionID !== userSessionID)
    .reduce((obj, key) => {
      obj[key] = sessions[key];
      return obj;
    }, {});
}