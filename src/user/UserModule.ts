import { Module } from '@nestjs/common';
import { UserController } from './controllers/UserController';
import { UserService } from './services/UserService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';
import { AuthService } from './services/AuthService';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/JwtStrategy';
import { roles } from './Roles';
import { AccessControlModule, RolesBuilder } from 'nest-access-control';
import { ConfigModule } from '../config/ConfigModule';
import { UserResolver } from './resolvers/UserResolver';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlAuthGuard } from './guards/GqlAuthGuard';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AccessControlModule.forRoles(roles),
    ConfigModule,
    JwtModule.register({
      secretOrPrivateKey: 'secretKey',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => {
        return { req };
      },
    }),
],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    JwtStrategy,
    UserResolver,
    {
      provide: RolesBuilder,
      useValue: roles,
    },
    GqlAuthGuard,
  ],
  exports: [UserService],
})
export class UserModule {}
