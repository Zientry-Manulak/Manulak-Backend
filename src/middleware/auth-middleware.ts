import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { handleError } from "../helpers/response.helper";
import { AuthenticationError } from "../helpers/error.helper";

const prisma = new PrismaClient();

class AuthMiddleware {
    public static authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers["authorization"];
            const token = authHeader?.split(" ")[1];

            if (!token) {
                throw new AuthenticationError("No access token");
            }

            const stored = await prisma.accessToken.findUnique({ where: { token } });
            if (!stored || stored.expires_at < new Date()) {
                throw new AuthenticationError("Access token expired");
            }
            
            (req as any).user = stored.user_id;

            next();
        } catch (error: any) {
            handleError(res, error);
        }
    }
}

export const authMiddleware = AuthMiddleware.authenticate;