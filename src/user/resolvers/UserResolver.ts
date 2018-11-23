import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { UserService } from '../services';
import { UseRoles, UserRoles } from 'nest-access-control';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards';
import { GqlAccessControlGuard } from '../guards';
import { AuthService } from '../services';

 @Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Query()
  async getUser(@Args('id') id: number) {
    return await this.userService.findOneById(id);
  }

  @Query()
  async users() {
    const users = await this.userService.findAll();
    return {
      rows: users,
      count: users.length,
    };
  }

  @Query()
  @UseRoles({
    resource: 'profile',
    action: 'read',
    possession: 'own',
  })
  @UseGuards(GqlAuthGuard, GqlAccessControlGuard)
  async me(@Context() ctx) {
    return ctx.req.user;
  }

  @Query()
  async signin(@Args('login') login: string, @Args('password') password: string) {
    return {
      token: await this.authService.login({ login, password }),
    };
  }
   @Mutation()
  async updateProfile(@Args('id') id: number, @Args('fullname') fullname: string) {
    return await this.userService.update(id, { fullname });
  }
}