import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import express from 'express';
import session from 'express-session';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

import { homeRouter } from './src/routes/homeRoutes.js';
import { loginRouter } from './src/routes/loginRoutes.js';

// Server setup
const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: { origin: '*' }
});

// Views setup
app.set('views', path.join(process.cwd(), 'src/views'));
console.log(path.join(process.cwd(), 'src/views'));
app.use(express.static('src/public'));

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET, // go bati
  saveUninitialized: false,
  resave: false
}))

// Routes
app.use('/home', homeRouter);
app.use('/', loginRouter);

io.on('connection', (socket) => {
  console.log('new connection: ' + socket.id);

  socket.on('message', (message) => {
    console.log(`message from ${socket.id}: ${message}`);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('disconnected: ' + socket.id);
  });
});

http.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});