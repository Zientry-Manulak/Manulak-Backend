import express, { Request, Response } from 'express';
import itemRouter from './item-routes';

const baseRouter = express.Router();

// default router
baseRouter.get("/health", (req: Request, res: Response) => {
    const msg = {
        success: true,
        message: `InternUpdates API is up and running on ${process.env.ENV_NAME}`
    };
    res.status(200).json(msg);
});

// routes
baseRouter.use("/item", itemRouter);

export default baseRouter;