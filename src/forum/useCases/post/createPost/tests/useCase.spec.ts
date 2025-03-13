import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { IPostRepo } from 'src/forum/repos/postRepo';
import { PostRepoSymbol } from 'src/forum/repos/utils/symbols';
import { IUserRepo } from 'src/user/repos/userRepo';
import { UserRepoSymbol } from 'src/user/repos/utils/symbols';
import { createStubUser } from '../../../tests/stubs/user.stub';
import { CreatePostErrors } from '../CreatePostErrors';
import { CreatePostUseCase } from '../CreatePostUseCase';
import { RequestData } from '../types';

describe('CreatePostUseCase', () => {
  let createPostUseCase: CreatePostUseCase;
  let postRepo: IPostRepo;
  let userRepo: IUserRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostUseCase,
        {
          provide: PostRepoSymbol,
          useValue: {
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

    createPostUseCase = module.get<CreatePostUseCase>(CreatePostUseCase);
    postRepo = module.get<IPostRepo>(PostRepoSymbol);
    userRepo = module.get<IUserRepo>(UserRepoSymbol);
  });

  it('should be defined', () => {
    expect(createPostUseCase).toBeDefined();
  });

  describe('execute', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return error if title is invalid', async () => {
      const requestData: RequestData = { dto: { title: '', text: 'Some text' } };

      const result = await createPostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(CreatePostErrors.InvalidDataError);
    });

    it('should return error if user does not exist', async () => {
      const requestData: RequestData = { dto: { title: 'Valid Title', text: 'Valid Text' } };

      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(null);

      const result = await createPostUseCase.execute(requestData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(CreatePostErrors.UserDoesntExistError);
    });

    it('should create post successfully', async () => {
      const requestData: RequestData = { dto: { title: 'Valid Title', text: 'Valid Text' } };

      const mockUser = createStubUser();
      jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(mockUser);
      jest.spyOn(postRepo, 'save').mockResolvedValue(undefined);

      const result = await createPostUseCase.execute(requestData);

      expect(result.isRight()).toBe(true);
      expect(postRepo.save).toHaveBeenCalled();
    });
  });
});
