import { Module } from '@nestjs/common';
import { UserModule } from '../user';
import { AppController } from './AppController';
import { AppService } from './AppService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from "../user/entities";
import { ACGuard, UseRoles } from "nest-access-control";
import { MailerModule } from '@nest-modules/mailer';


@Module({
  imports: [UserModule, TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: "root",
      password: "root",
      database: "test",
      entities: [User]
  }),
  MailerModule.forRoot(),
],
  controllers: [
    AppController,
],
  providers: [
    AppService,
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}