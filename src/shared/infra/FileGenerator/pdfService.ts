// src/shared/infra/services/pdfService.ts
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

    doc.image(`${basePath}/assests/home.jpg`, x, 0, { fit: [imageWidth, imageHeight], align: 'center', valign: 'center' });

    doc
      .fontSize(12)
      .text(
        'Below you will find a summary of your activity on the Gatherly app. This report includes details such as the number of posts you have created and also the number of upvotes, downvotes, comments you have made so far.',
        undefined,
        310,
        { align: 'justify' },
      );
    doc.moveDown();
    doc.moveDown();
    doc.fontSize(10).text(`Report identifier: ${reportData.reportId}`, { align: 'left' });
    doc.moveDown();
    doc.fontSize(10).text(`Date the report was generated: ${format(new Date(), 'dd-MM-yyyy H:mm')}`, { align: 'left' });
    doc.moveDown();
    doc.fontSize(10).text(`User identifier: ${reportData.userId}`, { align: 'left' });
    doc.moveDown();
    doc.fontSize(10).text(`Username: ${reportData.username}`, { align: 'left' });
    doc.moveDown();
    doc.fontSize(10).text(`Report sent to: ${reportData.email}`, { align: 'left' });
    doc.moveDown();
    doc.fontSize(10).text(`Number of posts created: ${reportData.postsCreatedCount}`, { align: 'left' });
    doc.moveDown();
    doc.fontSize(10).text(`Number of downvotes: ${reportData.downvotesCount}`, { align: 'left' });
    doc.moveDown();
    doc.fontSize(10).text(`Number of upvotes: ${reportData.upvotesCount}`, { align: 'left' });
    doc.moveDown();
    doc.fontSize(10).text(`Number of comments: ${reportData.commentsCount}`, { align: 'left' });
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc
      .fontSize(12)
      .text(
        'Keep up the great work and continue to engage with the community. Your contributions make Gatherly a vibrant and valuable platform for everyone!!!',
        { align: 'justify' },
      );

    doc.end();

    // Wait for the PDF to be fully written to the file
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
  }
}
