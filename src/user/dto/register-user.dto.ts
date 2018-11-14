import { IsString, IsEmail } from 'class-validator';
import { User } from '../entities/user.entity';

export class RegisterUserDto {
    @IsEmail() readonly email: string;
    @IsString() readonly fullname: string;
    @IsString() readonly password: string;

    public getUser(): User {
        const user = new User;

        user.email = this.email;
        user.fullname = this.fullname;
        user.password = this.password;

        return user;
    }
}
