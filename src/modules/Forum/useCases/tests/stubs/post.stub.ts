import { Comments } from 'src/modules/Forum/domain/comments';
import { Post, PostProps } from 'src/modules/Forum/domain/post';
import { PostBans } from 'src/modules/Forum/domain/postBans';
import { PostId } from 'src/modules/Forum/domain/postId';
import { PostText } from 'src/modules/Forum/domain/postText';
import { PostTitle } from 'src/modules/Forum/domain/postTitle';
import { PostVotes } from 'src/modules/Forum/domain/postVotes';
import { User } from 'src/modules/User/domain/User';
import { UserId } from 'src/modules/User/domain/UserId';
import { UserName } from 'src/modules/User/domain/UserName';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';

export const createStubPost = (): Post => {
  const postId = PostId.create(new UniqueEntityID()).getValue();
  const userId = UserId.create(new UniqueEntityID()).getValue();

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
