import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, Post } from '@nestjs/common';
import { GenerateUserActivityReportRequestDTO, UserDTO } from 'gatherly-types';
import { BASE_POST_CONTROLLER_PATH } from '../post/utils/baseContollerPath';
import { GenerateUserActivityReportErrors } from './GenerateUserActivityReportErrors';
import { IGenerateUserActivityReportUseCase } from './types';
import { GenerateUserActivityReportUseCaseSymbol } from './utils/symbols';

@Controller(BASE_POST_CONTROLLER_PATH)
export class GenerateUserActivityReportController {
  constructor(@Inject(GenerateUserActivityReportUseCaseSymbol) private readonly useCase: IGenerateUserActivityReportUseCase) {}

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
