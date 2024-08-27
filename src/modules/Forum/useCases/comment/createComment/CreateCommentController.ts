import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, NotFoundException, Post } from '@nestjs/common';
import { BASE_COMMENT_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { CreateCommentUseCaseSymbol } from '../utils/symbols';
import { CreateCommentUseCase } from './CreateComment';
import { CreateCommentRequestDTO, CreateCommentResponseDTO } from './CreateCommentDTO';
import { CreateCommentErrors } from './CreateCommentErrors';

@Controller(BASE_COMMENT_CONTROLLER_PATH)
export class CreateCommentController {
  constructor(@Inject(CreateCommentUseCaseSymbol) private readonly createCommentUseCase: CreateCommentUseCase) {}

  @Post('')
  async execute(@Body() createCommentDTO: CreateCommentRequestDTO): Promise<CreateCommentResponseDTO | void> {
    const result = await this.createCommentUseCase.execute(createCommentDTO);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CreateCommentErrors.UserDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case CreateCommentErrors.PostDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case CreateCommentErrors.InvalidDataError:
          throw new BadRequestException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    return;
  }
}
