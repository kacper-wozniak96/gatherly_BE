import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppError } from 'src/shared/core/AppError';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { DeletePostUseCaseSymbol } from '../../utils/symbols';
import { DeletePostController } from '../DeletePostController';
import { DeletePostErrors } from '../DeletePostErrors';
import { DeletePostUseCase } from '../DeletePostUseCase';

describe('DeletePostController', () => {
  let controller: DeletePostController;
  let useCase: DeletePostUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeletePostController],
      providers: [
        {
          provide: DeletePostUseCaseSymbol,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeletePostController>(DeletePostController);
    useCase = module.get<DeletePostUseCase>(DeletePostUseCaseSymbol);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete post successfully', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(right(Result.ok<void>()));

    await expect(controller.execute(postId)).resolves.toBeUndefined();
  });

  it('should throw NotFoundException if post does not exist', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new DeletePostErrors.PostDoesntExistError()));

    await expect(controller.execute(postId)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new DeletePostErrors.UserDoesntExistError()));

    await expect(controller.execute(postId)).rejects.toThrow(NotFoundException);
  });

  it('should throw InternalServerErrorException for other errors', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new AppError.UnexpectedError()));

    await expect(controller.execute(postId)).rejects.toThrow(InternalServerErrorException);
  });
});
