import { PostVote as PrismaPostVote } from '@prisma/client';
import { UserId } from 'src/modules/User/domain/UserId';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { PostId } from '../domain/postId';
import { PostVote } from '../domain/postVote';

export class PostVoteMapper {
  public static toDomain(raw: PrismaPostVote): PostVote {
    const postIdOrError = PostId.create(new UniqueEntityID(raw.PostId));
    const userIdOrError = UserId.create(new UniqueEntityID(raw.UserId));

    const postVoteOrError = PostVote.create(
      {
        postId: postIdOrError.getValue(),
        userId: userIdOrError.getValue(),
        type: raw.VoteId,
      },
      new UniqueEntityID(raw?.Id),
    );

    return postVoteOrError.isSuccess ? postVoteOrError.getValue() : null;
  }

  public static toPersistance() {}
  public static toDTO() {}
}
