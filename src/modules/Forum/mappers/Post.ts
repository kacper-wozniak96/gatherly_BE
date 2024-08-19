import { Post as PrismaPost, PostVote as PrismaPostVote, User as PrismaUser } from '@prisma/client';
import { UserId } from 'src/modules/User/domain/UserId';
import { UserMapper } from 'src/modules/User/mappers/User';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { Post } from '../domain/post';
import { PostText } from '../domain/postText';
import { PostTitle } from '../domain/postTitle';
import { EVoteType } from '../domain/postVote';
import { PostDTO } from '../dtos/post';
import { PostVoteMapper } from './PostVote';

export class PostMapper {
  public static toDomain(raw: PrismaPost & { User: PrismaUser; PostVote: PrismaPostVote[] }, requestUserId?: number): Post {
    const postTitleOrError = PostTitle.create({ value: raw.Title });
    const postTextOrError = PostText.create({ value: raw.Text });
    const userIdOrError = UserId.create(new UniqueEntityID(raw.UserId));

    const user = UserMapper.toDomain(raw.User);
    const votes = raw.PostVote.map((vote) => PostVoteMapper.toDomain(vote));

    const postOrError = Post.create(
      {
        title: postTitleOrError.getValue() as PostTitle,
        text: postTextOrError.getValue() as PostText,
        userId: userIdOrError.getValue(),
        user: user,
        downVotesTotal: votes?.filter((vote) => vote.type === EVoteType.DOWNVOTE)?.length ?? 0,
        upVotesTotal: votes?.filter((vote) => vote.type === EVoteType.UPVOTE)?.length ?? 0,
        isDownVotedByUser:
          votes?.some((vote) => vote.userId.getValue().toValue() === requestUserId && vote.type === EVoteType.DOWNVOTE) ?? false,
        isUpVotedByUser:
          votes?.some((vote) => vote.userId.getValue().toValue() === requestUserId && vote.type === EVoteType.UPVOTE) ?? false,
      },
      new UniqueEntityID(raw?.Id),
    );

    return postOrError.isSuccess ? postOrError.getValue() : null;
  }

  public static toPersistance(post: Post): any {
    return {
      Title: post.title.value,
      Text: post.text.value,
      User: { connect: { Id: post.userId.getValue().toValue() } },
    };
  }

  public static toDTO(post: Post): PostDTO {
    return {
      id: post.id.toValue() as number,
      title: post.title.value,
      text: post.text.value,
      user: {
        id: post.userId.getValue().toValue() as number,
        username: post.userId.getValue().toValue() as string,
      },
      upVotesTotal: post.upVotesTotal,
      downVotesTotal: post.downVotesTotal,
      isUpVotedByUser: post.isUpVotedByUser,
      isDownVotedByUser: post.isDownVotedByUser,
    };
  }
}
