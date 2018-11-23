import { Module } from '@nestjs/common';
import { UserService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { AuthService } from './services';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { roles } from './Roles';
import { AccessControlModule, RolesBuilder } from 'nest-access-control';
import { ConfigModule } from '../config';
import { UserResolver } from './resolvers';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlAuthGuard } from './guards';


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
