import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { PostMapper } from 'src/forum/mappers/Post';
import { IPostRepo } from 'src/forum/repos/postRepo';
import { PostRepoSymbol } from 'src/forum/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { createStubPost } from '../../../tests/stubs/post.stub';
import { GetPostsUseCase } from '../GetPostsUseCase';
import { RequestData } from '../types';

describe('GetPostsUseCase', () => {
  let getPostsUseCase: GetPostsUseCase;
  let postRepo: IPostRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPostsUseCase,
        {
          provide: PostRepoSymbol,
          useValue: {
            getPosts: jest.fn(),
            getPostsTotalCount: jest.fn(),
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

    getPostsUseCase = module.get<GetPostsUseCase>(GetPostsUseCase);
    postRepo = module.get<IPostRepo>(PostRepoSymbol);
  });

  it('should be defined', () => {
    expect(getPostsUseCase).toBeDefined();
  });

  describe('execute', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should get posts successfully', async () => {
      const requestData: RequestData = { offset: 0, search: 'test' };
      const mockPosts = [createStubPost()];
      const postsTotalCount = 1;

      jest.spyOn(postRepo, 'getPosts').mockResolvedValue(mockPosts);
      jest.spyOn(postRepo, 'getPostsTotalCount').mockResolvedValue(postsTotalCount);

      const result = await getPostsUseCase.execute(requestData);

      expect(result.isRight()).toBe(true);
      const postsDTO = mockPosts.map((post) => PostMapper.toDTO(post, 1));
      expect(result.value.getValue()).toEqual({ posts: postsDTO, postsTotalCount });
    });

    it('should return error for unexpected errors', async () => {
      const requestData: RequestData = { offset: 0, search: 'test' };

      jest.spyOn(postRepo, 'getPosts').mockRejectedValue(new Error('Unexpected error'));

      const result = await getPostsUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });
});
