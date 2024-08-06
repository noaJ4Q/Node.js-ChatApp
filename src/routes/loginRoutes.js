import { Router } from 'express';
import { loginController } from '../controllers/loginController.js';
import { isAuthenticated } from '../middlewares/authentication.js';

export const loginRouter = Router();

// loginRouter.get('/', isAuthenticated, loginController.showPage);
loginRouter.get('/', loginController.showPage);
loginRouter.post('/login', loginController.login);