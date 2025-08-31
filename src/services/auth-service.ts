import { authRepository } from "../repositories/auth-repository";
import { ILogin, IAuthResponse } from "../repositories/interfaces/auth-interface";
import { generateToken } from "../utils/token";
import bcrypt from "bcryptjs";

export class AuthService {
  async login(loginData: ILogin, singleSession = false): Promise<IAuthResponse> {
    const user = await authRepository.findByUsername(loginData.username);
    if (!user) throw new Error("Invalid username or password");

    const valid = await bcrypt.compare(loginData.password, user.password);
    if (!valid) throw new Error("Invalid username or password");

    if (singleSession) {
      await authRepository.deleteAllRefreshTokensByUser(user.id);
    }

    const accessToken = generateToken(32);
    const refreshToken = generateToken(64);

    const accessExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const refreshRecord = await authRepository.saveRefreshToken(user.id, refreshToken, refreshExpiry);

    await authRepository.saveAccessTokenForRefresh(refreshRecord.id, accessToken, accessExpiry);

    return {
      tokens: { accessToken, refreshToken },
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        company_id: user.company_id,
      },
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; user: any; newRefreshToken: string }> {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (!stored || stored.expires_at < new Date()) {
      if (stored) await authRepository.deleteRefreshToken(refreshToken);
      throw new Error("Session expired, please login again");
    }

    await authRepository.deleteRefreshToken(refreshToken);

    const newRefreshToken = generateToken(64);
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const newRefreshRecord = await authRepository.saveRefreshToken(stored.user.id, newRefreshToken, refreshExpiry);

    const newAccessToken = generateToken(32);
    const accessExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await authRepository.saveAccessTokenForRefresh(newRefreshRecord.id, newAccessToken, accessExpiry);

    return {
      accessToken: newAccessToken,
      newRefreshToken,
      user: {
        id: stored.user.id,
        username: stored.user.username,
        role: stored.user.role,
        company_id: stored.user.company_id,
      },
    };
  }
}
