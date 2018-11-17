import { UserService } from './UserService';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/JwtPayload';
import { LoginUserDto } from '../dto/LoginUserDto';
import * as bcrypt from 'bcryptjs';
import { InvalidCredentialsException } from '../exceptions/InvalidCredentialsException';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(email: string): Promise<string> {
        const user: JwtPayload = { email };
        return this.jwtService.sign(user);
    }

    async validateUser(jwtPayload: JwtPayload): Promise<any> {
        return await this.userService.findOneByEmail(jwtPayload.email);
    }

    async login(loginUserDto: LoginUserDto): Promise<string> {
        const user = await this.userService.findOneByEmail(loginUserDto.email);
        
        if (!user || !bcrypt.compareSync(loginUserDto.password, user.password)) {
            throw new InvalidCredentialsException();
        }

        return this.signIn(user.email);
    }
}