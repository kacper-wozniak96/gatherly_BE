import { Post as PrismaPost, PostComment as PrismaPostComment, PostVote as PrismaPostVote, User as PrismaUser } from '@prisma/client';
import { UserId } from 'src/user/domain/UserId';
import { UserMapper } from 'src/user/mappers/User';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { Comments } from '../domain/comments';
import { Post } from '../domain/post';
import { PostText } from '../domain/postText';
import { PostTitle } from '../domain/postTitle';
import { PostVotes } from '../domain/postVotes';
import { PostDTO } from '../dtos/post';
import { CommentMapper } from './Comment';
import { PostVoteMapper } from './PostVote';

export class PostMapper {
  public static toDomain(
    raw: PrismaPost & { User: PrismaUser; PostVote: PrismaPostVote[]; PostComment: (PrismaPostComment & { User: PrismaUser })[] },
  ): Post {
    const postTitleOrError = PostTitle.create({ value: raw.Title });
    const postTextOrError = PostText.create({ value: raw.Text });
    const userIdOrError = UserId.create(new UniqueEntityID(raw.UserId));

    const user = UserMapper.toDomain(raw.User);
    const votes = PostVotes.create(raw.PostVote.map((vote) => PostVoteMapper.toDomain(vote)));
    const comments = Comments.create(raw.PostComment.map((comment) => CommentMapper.toDomain(comment)));

    const postOrError = Post.create(
      {
        title: postTitleOrError.getValue() as PostTitle,
        text: postTextOrError.getValue() as PostText,
        userId: userIdOrError.getValue(),
        user: user,
        createdAt: raw.CreatedAt,
        votes: votes,
        comments: comments,
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
      CreatedAt: post.createdAt,
    };
  }

  public static toDTO(post: Post, requestUserId: number): PostDTO {
    return {
      id: post.id.toValue() as number,
      title: post.title.value,
      text: post.text.value,
      user: UserMapper.toDTO(post.user),
      upVotesTotalNumber: post.votes.getUpVotesTotal(),
      downVotesTotalNumber: post.votes.getDownVotesTotal(),
      isUpVotedByUser: post.votes.isUpVotedByUser(requestUserId),
      isDownVotedByUser: post.votes.isDownvotedByUser(requestUserId),
      createdAt: post.createdAt,
      postCommentsTotalNumber: post.comments.getCommentsTotalNumber(),
      comments: post.comments.getItems().map((comment) => CommentMapper.toDTO(comment)),
    };
  }
}
