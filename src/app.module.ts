import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AppService } from './app.service';


@Module({
  imports: [UserModule],
  controllers: [
    AppController,
    UserController
],
  providers: [
    AppService,
    UserService
  ],
})
export class AppModule {}