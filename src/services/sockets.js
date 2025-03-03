import { Server } from 'socket.io';
import { store } from '../../index.js';
import { PrivateMessage } from '../models/PrivateMessage.js';
import { GroupMessage } from '../models/GroupMessage.js';
import { GroupChat } from '../models/GroupChat.js';
import { v4 as uuid } from 'uuid';

export const GROUPS = [];
const MESSAGES = [];
const GROUP_MESSAGES = [];

export function socketService(httpServer, sessionMiddleware) {
  const io = new Server(httpServer);
  io.engine.use(sessionMiddleware);

  io.on('connection', (socket) => {

    //update user status when connect
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
    socket.on('joinGroupChat', ({ groupID }) => {
      console.log("user joined group chat: ", groupID);
      socket.join(groupID);
    });

    const usersChat = [];

    // get all user chats when connect
    store.all((err, sessions) => {
      if (err) console.error(err);
      for (const sessionId in sessions) {
        const session = sessions[sessionId];
        const lastMessage = MESSAGES.findLast(m => ((m.senderId === connectedUser.id && m.receiverId === session.user.id) || (m.senderId === session.user.id && m.receiverId === connectedUser.id)));
        const userChat = {
          user: session.user,
          lastMessage: lastMessage ? lastMessage : "No messages...",
        }
        usersChat.push(userChat);
      }
      socket.emit("user list", usersChat);
    })

    socket.on("load messages", ({ chatWithId }) => {
      const messages = MESSAGES.filter(m => (m.senderId === connectedUser.id && m.receiverId === chatWithId) || (m.senderId === chatWithId && m.receiverId === connectedUser.id));
      io.to(connectedUser.id).emit("load messages", { messages });
    })

    socket.on("load group messages", ({ groupChatId }) => {
      console.log("on socket: load group messages for groupReceiverID: ", groupChatId);
      console.log("messages total: ", GROUP_MESSAGES);
      const messages = GROUP_MESSAGES.filter(m => m.groupReceiverID === groupChatId);
      console.log("messages filtered: ", messages);
      io.to(connectedUser.id).emit("load group messages", { messages });
    });

    socket.broadcast.emit("user connected", {
      user: socket.request.session.user,
      lastMessage: "No messages..."
    })

    socket.on("private message", ({ message, to }) => {
      // send to other tabs of sender
      // io.to(to).to(socket.request.session.user.id).emit("private message", {
      //   message,
      //   from: socket.request.session.user.id
      // })

      // save message in memory
      const newMessage = new PrivateMessage(uuid(), socket.request.session.user.id, to, message, new Date());
      MESSAGES.push(newMessage);

      io.to(to).emit("private message", {
        message,
        from: socket.request.session.user.id,
        to
      })
    })

    // socket.on('reqGroups', () => {
    //   io.emit('groups', GROUPS);
    // });

    socket.on('create-group', (groupName) => {
      const newGroup = new GroupChat(uuid(), groupName);
      GROUPS.push(newGroup);
      io.emit('groups', GROUPS);
    })

    socket.on('groupMessage', async ({ message, groupReceiverID }) => {
      const senderSocketId = socket.id;
      const sockets = await io.fetchSockets();
      const senderSocket = sockets.find(s => s.id === senderSocketId);

      const dateMessage = new Date();

      const newGroupMessage = new GroupMessage(uuid(), senderSocket.request.session.user.id, groupReceiverID, message, dateMessage);
      GROUP_MESSAGES.push(newGroupMessage);

      const group = GROUPS.find(g => g.id === groupReceiverID);
      group.lastMessage = message;
      group.lastMessageTime = dateMessage;

      // console.log("group messages: ", GROUP_MESSAGES);

      socket.broadcast.to(groupReceiverID).emit('groupMessage', { message: message, sender: senderSocket.request.session.user });
    })

    socket.on("disconnect", async () => {
      const desconnectedUser = socket.request.session.user;
      const matchingSockets = await io.in(desconnectedUser.id).fetchSockets(); // if sockets are still in other tabs
      const isDisconnected = matchingSockets.length === 0;
      if (isDisconnected) {
        socket.broadcast.emit("user disconnected", { userId: desconnectedUser.id });
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