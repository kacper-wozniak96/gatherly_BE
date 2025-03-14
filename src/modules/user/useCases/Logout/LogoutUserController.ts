import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/modules/Auth/Auth.guard';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { accessTokenCookieName } from '../../utils/cookies';

@Controller(BASE_USER_CONTROLLER_PATH)
export class LogoutUserController {
  constructor() {}

  @Public()
  @Post('/logout')
  async execute(@Res({ passthrough: true }) response: Response): Promise<void> {
    response.clearCookie(accessTokenCookieName, { httpOnly: true });
    return;
  }
}
