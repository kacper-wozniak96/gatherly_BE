import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';

export interface IMailService {
  sendUserActivityReport(to: string, reportId: string, buffer: Buffer): Promise<void>;
}

export const MailServiceSymbol = Symbol('Mail_Service');

const OAuth2 = google.auth.OAuth2;

@Injectable()
export class MailService implements IMailService {
  constructor() {}

  private async createTransporter() {
    const oauth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'https://developers.google.com/oauthplayground');

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await oauth2Client.getAccessToken();

    console.log({ accessToken });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.toString(),
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
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log('Error sending email: ', error);
    }
  }
}
