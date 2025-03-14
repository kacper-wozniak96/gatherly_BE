import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface IMailService {
  send(payload: nodemailer.SendMailOptions): Promise<void>;
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

  public async send(payload: nodemailer.SendMailOptions): Promise<void> {
    const transporter = await this.createTransporter();

    await transporter.sendMail(payload);
  }
}
