import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppError } from 'src/shared/core/AppError';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { IFailedField } from 'src/utils/FailedField';
import { UpdatePostUseCaseSymbol } from '../../../post/utils/symbols';
import { UpdatePostController } from '../../../post/updatePost/UpdatePostController';
import { UpdatePostRequestDTO } from '../../../post/updatePost/UpdatePostDTO';
import { UpdatePostErrors } from '../../../post/updatePost/UpdatePostErrors';
import { UpdatePostUseCase } from '../../../post/updatePost/UpdatePostUseCase';

describe('UpdatePostController', () => {
  let controller: UpdatePostController;
  let useCase: UpdatePostUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdatePostController],
      providers: [
        {
          provide: UpdatePostUseCaseSymbol,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UpdatePostController>(UpdatePostController);
    useCase = module.get<UpdatePostUseCase>(UpdatePostUseCaseSymbol);
  });

  it('should update post successfully', async () => {
    const updatePostDTO: UpdatePostRequestDTO = { title: 'New Title', text: 'New Content' };
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(right(Result.ok<void>()));

    await expect(controller.updatePost(postId, updatePostDTO)).resolves.toBeUndefined();
  });

  it('should throw NotFoundException if post does not exist', async () => {
    const updatePostDTO: UpdatePostRequestDTO = { title: 'New Title', text: 'New Content' };
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new UpdatePostErrors.PostDoesntExistError()));

    await expect(controller.updatePost(postId, updatePostDTO)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const updatePostDTO: UpdatePostRequestDTO = { title: 'New Title', text: 'New Content' };
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new UpdatePostErrors.UserDoesntExistError()));

    await expect(controller.updatePost(postId, updatePostDTO)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if data is invalid', async () => {
    const updatePostDTO: UpdatePostRequestDTO = { title: 'New Title', text: 'New Content' };
    const postId = 1;
    const failedFields: IFailedField[] = [{ message: 'Invalid title', field: 'title' }];

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new UpdatePostErrors.InvalidDataError(failedFields)));

    await expect(controller.updatePost(postId, updatePostDTO)).rejects.toThrow(BadRequestException);
  });

  it('should throw InternalServerErrorException for other errors', async () => {
    const updatePostDTO: UpdatePostRequestDTO = { title: 'New Title', text: 'New Content' };
    const postId = 1;

    jest.spyOn(useCase, 'execute').mockResolvedValue(left(new AppError.UnexpectedError()));

    await expect(controller.updatePost(postId, updatePostDTO)).rejects.toThrow(InternalServerErrorException);
  });
});
