import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EQueues } from 'src/shared/enums/Queues';
import { LogoutUserController } from './useCases/Logout/LogoutUserController';
import { UserCreateController } from './useCases/CreateUser/CreateUserController';
import { LoginUserController } from './useCases/Login/LoginUserController';
import { GetUserController } from './useCases/getUser/GetUserController';
// import { GenerateUserActivityReportController } from './useCases/GenerateUserActivityReport/GenerateUserActivityReportController';
import { UpdateUserController } from './useCases/UpdateUser/UpdateUserController';
import { GetUsersController } from './useCases/getUsers/GetUserController';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/modules/AuthModule/Auth.service';
import { JwtStrategy } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/modules/AuthModule/Auth.guard';
import { Provider } from 'src/shared/core/Provider';
import { UserRepoSymbol } from './repos/utils/symbols';
import { UserRepo } from './repos/implementations/userRepo';
import {
  CreateUserUseCaseSymbol,
  // GenerateUserActivityReportUseCaseSymbolConsumer,
  // GenerateUserActivityReportUseCaseSymbolProvider,
  GetUsersUseCaseSymbol,
  GetUserUseCaseSymbol,
  LoginUserUseCaseSymbol,
  UpdateUserUseCaseSymbol,
} from './utils/symbols';
import { CreateUserUseCase } from './useCases/CreateUser/CreateUserUseCase';
import { LoginUserUseCase } from './useCases/Login/LoginUserUseCase';
import { GetUserUseCase } from './useCases/getUser/GetUserUseCase';
import { UpdateUserUseCase } from './useCases/UpdateUser/UpdateUserUseCase';
// import { GenerateUserActivityReportUseCaseProvider } from './useCases/GenerateUserActivityReport/GenerateUserActivityReportUseCase';
// import { GenerateUserActivityReportUseCaseConsumer } from './useCases/GenerateUserActivityReport/GenerateUserActivityReportUseCaseConsumer';
import { GetUsersUseCase } from './useCases/getUsers/GetUserUseCase';
import { ForumModule } from 'src/forum/forum.module';
import { CommonModule } from 'src/modules/common/common.module';

const userRepoProvider = new Provider(UserRepoSymbol, UserRepo);
const createUserUseCaseProvider = new Provider(CreateUserUseCaseSymbol, CreateUserUseCase);
const loginUserUseCaseProvider = new Provider(LoginUserUseCaseSymbol, LoginUserUseCase);
const getUserUseCaseProvider = new Provider(GetUserUseCaseSymbol, GetUserUseCase);
const updateUserUseCaseProvider = new Provider(UpdateUserUseCaseSymbol, UpdateUserUseCase);
// const generateUserActivityReportUseCaseProvider = new Provider(
//   GenerateUserActivityReportUseCaseSymbolProvider,
//   GenerateUserActivityReportUseCaseProvider,
// );
// const generateUserActivityReportUseCaseConsumer = new Provider(
//   GenerateUserActivityReportUseCaseSymbolConsumer,
//   GenerateUserActivityReportUseCaseConsumer,
// );
const getUsersUseCaseProvider = new Provider(GetUsersUseCaseSymbol, GetUsersUseCase);

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '30 days' },
    }),
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_IP,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: EQueues.reports,
    }),
    // ForumModule,
    CommonModule,
  ],
  controllers: [
    LogoutUserController,
    UserCreateController,
    LoginUserController,
    GetUserController,
    // GenerateUserActivityReportController,
    UpdateUserController,
    GetUsersController,
  ],
  providers: [
    PrismaService,
    JwtService,
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    userRepoProvider,
    createUserUseCaseProvider,
    loginUserUseCaseProvider,
    getUserUseCaseProvider,
    updateUserUseCaseProvider,
    // generateUserActivityReportUseCaseProvider,
    // generateUserActivityReportUseCaseConsumer,
    getUsersUseCaseProvider,
  ],
  exports: [getUserUseCaseProvider, userRepoProvider],
})
export class UserModule {}
