export interface IGenerateUserActivityReportJob {
  reportId: string;
  username: string;
  userId: number;
  email: string;
  postsCreatedCount: number;
  downvotesCount: number;
  upvotesCount: number;
  commentsCount: number;
}
