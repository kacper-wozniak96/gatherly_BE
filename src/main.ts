import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log({ JWT_SECRET: process.env.JWT_SECRET });
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://react-app-kw.s3-website.eu-north-1.amazonaws.com'],
    credentials: true,
    allowedHeaders: 'Authorization, Content-Type',
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
