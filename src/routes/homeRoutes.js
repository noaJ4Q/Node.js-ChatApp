import { Router } from 'express';
import { homeController } from '../controllers/homeController.js';

export const homeRouter = Router();

// /home
homeRouter.get('/', homeController.page);
homeRouter.get('/logout', homeController.logout);