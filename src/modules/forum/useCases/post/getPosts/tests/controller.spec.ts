import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetPostsResponseDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { GetPostsUseCaseSymbol } from '../../utils/symbols';
import { GetPostsController } from '../GetPostsController';
import { GetPostsUseCase } from '../GetPostsUseCase';

describe('GetPostsController', () => {
  let controller: GetPostsController;
  let useCase: GetPostsUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetPostsController],
      providers: [
        {
          provide: GetPostsUseCaseSymbol,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetPostsController>(GetPostsController);
    useCase = module.get<GetPostsUseCase>(GetPostsUseCaseSymbol);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get posts successfully', async () => {
    const offset = 0;
    const search = 'test';
    const postsResponseDTO: GetPostsResponseDTO = { posts: [], postsTotalCount: 0 };

    jest.spyOn(useCase, 'execute').mockResolvedValue(right(Result.ok<GetPostsResponseDTO>(postsResponseDTO)));

    await expect(controller.execute(offset, search)).resolves.toEqual(postsResponseDTO);
  });

  it('should throw InternalServerErrorException for unexpected errors', async () => {
    const offset = 0;
    const search = 'test';

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new AppError.UnexpectedError()));

    await expect(controller.execute(offset, search)).rejects.toThrow(InternalServerErrorException);
  });
});
