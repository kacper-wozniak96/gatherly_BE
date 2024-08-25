import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

export interface IAwsS3Service {
  sendFile(key: string, buffer: Buffer): Promise<void>;
  deleteFile(key: string): Promise<void>;
}

export const AwsS3ServiceSymbol = Symbol('AWS_S3_Service');

@Injectable()
export class AwsS3Service implements IAwsS3Service {
  private s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_S3_REGION,
  });

  public async sendFile(key: string, buffer: Buffer) {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
      Key: key,
      Body: buffer,
    });

    await this.s3Client.send(command);
  }

  public async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
      Key: key,
    });

    await this.s3Client.send(command);
  }
}
