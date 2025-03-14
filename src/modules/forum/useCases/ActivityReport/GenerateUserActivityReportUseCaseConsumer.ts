import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/modules/common/AWS';
import { FileServiceSymbol, IFileService } from 'src/modules/common/FileService/fileService';
import { IMailService, MailServiceSymbol } from 'src/modules/common/MailService/mailService';
import { EJobs } from 'src/shared/enums/Jobs';
import { EQueues } from 'src/shared/enums/Queues';
import { PDFService } from 'src/modules/forum/useCases/ActivityReport/pdfService';
import { IGenerateUserActivityReportJob } from 'src/shared/interfaces/Jobs/sendReport';

import * as nodemailer from 'nodemailer';

@Processor(EQueues.reports)
export class GenerateUserActivityReportUseCaseConsumer extends WorkerHost {
  constructor(
    @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
    @Inject(MailServiceSymbol) private readonly mailService: IMailService,
    @Inject(FileServiceSymbol) private readonly fileService: IFileService,
    private readonly pdfService: PDFService,
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

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'User Activity Report',
      text: 'Hello, here is your recent activity report.',
      html: '<p>Hello,</p><p>Here is your <strong>recent activity report</strong>.</p>',
      attachments: [
        {
          filename: `${reportId}.pdf`,
          content: fileContent,
        },
      ],
    };

    await this.awsS3Service.sendReport(reportId, fileContent);

    // await this.mailService.sendUserActivityReport(email, reportId, fileContent);
    await this.mailService.send(mailOptions);

    await this.fileService.deleteFile(abosoluteFilePath);
  }
}
