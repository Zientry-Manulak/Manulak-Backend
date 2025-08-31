import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AuthRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  public async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: { company: true },
    });
  }

   public async saveAccessTokenForRefresh(refreshTokenId: string, token: string, expiresAt: Date) {
    const refreshRecord = await this.prisma.refreshToken.findUnique({
      where: { id: refreshTokenId },
    });

    if (!refreshRecord) throw new Error("Refresh token does not exist");

    return this.prisma.accessToken.upsert({
      where: { refresh_token_id: refreshTokenId },
      update: { token, expires_at: expiresAt },
      create: {
        token,
        expires_at: expiresAt,
        refresh_token_id: refreshTokenId,
        user_id: refreshRecord.user_id,
      },
    });
  }

  public async saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ) {
    return this.prisma.refreshToken.create({
      data: { token, user_id: userId, expires_at: expiresAt },
    });
  }

  public async findRefreshToken(token: string) {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  public async findAccessToken(token: string) {
    return this.prisma.accessToken.findUnique({ where: { token } });
  }

  public async deleteRefreshToken(token: string) {
    const refreshRecord = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshRecord) return;

    await this.prisma.accessToken.deleteMany({
      where: { refresh_token_id: refreshRecord.id },
    });

    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  public async deleteAllRefreshTokensByUser(userId: string) {
    const refreshTokens = await this.prisma.refreshToken.findMany({
      where: { user_id: userId },
    });

    const refreshIds = refreshTokens.map(rt => rt.id);

    await this.prisma.accessToken.deleteMany({
      where: { refresh_token_id: { in: refreshIds } },
    });

    await this.prisma.refreshToken.deleteMany({
      where: { user_id: userId },
    });
  }

  async deleteAccessToken(token: string) {
    return this.prisma.accessToken.delete({ where: { token } });
  }
}

export const authRepository = new AuthRepository();
