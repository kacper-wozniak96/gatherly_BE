import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostRequestDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { IFailedField } from 'src/utils/FailedField';
import { CreatePostUseCaseSymbol } from '../../utils/symbols';
import { CreatePostController } from '../CreatePostController';
import { CreatePostErrors } from '../CreatePostErrors';
import { CreatePostUseCase } from '../CreatePostUseCase';

describe('CreatePostController', () => {
  let controller: CreatePostController;
  let useCase: CreatePostUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatePostController],
      providers: [
        {
          provide: CreatePostUseCaseSymbol,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreatePostController>(CreatePostController);
    useCase = module.get<CreatePostUseCase>(CreatePostUseCaseSymbol);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create post successfully', async () => {
    const createPostDTO: CreatePostRequestDTO = { title: 'New Title', text: 'New Content' };

    jest.spyOn(useCase, 'execute').mockResolvedValue(right(Result.ok<void>()));

    await expect(controller.execute(createPostDTO)).resolves.toBeUndefined();
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const createPostDTO: CreatePostRequestDTO = { title: 'New Title', text: 'New Content' };

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new CreatePostErrors.UserDoesntExistError()));

    await expect(controller.execute(createPostDTO)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if data is invalid', async () => {
    const createPostDTO: CreatePostRequestDTO = { title: 'New Title', text: 'New Content' };
    const failedFields: IFailedField[] = [{ message: 'Invalid title', field: 'title' }];

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new CreatePostErrors.InvalidDataError(failedFields)));

    await expect(controller.execute(createPostDTO)).rejects.toThrow(BadRequestException);
  });

  it('should throw InternalServerErrorException for other errors', async () => {
    const createPostDTO: CreatePostRequestDTO = { title: 'New Title', text: 'New Content' };

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new AppError.UnexpectedError()));

    await expect(controller.execute(createPostDTO)).rejects.toThrow(InternalServerErrorException);
  });
});
