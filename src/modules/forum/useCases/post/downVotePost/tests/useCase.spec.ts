import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { EBanType } from 'gatherly-types';
import { PostService } from 'src/modules/forum/domain/services/PostService';
import { IPostBanRepo, PostBanRepoSymbol } from 'src/modules/forum/repos/postBanRepo';
import { IPostRepo } from 'src/modules/forum/repos/postRepo';
import { IPostVoteRepo } from 'src/modules/forum/repos/postVoteRepo';
import { PostRepoSymbol, PostVoteRepoSymbol } from 'src/modules/forum/repos/utils/symbols';
import { IUserRepo } from 'src/modules/user/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/user/repos/utils/symbols';
import { right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { createStubPost } from '../../../tests/stubs/post.stub';
import { createStubPostBan } from '../../../tests/stubs/postBan.stub';
import { createStubUser } from '../../../tests/stubs/user.stub';
import { DownVotePostErrors } from '../DownVotePostErrors';
import { DownVotePostUseCase } from '../DownVotePostUseCase';
import { RequestData } from '../types';

describe('DownVotePostUseCase', () => {
  let downVotePostUseCase: DownVotePostUseCase;
  let postRepo: IPostRepo;
  let userRepo: IUserRepo;
  let postVoteRepo: IPostVoteRepo;
  let postBanRepo: IPostBanRepo;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DownVotePostUseCase,
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

    downVotePostUseCase = module.get<DownVotePostUseCase>(DownVotePostUseCase);
    postRepo = module.get<IPostRepo>(PostRepoSymbol);
    userRepo = module.get<IUserRepo>(UserRepoSymbol);
    postVoteRepo = module.get<IPostVoteRepo>(PostVoteRepoSymbol);
    postBanRepo = module.get<IPostBanRepo>(PostBanRepoSymbol);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(downVotePostUseCase).toBeDefined();
  });

  describe('execute', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return error if user does not exist', async () => {
      const requestData: RequestData = { postId: 123 };

      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(null);

      const result = await downVotePostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DownVotePostErrors.UserDoesntExistError);
    });

    it('should return error if post does not exist', async () => {
      const requestData: RequestData = { postId: 123 };

      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(createStubUser());
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(null);

      const result = await downVotePostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DownVotePostErrors.PostDoesntExistError);
    });

    it('should return error if user is banned from voting', async () => {
      const requestData: RequestData = { postId: 123 };

      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(createStubUser());
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(createStubPost());
      jest.spyOn(postBanRepo, 'getUserPostBans').mockResolvedValue([createStubPostBan(EBanType.downVotingAndUpVoting)]);

      const result = await downVotePostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DownVotePostErrors.UserBannedFromVotingError);
    });

    it('should downvote post successfully', async () => {
      const requestData: RequestData = { postId: 123 };

      const mockUser = createStubUser();
      const mockPost = createStubPost();
      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(mockUser);
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(mockPost);
      jest.spyOn(postBanRepo, 'getUserPostBans').mockResolvedValue([]);
      jest.spyOn(postVoteRepo, 'getVotesForPostByUserId').mockResolvedValue([]);
      jest.spyOn(postService, 'downvotePost').mockReturnValue(right(Result.ok<void>()));
      jest.spyOn(postRepo, 'save').mockResolvedValue(undefined);

      const result = await downVotePostUseCase.execute(requestData);

      expect(result.isRight()).toBe(true);
      expect(postRepo.save).toHaveBeenCalledWith(mockPost);
    });
  });
});
