import { Comments } from 'src/forum/domain/comments';
import { Post, PostProps } from 'src/forum/domain/post';
import { PostBans } from 'src/forum/domain/postBans';
import { PostId } from 'src/forum/domain/postId';
import { PostText } from 'src/forum/domain/postText';
import { PostTitle } from 'src/forum/domain/postTitle';
import { PostVotes } from 'src/forum/domain/postVotes';
import { User } from 'src/user/domain/User';
import { UserId } from 'src/user/domain/UserId';
import { UserName } from 'src/user/domain/UserName';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';

export const createStubPost = (userIdAuthor?: UniqueEntityID): Post => {
  const postId = PostId.create(new UniqueEntityID()).getValue();
  const userId = UserId.create(userIdAuthor ? userIdAuthor : new UniqueEntityID(1)).getValue();

  const userName = UserName.create({ value: 'test-user' }).getValue() as UserName;

  const user = User.create({ username: userName }, userId.getValue()).getValue();
  const title = PostTitle.create({ value: 'Test Title' }).getValue();
  const text = PostText.create({ value: 'Test Content' }).getValue();
  const votes = PostVotes.create([]);
  const comments = Comments.create([]);
  const bans = PostBans.create([]);
  const createdAt = new Date();

  const postProps = {
    userId,
    user,
    title,
    text,
    votes,
    comments,
    bans,
    createdAt,
    isDeleted: false,
  } as PostProps;

  return Post.create(postProps, postId.getValue()).getValue();
};
