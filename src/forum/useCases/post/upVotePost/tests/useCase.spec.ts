import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { EBanType } from 'gatherly-types';
import { PostService } from 'src/forum/domain/services/PostService';
import { IPostBanRepo, PostBanRepoSymbol } from 'src/forum/repos/postBanRepo';
import { IPostRepo } from 'src/forum/repos/postRepo';
import { IPostVoteRepo } from 'src/forum/repos/postVoteRepo';
import { PostRepoSymbol, PostVoteRepoSymbol } from 'src/forum/repos/utils/symbols';
import { IUserRepo } from 'src/user/repos/userRepo';
import { UserRepoSymbol } from 'src/user/repos/utils/symbols';
import { right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { createStubPost } from '../../../tests/stubs/post.stub';
import { createStubPostBan } from '../../../tests/stubs/postBan.stub';
import { createStubUser } from '../../../tests/stubs/user.stub';
import { RequestData } from '../types';
import { UpVotePostErrors } from '../UpVotePostErrors';
import { UpVotePostUseCase } from '../UpVotePostUseCase';

describe('UpVotePostUseCase', () => {
  let upVotePostUseCase: UpVotePostUseCase;
  let postRepo: IPostRepo;
  let userRepo: IUserRepo;
  let postVoteRepo: IPostVoteRepo;
  let postBanRepo: IPostBanRepo;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpVotePostUseCase,
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
          provide: PostVoteRepoSymbol,
          useValue: {
            getVotesForPostByUserId: jest.fn(),
          },
        },
        {
          provide: PostBanRepoSymbol,
          useValue: {
            getUserPostBans: jest.fn(),
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
        PostService,
      ],
    }).compile();

    upVotePostUseCase = module.get<UpVotePostUseCase>(UpVotePostUseCase);
    postRepo = module.get<IPostRepo>(PostRepoSymbol);
    userRepo = module.get<IUserRepo>(UserRepoSymbol);
    postVoteRepo = module.get<IPostVoteRepo>(PostVoteRepoSymbol);
    postBanRepo = module.get<IPostBanRepo>(PostBanRepoSymbol);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(upVotePostUseCase).toBeDefined();
  });

  describe('execute', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return error if user does not exist', async () => {
      const requestData: RequestData = { postId: 123 };

      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(null);

      const result = await upVotePostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpVotePostErrors.UserDoesntExistError);
    });

    it('should return error if post does not exist', async () => {
      const requestData: RequestData = { postId: 123 };

      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(createStubUser());
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(null);

      const result = await upVotePostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpVotePostErrors.PostDoesntExistError);
    });

    it('should return error if user is banned from voting', async () => {
      const requestData: RequestData = { postId: 123 };

      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(createStubUser());
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(createStubPost());
      jest.spyOn(postBanRepo, 'getUserPostBans').mockResolvedValue([createStubPostBan(EBanType.downVotingAndUpVoting)]);

      const result = await upVotePostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpVotePostErrors.UserBannedFromVotingError);
    });

    it('should upvote post successfully', async () => {
      const requestData: RequestData = { postId: 123 };

      const mockUser = createStubUser();
      const mockPost = createStubPost();
      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(mockUser);
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(mockPost);
      jest.spyOn(postBanRepo, 'getUserPostBans').mockResolvedValue([]);
      jest.spyOn(postVoteRepo, 'getVotesForPostByUserId').mockResolvedValue([]);
      jest.spyOn(postService, 'upvotePost').mockReturnValue(right(Result.ok<void>()));
      jest.spyOn(postRepo, 'save').mockResolvedValue(undefined);

      const result = await upVotePostUseCase.execute(requestData);

      expect(result.isRight()).toBe(true);
      expect(postRepo.save).toHaveBeenCalledWith(mockPost);
    });
  });
});
