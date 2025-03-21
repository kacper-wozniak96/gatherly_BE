import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';

interface UserActivityReportData {
  reportId: string;
  username: string;
  userId: number;
  email: string;
  postsCreatedCount: number;
  downvotesCount: number;
  upvotesCount: number;
  commentsCount: number;
}

@Injectable()
export class PDFService {
  async generateUserActivityReport(filePathToSave: string, reportData: UserActivityReportData): Promise<void> {
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePathToSave);

    doc.pipe(writeStream);

    const basePath = process.cwd() + `/src/utils`;
    const pageWidth = doc.page.width;
    const imageWidth = 300;
    const imageHeight = 300;
    const x = (pageWidth - imageWidth) / 2;

    doc.fontSize(20).text('User Activity Report', { align: 'center', underline: true }).moveDown(10);

    doc.image(`${basePath}/assests/home.jpg`, x, 50, { fit: [imageWidth, imageHeight], align: 'center', valign: 'center' });

    doc
      .fontSize(12)
      .text(
        'Below you can find a summary of your activity on the Gatherly app. This report includes details such as the number of posts you have created and also the number of upvotes, downvotes, comments you have made so far.',
        { align: 'justify', indent: 30, height: 100 },
      )
      .moveDown(2);

    const details = [
      `Report identifier: ${reportData.reportId}`,
      `Date the report was generated: ${format(new Date(), 'dd-MM-yyyy H:mm')}`,
      `User identifier: ${reportData.userId}`,
      `Username: ${reportData.username}`,
      `Report sent to: ${reportData.email}`,
      `Number of posts created: ${reportData.postsCreatedCount}`,
      `Number of downvotes: ${reportData.downvotesCount}`,
      `Number of upvotes: ${reportData.upvotesCount}`,
      `Number of comments: ${reportData.commentsCount}`,
    ];

    doc.fontSize(12).text('Report Details:', { align: 'left', indent: 30 }).moveDown(1);

    details.forEach((detail) => {
      doc.fontSize(10).text(`• ${detail}`, { align: 'left', indent: 40 }).moveDown(0.5);
    });

    doc
      .moveDown(2)
      .fontSize(12)
      .text(
        'Keep up the great work and continue to engage with the community. Your contributions make Gatherly a vibrant and valuable platform for everyone!!!',
        { align: 'justify', indent: 30 },
      );

    doc.moveDown(2).fontSize(10).text('Generated by Gatherly', { align: 'center' });

    doc.end();

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
  }
}
