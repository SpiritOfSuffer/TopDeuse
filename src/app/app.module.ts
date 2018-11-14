import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { UserController } from '../user/controllers/user.controller';
import { UserService } from '../user/services/user.service';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import {User} from "../user/entities/user.entity";


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
    UserService
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}