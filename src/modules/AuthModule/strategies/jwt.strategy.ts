import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import { JwtPayload } from '../Auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: ExpressRequest) => {
          const authHeader = request.headers['authorization'];
          console.log({ authHeader: authHeader.split(' ')[1] });
          let token = null;
          if (request && authHeader) {
            token = authHeader.split(' ')[1];
          }
          return token;
        },
      ]),
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
