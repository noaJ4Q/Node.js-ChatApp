import { Router } from 'express';
import { homeController } from '../controllers/homeController.js';
import { isAuthenticated } from '../middlewares/authentication.js';

export const homeRouter = Router();

homeRouter.get('/home', isAuthenticated, homeController.showPage);
homeRouter.get('/home/logout', homeController.logout);