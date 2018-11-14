import { Controller, UseGuards, Post, Body, Get, UseInterceptors } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { async } from 'rxjs/internal/scheduler/async';

 @Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('/')
  @Roles('guest')
  @UseInterceptors(TransformInterceptor)
  async findAll() {
    return this.userService.findAll();
  }

   @Post('/')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return await this.userService.register(registerUserDto);
  }
}