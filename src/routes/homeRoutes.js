import { Router } from 'express';
import { homeController } from '../controllers/homeController.js';
import { isAuthenticated } from '../middlewares/authentication.js';

export const homeRouter = Router();

// /home
homeRouter.get('/', isAuthenticated, homeController.showPage);
homeRouter.get('/logout', homeController.logout);