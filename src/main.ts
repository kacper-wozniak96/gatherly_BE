import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log({ JWT_SECRET: process.env.JWT_SECRET });
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: [process.env.ORIGIN],
  //   credentials: true,
  // });
  app.enableCors();
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
