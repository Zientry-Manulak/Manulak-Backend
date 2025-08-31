import express, { Request, Response } from 'express';
import productRouter from './product-routes';
import authRouter from './auth-routes';

const baseRouter = express.Router();

// default router
baseRouter.get("/health", (req: Request, res: Response) => {
    const msg = {
        success: true,
        message: `Manual-Agro API is up and running on ${process.env.ENV_NAME}`
    };
    res.status(200).json(msg);
});

// routes
baseRouter.use("/product", productRouter);
baseRouter.use("/auth", authRouter);

export default baseRouter;