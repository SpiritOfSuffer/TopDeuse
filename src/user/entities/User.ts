import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateUserDto } from '../dto/CreateUserDto';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import * as shortid from 'shortid';

 @Entity()
export class User {

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({
    unique: true,
    nullable: false
  })
  @IsNotEmpty()
  email: string;

  @Column({
    unique: true,
  })
  login: string;

  @Column()
  fullname: string;

  @Column()
  @Exclude()
  password: string;
  

  get roles() {
    return [this.role];
  }

  @Column()
  role: string;
   public static fromRegisterUserDto(createUserDto: CreateUserDto): User {
    shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
    const user = new User();
    user.email = createUserDto.email;
    user.fullname = createUserDto.fullname;
    user.login = shortid.generate();
    user.password = bcrypt.hashSync(createUserDto.password, 10)
    user.role = 'user';
    return user;
  }
}