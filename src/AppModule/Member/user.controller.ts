import { Controller, Get } from '@nestjs/common';
import { IUserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly UserService: IUserService) {}

  @Get()
  async getHello(): Promise<any> {
    return await this.UserService.getUserWithId1();
  }
}
