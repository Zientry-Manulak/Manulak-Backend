import express from 'express';
import { productController } from '../controllers/product-controller';
import { authMiddleware } from '../middleware/auth-middleware';

const productRouter = express.Router();

productRouter.post("/addProduct", authMiddleware, productController.createProduct);

export default productRouter;