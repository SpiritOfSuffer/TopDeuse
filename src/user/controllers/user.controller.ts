import { Controller, UseGuards, Post, Body, Get, UseInterceptors, Param } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dto/login-user.dto';

@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
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

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<string> {
    return await this.authService.login(loginUserDto);
  }

  @Post('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user', 'admin')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.update(id, updateUserDto); 
  }
}