import { UserService } from './UserService';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/JwtPayload';
import { LoginUserDto } from '../dto/LoginUserDto';
import { User } from '../entities/User';
import * as bcrypt from 'bcryptjs';
import { InvalidCredentialsException } from '../exceptions/InvalidCredentialsException';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(login: string): Promise<string> {
        const user: JwtPayload = { login };
        return this.jwtService.sign(user);
    }

    async validateUser(jwtPayload: JwtPayload): Promise<User> {
        return await this.userService.findOneByLogin(jwtPayload.login);
    }

    async login(loginUserDto: LoginUserDto): Promise<string> {
        const user = await this.userService.findOneByLogin(loginUserDto.login);
        
        if (!user || !bcrypt.compareSync(loginUserDto.password, user.password)) {
            throw new InvalidCredentialsException();
        }

        return this.signIn(user.login);
    }
}