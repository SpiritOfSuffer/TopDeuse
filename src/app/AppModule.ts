import { Module } from '@nestjs/common';
import { UserModule } from '../user/UserModule';
import { AppController } from './AppController';
import { UserController } from '../user/controllers/UserController';
import { UserService } from '../user/services/UserService';
import { AuthService } from '../user/services/AuthService';
import { AppService } from './AppService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from "../user/entities/User";
import { ACGuard, UseRoles } from "nest-access-control";


@Module({
  imports: [UserModule, TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: "root",
      password: "root",
      database: "test",
      entities: [User]
  })
],
  controllers: [
    AppController,
    UserController
],
  providers: [
    AppService,
    AuthService,
    UserService
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}