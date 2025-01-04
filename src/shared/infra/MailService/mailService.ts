import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface IMailService {
  sendUserActivityReport(to: string, reportId: string, buffer: Buffer): Promise<void>;
}

export const MailServiceSymbol = Symbol('Mail_Service');

@Injectable()
export class MailService implements IMailService {
  constructor() {}

  private async createTransporter() {
    const transporter = nodemailer.createTransport({
      host: process.env.GMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    return transporter;
  }

  public async sendUserActivityReport(to: string, reportId: string, buffer: Buffer): Promise<void> {
    const transporter = await this.createTransporter();

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject: 'User Activity Report',
      text: 'Hello, here is your recent activity report.',
      html: '<p>Hello,</p><p>Here is your <strong>recent activity report</strong>.</p>',
      attachments: [
        {
          filename: `${reportId}.pdf`,
          content: buffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  }
}
