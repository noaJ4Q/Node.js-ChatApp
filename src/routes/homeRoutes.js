import { Router } from 'express';
import { homeController } from '../controllers/homeController.js';
import { isAuthenticated, isAuthenticated2 } from '../middlewares/authentication.js';

export const homeRouter = Router();

// homeRouter.get('/home', isAuthenticated, homeController.showPage);
homeRouter.get('/home', isAuthenticated2, homeController.showPage);
// homeRouter.get('/home', homeController.showPage);
homeRouter.get('/home/chat/:sessionID', isAuthenticated, homeController.showChat);
homeRouter.get('/home/logout', homeController.logout);