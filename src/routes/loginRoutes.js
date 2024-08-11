import { Router } from 'express';
import { loginController } from '../controllers/loginController.js';
import { isAuthenticatedLogin } from '../middlewares/authentication.js';

export const loginRouter = Router();

loginRouter.get('/', isAuthenticatedLogin, loginController.showPage);
loginRouter.post('/login', loginController.login);