import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import express from 'express';
import session from 'express-session';
import { createServer } from 'node:http';
import { socketService } from './src/services/sockets.js';

import { homeRouter } from './src/routes/homeRoutes.js';
import { loginRouter } from './src/routes/loginRoutes.js';

// Server setup
const app = express();
const http = createServer(app);
// const io = new Server(http);
export const store = new session.MemoryStore();
const PORT = process.env.PORT || 8080;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Views setup
app.set('views', path.join(process.cwd(), 'src/views'));
app.use(express.static(path.join(process.cwd(), 'src/public')));

// Middleware
export const sessionMiddleware = session({
  secret: SESSION_SECRET, // go bati
  saveUninitialized: false,
  resave: false,
  store
});

socketService(http);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);

// Routes
app.use('/', homeRouter);
app.use('/', loginRouter);

export const GROUPS = [];

http.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
