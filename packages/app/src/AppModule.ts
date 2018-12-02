import { Module } from '@nestjs/common';
import { UserModule } from '@goom/user';
import { AppController } from './AppController';
import { AppService } from './AppService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from "../../user/src/entities";
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
  MailerModule.forRoot({
    transport: {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'username',
        pass: 'password',
      },
    },
    defaults: {
      forceEmbeddedImages: true,
      from: '"nest-modules" <modules@nestjs.com>',
    },
  }),
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