import { Router } from 'express';
import indexController from '../controllers/indexController.js';

const indexRouter = Router();

indexRouter.get('/', indexController.getIndex);

export default indexRouter;
