import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, Post } from '@nestjs/common';
import { UserDTO } from '../../dtos/user';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { GenerateUserActivityReportUseCaseSymbolProvider } from '../../utils/symbols';
import { GenerateUserActivityReportErrors } from './GenerateUserActivityReportErrors';
import { GenerateUserActivityReportUseCaseProvider } from './GenerateUserActivityReportUseCase';
import { GenerateUserActivityReportRequestDTO } from './types';

@Controller(BASE_USER_CONTROLLER_PATH)
export class GenerateUserActivityReportController {
  constructor(
    @Inject(GenerateUserActivityReportUseCaseSymbolProvider) private readonly useCase: GenerateUserActivityReportUseCaseProvider,
  ) {}

  @Post('/activityReport')
  async execute(@Body() dto: GenerateUserActivityReportRequestDTO): Promise<UserDTO> {
    const result = await this.useCase.execute({ dto });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case GenerateUserActivityReportErrors.UserDoesntExistError:
          throw new BadRequestException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    return;
  }
}
