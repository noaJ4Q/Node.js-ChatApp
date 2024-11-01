import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';

export function socketService(httpServer, store, sessionMiddleware) {
  const io = new Server(httpServer);
  io.engine.use(sessionMiddleware);

  io.on('connection', (socket) => {
    const connectedUser = socket.request.session.user;
    const newSession = socket.request.session;
    const sessionId = socket.request.session.id;
    connectedUser.connected = true;
    newSession.user = connectedUser;
    store.set(sessionId, newSession, (err) => {
      if (err) console.error(err);
      console.log("store session updated (connection): ", store.sessions);
    })

    socket.emit("session", {
      userId: socket.request.session.user.id
    })

    socket.join(socket.request.session.user.id);

    const users = [];
    store.all((err, sessions) => {
      if (err) console.error(err);
      for (const sessionId in sessions) {
        const session = sessions[sessionId];
        users.push(session.user);
      }
      socket.emit("user list", users);
    })

    socket.broadcast.emit("user connected", {
      user: socket.request.session.user
    })

    socket.on("private message", ({ message, to }) => {
      // send to other tabs of sender
      // io.to(to).to(socket.request.session.user.id).emit("private message", {
      //   message,
      //   from: socket.request.session.user.id
      // })
      io.to(to).emit("private message", {
        message,
        from: socket.request.session.user.id,
        to
      })
    })

    // socket.on('reqGroups', () => {
    //   io.emit('groups', GROUPS);
    // });

    // socket.on('create-group', (groupName) => {
    //   const newGroup = new GroupChat(uuid(), groupName);
    //   GROUPS.push(newGroup);
    //   io.emit('groups', GROUPS);
    // })

    // socket.on('joinGroupChat', (groupID) => {
    //   socket.join(groupID);
    // });

    socket.on('groupMessage', async ({ message, groupReceiverID }) => {
      const senderSocketId = socket.id;
      const sockets = await io.fetchSockets();
      const senderSocket = sockets.find(s => s.id === senderSocketId);

      socket.broadcast.to(groupReceiverID).emit('groupMessage', { message: message, sender: senderSocket.request.session.user });
    })

    socket.on("disconnect", async () => {
      const desconnectedUser = socket.request.session.user;
      const matchingSockets = await io.in(desconnectedUser.id).fetchSockets(); // if sockets are still in other tabs
      const isDisconnected = matchingSockets.length === 0;
      if (isDisconnected) {
        socket.broadcast.emit("user disconnected", desconnectedUser.id);
        desconnectedUser.connected = false;
        const newSession = socket.request.session;
        newSession.user = desconnectedUser;
        const sessionId = socket.request.session.id;
        // FOLLOWING CODE COULD MODIFY ADDITIONAL SESSION PROPERTIES (EXPIRES, ...)
        store.set(sessionId, newSession, (err) => {
          if (err) console.error(err);
          console.log("session store updated (disconnect): ", store.sessions);
        })
      }
    })

  })
}