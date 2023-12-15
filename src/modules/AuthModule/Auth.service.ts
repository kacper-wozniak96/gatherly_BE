import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signJWT(userId: number) {
    const payload = { sub: userId };

    return await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: '30 days' });
  }
}
