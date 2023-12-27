import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: number;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signJWT(userId: number) {
    const payload: JwtPayload = { sub: userId };

    return await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: '30 days' });
  }
}
