import { Test, TestingModule } from '@nestjs/testing';

import { REQUEST } from '@nestjs/core';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { IUserRepo } from 'src/modules/User/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/User/repos/utils/symbols';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { createStubPost } from '../../../tests/stubs/post.stub';
import { createStubUser } from '../../../tests/stubs/user.stub';
import { RequestData } from '../types';
import { UpdatePostErrors } from '../UpdatePostErrors';
import { UpdatePostUseCase } from '../UpdatePostUseCase';

describe('UpdatePostUseCase', () => {
  let updatePostUseCase: UpdatePostUseCase;
  let postRepo: IPostRepo;
  let userRepo: IUserRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePostUseCase,
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

    updatePostUseCase = module.get<UpdatePostUseCase>(UpdatePostUseCase);
    postRepo = module.get<IPostRepo>(PostRepoSymbol);
    userRepo = module.get<IUserRepo>(UserRepoSymbol);
  });

  it('should be defined', () => {
    expect(updatePostUseCase).toBeDefined();
  });

  describe('execute', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return error if post does not exist', async () => {
      const requestData: RequestData = { postId: 123, dto: { title: 'Test title' } };

      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(null);

      const result = await updatePostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdatePostErrors.PostDoesntExistError);
    });

    it('should return error if user does not exist', async () => {
      const requestData: RequestData = { postId: 123, dto: { text: 'Test text' } };

      const mockPost = createStubPost();
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(mockPost);
      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(null);

      const result = await updatePostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdatePostErrors.UserDoesntExistError);
    });

    it('should return error if user is not the post author', async () => {
      const requestData: RequestData = {
        postId: 123,
        dto: { title: 'Updated Post Title', text: '' },
      };

      const userId = new UniqueEntityID(2);
      const mockPost = createStubPost(userId);
      const mockUser = createStubUser();

      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(mockPost);
      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(mockUser);

      const result = await updatePostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdatePostErrors.UserIsNotPostAuthorError);
    });

    it('should return error if title is invalid', async () => {
      const requestData: RequestData = { postId: 123, dto: { title: '', text: 'Some text' } };

      const mockPost = createStubPost();
      const mockUser = createStubUser();
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(mockPost);
      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(mockUser);

      const result = await updatePostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdatePostErrors.InvalidDataError);
    });

    it('should update post title successfully', async () => {
      const requestData: RequestData = {
        postId: 123,
        dto: { title: 'Updated Title', text: '' },
      };

      const mockPost = createStubPost();
      const mockUser = createStubUser();
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(mockPost);
      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(mockUser);
      jest.spyOn(postRepo, 'save').mockResolvedValue(undefined);

      const result = await updatePostUseCase.execute(requestData);

      expect(result.isRight()).toBe(true);
      expect(mockPost.title.value).toBe('Updated Title');
      expect(postRepo.save).toHaveBeenCalledWith(mockPost);
    });
  });
});
