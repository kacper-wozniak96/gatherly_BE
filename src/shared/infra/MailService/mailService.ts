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
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
      },
    });

    return transporter;
  }

  public async sendUserActivityReport(to: string, reportId: string, buffer: Buffer): Promise<void> {
    const transporter = await this.createTransporter();

    const mailOptions = {
      from: process.env.GMAIL_USER, // Sender address
      to, // List of recipients
      subject: 'User Activity Report', // Subject line
      text: 'Hello, here is your recent activity report.', // Plain text body
      html: '<p>Hello,</p><p>Here is your <strong>recent activity report</strong>.</p>', // HTML body
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
