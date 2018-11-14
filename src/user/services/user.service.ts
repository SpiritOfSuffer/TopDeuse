import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

 @Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
   async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
   async register(userDto: RegisterUserDto): Promise<User> {
    return await this.userRepository.save(User.fromRegisterUserDto(userDto));
  }
   async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne(id);
     if (user) {
      user.fullname = updateUserDto.fullname;
      user.password = updateUserDto.password;
      return await this.userRepository.save(user);
    }
  }
   async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}