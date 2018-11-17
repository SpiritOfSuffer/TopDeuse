import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateUserDto } from '../dto/CreateUserDto';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';

 @Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false
  })
  @IsNotEmpty()
  email: string;

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
    const user = new User();
    user.email = createUserDto.email;
    user.fullname = createUserDto.fullname;
    user.password = bcrypt.hashSync(createUserDto.password, 10)
    user.role = 'user';
    return user;
  }
}