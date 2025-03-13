import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EJobs } from 'src/shared/enums/Jobs';
import { EQueues } from 'src/shared/enums/Queues';
import { PDFService } from 'src/shared/infra/FileGenerator/pdfService';
import { FileService } from 'src/shared/infra/FileService/fileService';
import { IGenerateUserActivityReportJob } from 'src/shared/interfaces/Jobs/sendReport';

@Processor(EQueues.reports)
export class GenerateUserActivityReportUseCaseConsumer extends WorkerHost {
  constructor(
    // @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
    // @Inject(MailServiceSymbol) private readonly mailService: MailService,
    private readonly pdfService: PDFService,
    private readonly fileService: FileService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<void> {
    switch (job.name) {
      case EJobs.sendReport:
        return this.generateUserActivityReport(job);
    }
  }

  private async generateUserActivityReport(job: Job<IGenerateUserActivityReportJob, any, string>) {
    const { commentsCount, downvotesCount, email, postsCreatedCount, reportId, upvotesCount, userId, username } = job.data;

    const abosoluteFilePath = this.fileService.createPathToUploadsFolder(`${reportId}.pdf`);

    await this.pdfService.generateUserActivityReport(abosoluteFilePath, {
      reportId,
      username,
      userId,
      email,
      postsCreatedCount,
      downvotesCount,
      upvotesCount,
      commentsCount,
    });

    const fileContent = await this.fileService.readFile(abosoluteFilePath);

    // await this.awsS3Service.sendReport(reportId, fileContent);

    // await this.mailService.sendUserActivityReport(email, reportId, fileContent);

    await this.fileService.deleteFile(abosoluteFilePath);
  }
}
