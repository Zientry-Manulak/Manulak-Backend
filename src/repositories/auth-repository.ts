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

    public async saveAccessToken(userId: string, token: string, expiresAt: Date) {
        return this.prisma.accessToken.create({
            data: { token, user_id: userId, expires_at: expiresAt },
        });
    }

    public async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
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
        return this.prisma.accessToken.findUnique({
            where: { token },
        });
    }

    async deleteRefreshToken(token: string) {
    return prisma.refreshToken.delete({
        where: { token },
    });
}
}

export const authRepository = new AuthRepository();
