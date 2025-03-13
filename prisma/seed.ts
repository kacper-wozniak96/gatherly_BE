import { BanType, Post, PostComment, PostVote, PrismaClient, User, Vote } from '@prisma/client';
import { banType } from './staticData/postBan';
import { user } from './staticData/user';
import { vote } from './staticData/voteType';
import { post } from './staticData/post';
import { postVote } from './staticData/postVote';
import { postComment } from './staticData/postComment';

const prisma = new PrismaClient();

async function main() {
  await seed<Vote>(vote, 'vote', 'Id');
  await seed<BanType>(banType, 'banType', 'Id');
  await seed<User>(user, 'user', 'Id');
  await seed<Post>(post, 'post', 'Id');
  await seed<PostVote>(postVote, 'postVote', 'Id');
  await seed<PostComment>(postComment, 'postComment', 'Id');
}

main()
  .then(() => console.log('Seed completed'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());

async function seed<T>(array: Partial<T>[], operation: string, whereBy?: string) {
  if (process.env.SKIP_SEED === 'true') return;
  console.log(operation);
  const parentObject = prisma[operation];
  if (!parentObject) throw `Operation: ${operation} not exists in object of prisma`;
  let index = 0;
  for (let i = 0; i < array.length; i++) {
    index = i;
    try {
      if (!whereBy) {
        await parentObject?.upsert({
          where: { Id: i + 1 },
          update: {},
          create: {
            ...array[i],
          },
        });
      } else {
        await parentObject?.upsert({
          where: { [whereBy]: array[i][whereBy] },
          update: {},
          create: {
            ...array[i],
          },
        });
      }
    } catch (e) {
      console.log('/////////////////////////////');
      console.log('/////////////////////////////');
      console.error(array[index], e, operation);
      console.log('/////////////////////////////');
      console.log('/////////////////////////////');
    }
  }
}
