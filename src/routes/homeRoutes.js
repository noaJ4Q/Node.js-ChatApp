import { Router } from 'express';
import { homeController } from '../controllers/homeController.js';
import { isAuthenticated } from '../middlewares/authentication.js';

export const homeRouter = Router();

homeRouter.get('/home', isAuthenticated, homeController.showPage);
homeRouter.get('/home/chat/:userId', isAuthenticated, homeController.showChat);
homeRouter.get('/home/groups', isAuthenticated, homeController.showGroups);
homeRouter.get('/home/groups/:groupID', isAuthenticated, homeController.showGroupChat);
homeRouter.get('/home/logout', homeController.logout);