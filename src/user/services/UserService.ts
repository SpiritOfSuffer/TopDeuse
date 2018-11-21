import { Injectable, Inject  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/CreateUserDto';
import { UpdateUserDto } from '../dto/UpdateUserDto';
import { ADDRGETNETWORKPARAMS } from 'dns';
import { MailerProvider } from '@nest-modules/mailer';
import { ConfigService } from '../../config/ConfigService';
import { ResetUserPasswordDto } from '../dto/ResetUserPasswordDto';
import * as bcrypt from 'bcryptjs';

 @Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('MailerProvider') private readonly mailerProvider: MailerProvider,
    private readonly config: ConfigService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    return  this.userRepository.findOne(id);
  }

  async findOneByLogin(login: string): Promise<User> {
    return await this.userRepository.findOne({ where: { login }});
  }

  async findOneByLoginAndPassword(login: string, password: string): Promise<User> {
    return await this.userRepository.findOne({ where: { login, password }});
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email }});
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.save(User.fromRegisterUserDto(createUserDto));
    
    this.mailerProvider.sendMail({
      to: user.email,
      from: this.config.get('EMAIL_FROM'),
      subject: this.config.get('EMAIL_SUBJECT').replace('{{{FULLNAME}}}', user.fullname),
      html: this.config.get('EMAIL_BODY').replace('{{{LOGIN}}}', user.login),
    });

    return user;
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

  async reset(id: number, resetUserPasswordDto: ResetUserPasswordDto): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (user) {
      user.password = bcrypt.hashSync(resetUserPasswordDto.password, 10)
      this.mailerProvider.sendMail({
        to: user.email,
        from: this.config.get('EMAIL_FROM'),
        subject: this.config.get('RESETPASSWORD_SUBJECT').replace('{{{FULLNAME}}}', user.fullname),
        html: this.config.get('RESETPASSWORD_BODY').replace('{{{PASSWORD}}}', resetUserPasswordDto.password),
      });

      return await this.userRepository.save(user);
    }
  }
}