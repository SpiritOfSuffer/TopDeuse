import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/CreateUserDto';
import { UpdateUserDto } from '../dto/UpdateUserDto';
import { ADDRGETNETWORKPARAMS } from 'dns';

 @Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email }});
  }

  async findOneByEmailAndPassword(email: string, password: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email, password }});
  }

  async create(userDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(User.fromRegisterUserDto(userDto));
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne(id);
     if (user) {
      user.fullname = updateUserDto.fullname;
      return await this.userRepository.save(user);
    }
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}