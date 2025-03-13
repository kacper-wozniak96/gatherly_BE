import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module, RequestMethod, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ForumModule } from './forum/forum.module';
import { LoggerMiddleware } from './modules/Logger/logger';
import { EQueues } from './shared/enums/Queues';
import { UserModule } from './user/user.module';
import { CommonModule } from './modules/common/common.module';

// class Provider {
//   provide: symbol;
//   useClass: Type;

//   constructor(provide: symbol, useClass: Type) {
//     this.provide = provide;
//     this.useClass = useClass;
//   }
// }

@Module({
  imports: [
    // JwtModule.register({
    //   global: true,
    //   secret: 'secret',
    //   signOptions: { expiresIn: '30 days' },
    // }),
    // ConfigModule.forRoot(),
    // BullModule.forRoot({
    //   connection: {
    //     host: process.env.REDIS_IP,
    //     port: Number(process.env.REDIS_PORT),
    //   },
    // }),
    // BullModule.registerQueue({
    //   name: EQueues.reports,
    // }),
    ForumModule,
    UserModule,
    CommonModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
