import express from 'express';
import { itemController } from '../controllers/item-controller';


const itemRouter = express.Router();

itemRouter.post("/addItem", itemController.createItem);

export default itemRouter;