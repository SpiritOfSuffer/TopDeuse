import { Controller, UseGuards, Post, Body, Get, Delete, UseInterceptors, Param, ParseIntPipe, Req } from '@nestjs/common';
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
import { AccessDeniedException } from '../exceptions/access-denied.exception';

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
  @UseGuards(AuthGuard(''), RolesGuard)
  @Roles('user', 'admin')
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() updateUserDto: UpdateUserDto, @Req() req): Promise<User> {

    if (req.user.role == 'user' && req.user.id !== id) {
      throw new AccessDeniedException();
    } 

    return await this.userService.update(id, updateUserDto); 
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(''), RolesGuard)
  @Roles('user', 'admin')
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    try {
      await this.userService.delete(id);
      return "User has been deleted";
    }

    catch (err) {
      return err;
    }
  }
}