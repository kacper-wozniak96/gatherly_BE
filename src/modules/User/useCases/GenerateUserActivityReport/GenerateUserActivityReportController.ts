import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, Post } from '@nestjs/common';
import { GenerateUserActivityReportRequestDTO, UserDTO } from 'gatherly-types';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { GenerateUserActivityReportUseCaseSymbolProvider } from '../../utils/symbols';
import { GenerateUserActivityReportErrors } from './GenerateUserActivityReportErrors';
import { GenerateUserActivityReportUseCaseProvider } from './GenerateUserActivityReportUseCase';

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

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case GenerateUserActivityReportErrors.UserDoesntExistError:
          throw new BadRequestException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    return;
  }
}
