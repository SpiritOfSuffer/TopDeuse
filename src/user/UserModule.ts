import { Module } from '@nestjs/common';
import { UserController } from './controllers/UserController';
import { UserService } from './services/UserService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';
import { AuthService } from './services/AuthService';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/JwtStrategy';
import { roles } from './Roles';
import { AccessControlModule } from 'nest-access-control';
import { ConfigModule } from '../config/ConfigModule';

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
],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
