import { Request, Response } from "express";
import { handleError, handleSuccess } from "../helpers/response.helper";
import {
  ILogin,
  IAuthResponse,
} from "../repositories/interfaces/auth-interface";
import { AuthService } from "../services/auth-service";
import { AuthenticationError } from "../helpers/error.helper";

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const response: IAuthResponse = await this.authService.login(req.body);

      res.cookie("refreshToken", response.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      handleSuccess(res, "Login successful", {
        accessToken: response.tokens.accessToken,
        user: response.user,
      });
    } catch (error: any) {
      handleError(res, error);
    }
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return handleError(
          res,
          new AuthenticationError("No refresh token found, please login again")
        );
      }

      const response = await this.authService.refresh(refreshToken);

      res.cookie("refreshToken", response.newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      handleSuccess(res, "Token refreshed successfully", {
        accessToken: response.accessToken,
        user: response.user,
      });
    } catch (error: any) {
      res.clearCookie("refreshToken");
      handleError(
        res,
        new AuthenticationError("Session expired, please login again")
      );
    }
  };
}

export const authController = new AuthController();
