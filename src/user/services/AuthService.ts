import { UserService } from '../services';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces';
import { LoginUserDto } from '../dto';
import { User } from '../entities';
import * as bcrypt from 'bcryptjs';
import { InvalidCredentialsException } from '../exceptions';


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