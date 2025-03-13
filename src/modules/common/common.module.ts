import { Module } from '@nestjs/common';
import { Provider } from 'src/shared/core/Provider';
import { AwsS3Service, AwsS3ServiceSymbol } from './AWS';

const AwsS3ServiceProvider = new Provider(AwsS3ServiceSymbol, AwsS3Service);

@Module({
  imports: [],
  controllers: [],
  providers: [AwsS3ServiceProvider],
  exports: [AwsS3ServiceProvider],
})
export class CommonModule {}
