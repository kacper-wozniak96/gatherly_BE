import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { EBanType } from 'gatherly-types';
import { PostMapper } from 'src/modules/Forum/mappers/Post';
import { IPostBanRepo, PostBanRepoSymbol } from 'src/modules/Forum/repos/postBanRepo';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/shared/infra/AWS/s3client';
import { createStubPost } from '../../../tests/stubs/post.stub';
import { createStubPostBan } from '../../../tests/stubs/postBan.stub';
import { GetPostErrors } from '../GetPostErrors';
import { GetPostUseCase } from '../GetPostUseCase';
import { RequestData } from '../types';

describe('GetPostUseCase', () => {
  let getPostUseCase: GetPostUseCase;
  let postRepo: IPostRepo;
  let postBanRepo: IPostBanRepo;
  let awsS3Service: IAwsS3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPostUseCase,
        {
          provide: PostRepoSymbol,
          useValue: {
            getPostByPostId: jest.fn(),
          },
        },
        {
          provide: PostBanRepoSymbol,
          useValue: {
            getUserPostBans: jest.fn(),
          },
        },
        {
          provide: AwsS3ServiceSymbol,
          useValue: {
            getFileUrl: jest.fn(),
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

    getPostUseCase = module.get<GetPostUseCase>(GetPostUseCase);
    postRepo = module.get<IPostRepo>(PostRepoSymbol);
    postBanRepo = module.get<IPostBanRepo>(PostBanRepoSymbol);
    awsS3Service = module.get<IAwsS3Service>(AwsS3ServiceSymbol);
  });

  it('should be defined', () => {
    expect(getPostUseCase).toBeDefined();
  });

  describe('execute', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return error if post does not exist', async () => {
      const requestData: RequestData = { postId: 123 };

      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(null);

      const result = await getPostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(GetPostErrors.PostDoesntExistError);
    });

    it('should return error if user is banned from viewing post', async () => {
      const requestData: RequestData = { postId: 123 };

      const mockPost = createStubPost();
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(mockPost);
      jest.spyOn(postBanRepo, 'getUserPostBans').mockResolvedValue([createStubPostBan(EBanType.viewingPost)]);

      const result = await getPostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(GetPostErrors.UserBannedFromViewingPostError);
    });

    it('should get post successfully', async () => {
      const requestData: RequestData = { postId: 123 };

      const mockPost = createStubPost();
      jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(mockPost);
      jest.spyOn(postBanRepo, 'getUserPostBans').mockResolvedValue([]);
      jest.spyOn(awsS3Service, 'getFileUrl').mockResolvedValue('https://example.com/avatar.jpg');

      const result = await getPostUseCase.execute(requestData);

      expect(result.isRight()).toBe(true);
      const postDTO = PostMapper.toDTO(mockPost, 1);
      expect(result.value.getValue()).toEqual(postDTO);
    });
  });
});
