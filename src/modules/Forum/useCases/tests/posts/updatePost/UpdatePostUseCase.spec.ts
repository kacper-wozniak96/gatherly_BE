import { Test, TestingModule } from '@nestjs/testing';

import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { IUserRepo } from 'src/modules/User/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/User/repos/utils/symbols';
import { UpdatePostUseCaseData } from '../../../post/updatePost/UpdatePostDTO';
import { UpdatePostErrors } from '../../../post/updatePost/UpdatePostErrors';
import { UpdatePostUseCase } from '../../../post/updatePost/UpdatePostUseCase';
import { createStubPost } from '../../stubs/post.stub';
import { createStubUser } from '../../stubs/user.stub';

describe('UpdatePostUseCase', () => {
  let useCase: UpdatePostUseCase;
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
          provide: 'REQUEST',
          useValue: {
            user: {
              userId: '1',
            },
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdatePostUseCase>(UpdatePostUseCase);
    postRepo = module.get<IPostRepo>(PostRepoSymbol);
    userRepo = module.get<IUserRepo>(UserRepoSymbol);
  });

  it('should update post successfully', async () => {
    const updatePostDTO: UpdatePostUseCaseData = { postId: 1, title: 'New Title', text: 'New Content' };

    const post = createStubPost();
    const user = createStubUser();

    jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(post);
    jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(user);
    jest.spyOn(postRepo, 'save').mockResolvedValue();

    const result = await useCase.execute(updatePostDTO);

    expect(result.isRight()).toBe(true);
    expect(postRepo.save).toHaveBeenCalledWith(post);
    expect(post.title.value).toBe('New Title');
    expect(post.text.value).toBe('New Content');
  });

  it('should return PostDoesntExistError if post not found', async () => {
    const updatePostDTO: UpdatePostUseCaseData = { postId: 1, title: 'New Title', text: 'New Content' };

    jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(null);

    const result = await useCase.execute(updatePostDTO);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UpdatePostErrors.PostDoesntExistError);
  });

  it('should return UserDoesntExistError if user not found', async () => {
    const updatePostDTO: UpdatePostUseCaseData = { postId: 1, title: 'New Title', text: 'New Content' };

    const post = createStubPost();

    jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(post);
    jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(null);

    const result = await useCase.execute(updatePostDTO);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UpdatePostErrors.UserDoesntExistError);
  });

  it('should return InvalidDataError if title is invalid', async () => {
    const updatePostDTO: UpdatePostUseCaseData = { postId: 1, title: '', text: 'New Content' };

    const post = createStubPost();
    const user = createStubUser();

    jest.spyOn(postRepo, 'getPostByPostId').mockResolvedValue(post);
    jest.spyOn(userRepo, 'getUserByUserId').mockResolvedValue(user);

    const result = await useCase.execute(updatePostDTO);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UpdatePostErrors.InvalidDataError);
  });
});
