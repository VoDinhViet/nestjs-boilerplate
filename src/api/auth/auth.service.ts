import { LoginReqDto } from '@/api/auth/dto/login.req.dto';
import { LoginResDto } from '@/api/auth/dto/login.res.dto';
import { JwtPayloadType } from '@/api/auth/types/jwt-payload.type';
import { CacheService } from '@/cache/cache.service';
import { Branded } from '@/common/types/types';
import { AllConfigType } from '@/config/config.type';
import { CacheKey } from '@/constants/cache.constant';
import { DRIZZLE } from '@/database/database.module';
import { users } from '@/database/schemas';
import { sessions } from '@/database/schemas/session.schema';
import { DrizzleDB } from '@/database/types/drizzle';
import { createCacheKey } from '@/utils/cache.util';
import { verifyPassword } from '@/utils/password.util';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import * as crypto from 'crypto';
import { eq } from 'drizzle-orm';
import ms from 'ms';

type Token = Branded<
  {
    access_token: string;
    refresh_token: string;
    token_expires: number;
  },
  'token'
>;

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(reqDto: LoginReqDto): Promise<LoginResDto> {
    const { email, password } = reqDto;
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        email: true,
        password: true,
        id: true,
      },
    });

    const isPasswordValid =
      user && (await verifyPassword(password, user.password));

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.db
      .insert(sessions)
      .values({
        hash,
        author_id: user.id,
      })
      .returning();

    const token = await this.createToken({
      id: user.id,
      sessionId: session[0].id,
      hash,
    });

    return plainToInstance(LoginResDto, {
      ...token,
      user_id: user.id,
    });
  }

  private async createToken(data: {
    id: string;
    sessionId: string;
    hash: string;
  }): Promise<Token> {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });
    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: '', // TODO: add role
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires: tokenExpires,
    } as Token;
  }

  async verifyAccessToken(token: string): Promise<JwtPayloadType> {
    let payload: JwtPayloadType;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      });
    } catch {
      throw new UnauthorizedException();
    }

    // Force logout if the session is in the blacklist
    const isSessionBlacklisted = await this.cacheService.get<boolean>(
      createCacheKey(CacheKey.SESSION_BLACKLIST, payload.sessionId),
    );

    if (isSessionBlacklisted) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
