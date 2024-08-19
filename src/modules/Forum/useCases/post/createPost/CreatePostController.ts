import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, NotFoundException, Post } from '@nestjs/common';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { CreatePostUseCaseSymbol } from '../utils/symbols';
import { CreatePostUseCase } from './CreatePost';
import { CreatePostDTO, CreatePostResponseDTO } from './CreatePostDTO';
import { CreatePostErrors } from './CreatePostErrors';

@Controller(BASE_POST_CONTROLLER_PATH)
export class CreatePostController {
  constructor(@Inject(CreatePostUseCaseSymbol) private readonly createPostUseCase: CreatePostUseCase) {}

  @Post('')
  async execute(@Body() createPostDTO: CreatePostDTO): Promise<CreatePostResponseDTO | void> {
    const result = await this.createPostUseCase.execute(createPostDTO);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CreatePostErrors.UserDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case CreatePostErrors.InvalidDataError:
          throw new BadRequestException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    const responseDTO: CreatePostResponseDTO = result.value.getValue();
    return responseDTO;
    // const result = await this.createPostUseCase.execute(createPostDTO);

    // if (result.isLeft()) {
    //   const error = result.value;

    //   switch (error.constructor) {
    //     case CreatePostErrors.UserDoesntExistError:
    //       throw new NotFoundException(error.getErrorValue());
    //     default:
    //       throw new InternalServerErrorException(error.getErrorValue());
    //   }
    // }

    // const responseDTO: CreatePostResponseDTO = result;

    // // return result.;
  }
}
