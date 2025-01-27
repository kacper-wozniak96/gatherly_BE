import { ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppError } from 'src/shared/core/AppError';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UpVotePostUseCaseSymbol } from '../../utils/symbols';
import { UpVotePostController } from '../UpVotePostController';
import { UpVotePostErrors } from '../UpVotePostErrors';
import { UpVotePostUseCase } from '../UpVotePostUseCase';

describe('UpVotePostController', () => {
  let controller: UpVotePostController;
  let useCase: UpVotePostUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpVotePostController],
      providers: [
        {
          provide: UpVotePostUseCaseSymbol,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UpVotePostController>(UpVotePostController);
    useCase = module.get<UpVotePostUseCase>(UpVotePostUseCaseSymbol);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upvote post successfully', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(right(Result.ok<void>()));

    await expect(controller.execute(postId)).resolves.toBeUndefined();
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new UpVotePostErrors.UserDoesntExistError()));

    await expect(controller.execute(postId)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if post does not exist', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new UpVotePostErrors.PostDoesntExistError()));

    await expect(controller.execute(postId)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user is banned from voting', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new UpVotePostErrors.UserBannedFromVotingError()));

    await expect(controller.execute(postId)).rejects.toThrow(ForbiddenException);
  });

  it('should throw InternalServerErrorException for other errors', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new AppError.UnexpectedError()));

    await expect(controller.execute(postId)).rejects.toThrow(InternalServerErrorException);
  });
});
