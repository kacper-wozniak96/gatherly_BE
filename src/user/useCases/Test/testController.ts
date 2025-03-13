import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/modules/AuthModule/Auth.guard';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';

@Controller(BASE_USER_CONTROLLER_PATH)
export class TestController {
  constructor() {}

  @Public()
  @Get('/test')
  async execute(): Promise<string> {
    console.log('hello world');

    return 'hello world';
  }
}
