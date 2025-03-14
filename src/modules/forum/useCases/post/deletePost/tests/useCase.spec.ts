import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { IPostRepo } from 'src/modules/forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/forum/repos/utils/symbols';
import { IUserRepo } from 'src/modules/user/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/user/repos/utils/symbols';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { createStubPost } from '../../../tests/stubs/post.stub';
import { createStubUser } from '../../../tests/stubs/user.stub';
import { DeletePostErrors } from '../DeletePostErrors';
import { DeletePostUseCase } from '../DeletePostUseCase';
import { RequestData } from '../types';

describe('DeletePostUseCase', () => {
  let deletePostUseCase: DeletePostUseCase;
  let postRepo: IPostRepo;
  let userRepo: IUserRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletePostUseCase,
        {
          provide: PostRepoSymbol,
          useValue: {
            getPostByPostId: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: UserRepoSymbol,
          useValue: {
            getUserByUserId: jest.fn(),
          },
        },
        {
          provide: REQUEST,
          useValue: {
            user: {
              userId: '1',
            },
          },
        },
      ],
    }).compile();

    deletePostUseCase = module.get<DeletePostUseCase>(DeletePostUseCase);
    postRepo = module.get<IPostRepo>(PostRepoSymbol);
    userRepo = module.get<IUserRepo>(UserRepoSymbol);
  });

  it('should be defined', () => {
    expect(deletePostUseCase).toBeDefined();
  });

  describe('execute', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return error if user does not exist', async () => {
      const requestData: RequestData = { postId: 123 };

      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(null);

      const result = await deletePostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeletePostErrors.UserDoesntExistError);
    });

    it('should return error if post does not exist', async () => {
      const requestData: RequestData = { postId: 123 };

      const mockUser = createStubUser();
      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(mockUser);
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(null);

      const result = await deletePostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeletePostErrors.PostDoesntExistError);
    });

    it('should return error if user does not own the post', async () => {
      const requestData: RequestData = { postId: 123 };

      const userId = new UniqueEntityID(2);
      const mockPost = createStubPost(userId);
      const mockUser = createStubUser();
      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(mockUser);
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(mockPost);

      const result = await deletePostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeletePostErrors.UserDoesntOwnPostError);
    });

    it('should delete post successfully', async () => {
      const requestData: RequestData = { postId: 123 };

      const mockUser = createStubUser();
      const mockPost = createStubPost(mockUser.userId.getValue());
      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(mockUser);
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(mockPost);
      jest.spyOn(postRepo, 'save').mockResolvedValue(undefined);

      const result = await deletePostUseCase.execute(requestData);

      expect(result.isRight()).toBe(true);
      expect(postRepo.save).toHaveBeenCalledWith(mockPost);
    });
  });
});
