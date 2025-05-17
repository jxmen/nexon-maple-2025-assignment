import { ConfigService } from '@nestjs/config';
import { TokenGenerator } from '../token-generator';
import { User } from '../user/user.schema';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtTokenGenerator implements TokenGenerator {
  constructor(private readonly configService: ConfigService) {}

  generate(user: User): { accessToken: string; accessTokenExpiredAt: Date } {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const expiresInSeconds = 60 * 60; // 1시간
    const payload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken: string = jwt.sign(payload, secret, {
      expiresIn: expiresInSeconds,
    });

    return {
      accessToken,
      accessTokenExpiredAt: new Date(Date.now() + expiresInSeconds * 1000),
    };
  }
}
