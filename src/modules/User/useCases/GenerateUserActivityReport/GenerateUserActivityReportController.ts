import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, Post } from '@nestjs/common';
import { UserDTO } from '../../dtos/user';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { GenerateUserActivityReportUseCaseSymbol } from '../../utils/symbols';
import { GenerateUserActivityReportRequestDTO } from './GenerateUserActivityReportDTO';
import { GenerateUserActivityReportErrors } from './GenerateUserActivityReportErrors';
import { GenerateUserActivityReportUseCase } from './GenerateUserActivityReportUseCase';

@Controller(BASE_USER_CONTROLLER_PATH)
export class GenerateUserActivityReportController {
  constructor(@Inject(GenerateUserActivityReportUseCaseSymbol) private readonly useCase: GenerateUserActivityReportUseCase) {}

  @Post('/activityReport')
  async execute(@Body() dto: GenerateUserActivityReportRequestDTO): Promise<UserDTO> {
    const result = await this.useCase.execute(dto);

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
