import { UserService } from './UserService';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/JwtPayload';
import { LoginUserDto } from '../dto/LoginUserDto';

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
        const user = await this.userService.findOneByEmailAndPassword(loginUserDto.email, loginUserDto.password);
        
        if (!user) {
            throw new NotFoundException();
        }

        return this.signIn(user.email);
    }
}