import { Request, Response } from "express";
import { handleError, handleSuccess } from "../helpers/response.helper";
import { ILogin, IAuthResponse } from "../repositories/interfaces/auth-interface";
import { AuthService } from "../services/auth-service";

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const loginData: ILogin = req.body;
            const response: IAuthResponse = await this.authService.login(loginData);
            handleSuccess(res, "Login successful", response);
        } catch (error: any) {
            handleError(res, error);
        }
    }

    public refresh = async (req: Request, res: Response): Promise<void> => {
        try {
            const { refreshToken } = req.body;
            const response: IAuthResponse = await this.authService.refresh(refreshToken);
            handleSuccess(res, "Token refreshed successfully", response);
        } catch (error: any) {
            handleError(res, error);
        }
    }
}

export const authController = new AuthController();
