import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserCreateController } from './useCases/CreateUser/CreateUserController';
import { LoginUserController } from './useCases/Login/LoginUserController';
import { LogoutUserController } from './useCases/Logout/LogoutUserController';
import { GetUserController } from './useCases/getUser/GetUserController';
import { AuthService } from 'src/modules/Auth/Auth.service';
import { PrismaService } from 'src/prisma.service';
import { Provider } from 'src/shared/core/Provider';
import { UserRepo } from './repos/implementations/userRepo';
import { UserRepoSymbol } from './repos/utils/symbols';
import { CreateUserUseCase } from './useCases/CreateUser/CreateUserUseCase';
import { LoginUserUseCase } from './useCases/Login/LoginUserUseCase';
import { UpdateUserController } from './useCases/UpdateUser/UpdateUserController';
import { UpdateUserUseCase } from './useCases/UpdateUser/UpdateUserUseCase';
import { GetUserUseCase } from './useCases/getUser/GetUserUseCase';
import { GetUsersController } from './useCases/getUsers/GetUserController';
import {
  CreateUserUseCaseSymbol,
  GetUsersUseCaseSymbol,
  GetUserUseCaseSymbol,
  LoginUserUseCaseSymbol,
  UpdateUserUseCaseSymbol,
} from './utils/symbols';
import { CommonModule } from 'src/modules/common/common.module';
import { GetUsersUseCase } from './useCases/getUsers/GetUserUseCase';

const userRepoProvider = new Provider(UserRepoSymbol, UserRepo);
const createUserUseCaseProvider = new Provider(CreateUserUseCaseSymbol, CreateUserUseCase);
const loginUserUseCaseProvider = new Provider(LoginUserUseCaseSymbol, LoginUserUseCase);
const getUserUseCaseProvider = new Provider(GetUserUseCaseSymbol, GetUserUseCase);
const updateUserUseCaseProvider = new Provider(UpdateUserUseCaseSymbol, UpdateUserUseCase);
const getUsersUseCaseProvider = new Provider(GetUsersUseCaseSymbol, GetUsersUseCase);

@Module({
  imports: [ConfigModule.forRoot(), CommonModule],
  controllers: [
    LogoutUserController,
    UserCreateController,
    LoginUserController,
    GetUserController,
    UpdateUserController,
    GetUsersController,
  ],
  providers: [
    PrismaService,
    AuthService,
    userRepoProvider,
    createUserUseCaseProvider,
    loginUserUseCaseProvider,
    getUserUseCaseProvider,
    updateUserUseCaseProvider,
    getUsersUseCaseProvider,
  ],
  exports: [getUserUseCaseProvider, userRepoProvider],
})
export class UserModule {}
