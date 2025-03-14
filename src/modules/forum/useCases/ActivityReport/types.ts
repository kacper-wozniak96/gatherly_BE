import { GenerateUserActivityReportRequestDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { GenerateUserActivityReportErrors } from './GenerateUserActivityReportErrors';
import { UseCase } from 'src/shared/core/UseCase';

export type ResponseData = Either<GenerateUserActivityReportErrors.UserDoesntExistError | AppError.UnexpectedError, Result<void>>;

export type RequestData = {
  dto: GenerateUserActivityReportRequestDTO;
};

export interface IGenerateUserActivityReportUseCase extends UseCase<RequestData, Promise<ResponseData>> {}
