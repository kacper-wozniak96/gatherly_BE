import { Module } from '@nestjs/common';
import { Provider } from 'src/shared/core/Provider';
import { AwsS3Service, AwsS3ServiceSymbol } from './AWS';
import { MailService, MailServiceSymbol } from './MailService/mailService';
import { FileService, FileServiceSymbol } from './FileService/fileService';

const AwsS3ServiceProvider = new Provider(AwsS3ServiceSymbol, AwsS3Service);
const MailServiceProvider = new Provider(MailServiceSymbol, MailService);
const FileServiceProvider = new Provider(FileServiceSymbol, FileService);

@Module({
  imports: [],
  controllers: [],
  providers: [AwsS3ServiceProvider, MailServiceProvider, FileServiceProvider],
  exports: [AwsS3ServiceProvider, MailServiceProvider, FileServiceProvider],
})
export class CommonModule {}
