import { Controller, UseGuards, Post, Body, Get, Delete, UseInterceptors, Param, ParseIntPipe, Req, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dto';
import { UserService } from '../services';
import { User } from '../entities';
import { TransformInterceptor } from '../interceptors/TransformInterceptor';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from '../dto';
import { AuthService } from '../services';
import { LoginUserDto } from '../dto';
import { AccessDeniedException } from '../exceptions/AccessDeniedException';
import { ACGuard, UseRoles } from 'nest-access-control';
import { UserRoles } from '../enums';
import { ResetUserPasswordDto } from '../dto';


@Controller('users')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Get('/')
  async findAll() {
    return this.userService.findAll();
  }

  @Post('/')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<string> {
    return await this.authService.login(loginUserDto);
  }

  @Post('/:id')
  @UseGuards(AuthGuard(), ACGuard)
  @UseRoles({
    resource: 'profile',
    action: 'update',
    possession: 'own',
  })
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto, 
    @Req() req): Promise<User> {

    if (req.user.role == UserRoles.USER && req.user.id !== id) {
      throw new AccessDeniedException();
    } 

    return await this.userService.update(id, updateUserDto); 
  }

  
  @Delete('/:id')
  @UseGuards(AuthGuard(), ACGuard)
  @UseRoles({
    resource: 'profile',
    action: 'update',
    possession: 'own',
  })
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    try {
      await this.userService.delete(id);
      return "User has been deleted";
    }

    catch (err) {
      return err;
    }
  }

  @Post('/resetPassword/:id')
  async reset(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() resetUserPasswordDto: ResetUserPasswordDto,) : Promise<User> {
    return await this.userService.reset(id, resetUserPasswordDto);
  }
}