import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../Auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request: Request) => {
      //     let token = null;
      //     if (request && request.cookies) {
      //       token = request.cookies['jwt']; // Replace 'jwt' with the name of your cookie
      //     }
      //     return token;
      //   },
      // ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request, payload: JwtPayload) {
    return { userId: payload.sub };
  }
}

export type CustomRequest = Request & {
  user: { userId: number };
};
