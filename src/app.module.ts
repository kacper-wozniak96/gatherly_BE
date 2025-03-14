import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ForumModule } from './modules/forum/forum.module';
import { JwtAuthGuard } from './modules/Auth/Auth.guard';
import { JwtStrategy } from './modules/Auth/strategies/jwt.strategy';
import { CommonModule } from './modules/common/common.module';
import { LoggerMiddleware } from './modules/Logger/logger';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    ForumModule,
    UserModule,
    CommonModule,
  ],
  providers: [
    JwtService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
