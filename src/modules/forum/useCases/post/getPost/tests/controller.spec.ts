import { ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostDTO } from 'gatherly-types';
import { PostMapper } from 'src/modules/forum/mappers/Post';
import { AppError } from 'src/shared/core/AppError';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { createStubPost } from '../../../tests/stubs/post.stub';
import { GetPostUseCaseSymbol } from '../../utils/symbols';
import { GetPostController } from '../GetPostController';
import { GetPostErrors } from '../GetPostErrors';
import { GetPostUseCase } from '../GetPostUseCase';

describe('GetPostController', () => {
  let controller: GetPostController;
  let useCase: GetPostUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetPostController],
      providers: [
        {
          provide: GetPostUseCaseSymbol,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetPostController>(GetPostController);
    useCase = module.get<GetPostUseCase>(GetPostUseCaseSymbol);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get post successfully', async () => {
    const postId = 1;
    const postDTO: PostDTO = PostMapper.toDTO(createStubPost(), 1);

    jest.spyOn(useCase, 'execute').mockResolvedValue(right(Result.ok<PostDTO>(postDTO)));

    await expect(controller.execute(postId)).resolves.toEqual(postDTO);
  });

  it('should throw NotFoundException if post does not exist', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new GetPostErrors.PostDoesntExistError()));

    await expect(controller.execute(postId)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user is banned from viewing post', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new GetPostErrors.UserBannedFromViewingPostError()));

    await expect(controller.execute(postId)).rejects.toThrow(ForbiddenException);
  });

  it('should throw InternalServerErrorException for other errors', async () => {
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new AppError.UnexpectedError()));

    await expect(controller.execute(postId)).rejects.toThrow(InternalServerErrorException);
  });
});
