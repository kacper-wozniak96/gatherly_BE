import { ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppError } from 'src/shared/core/AppError';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { DownVotePostUseCaseSymbol } from '../../utils/symbols';
import { DownVotePostController } from '../DownVotePostController';
import { DownVotePostErrors } from '../DownVotePostErrors';
import { DownVotePostUseCase } from '../DownVotePostUseCase';

describe('DownVotePostController', () => {
  let controller: DownVotePostController;
  let useCase: DownVotePostUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DownVotePostController],
      providers: [
        {
          provide: DownVotePostUseCaseSymbol,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DownVotePostController>(DownVotePostController);
    useCase = module.get<DownVotePostUseCase>(DownVotePostUseCaseSymbol);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should downvote post successfully', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(right(Result.ok<void>()));

    await expect(controller.execute(postId)).resolves.toBeUndefined();
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new DownVotePostErrors.UserDoesntExistError()));

    await expect(controller.execute(postId)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if post does not exist', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new DownVotePostErrors.PostDoesntExistError()));

    await expect(controller.execute(postId)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user is banned from voting', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new DownVotePostErrors.UserBannedFromVotingError()));

    await expect(controller.execute(postId)).rejects.toThrow(ForbiddenException);
  });

  it('should throw InternalServerErrorException for other errors', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new AppError.UnexpectedError()));

    await expect(controller.execute(postId)).rejects.toThrow(InternalServerErrorException);
  });
});
