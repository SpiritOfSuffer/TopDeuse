import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { RegisterUserDto } from '../dto/register-user.dto';
import { Exclude } from 'class-transformer';

 @Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

   @Column()
  email: string;

   @Column()
  fullname: string;

   @Column()
  @Exclude()
  password: string;
  
   @Column()
  role: string;
   public static fromRegisterUserDto(registerUserDto: RegisterUserDto): User {
    const user = new User();
    user.email = registerUserDto.email;
    user.fullname = registerUserDto.fullname;
    user.password = registerUserDto.password;
    user.role = 'user';
    return user;
  }
}