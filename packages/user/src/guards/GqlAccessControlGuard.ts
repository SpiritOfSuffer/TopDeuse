import { GqlExecutionContext } from '@nestjs/graphql';
import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesBuilder } from 'nest-access-control';

 @Injectable()
export class GqlAccessControlGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleBuilder: RolesBuilder,
  ) {}
   canActivate(context) {
    const ctx = GqlExecutionContext.create(context);
    const roles: any[] = this.reflector.get('roles', context.getHandler());

     if (!roles) {
      return true;
    }

    const request = ctx.getContext().req;
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }
    
     const hasRoles = roles.every(role => {
      role.role = user.roles;
      const permission = this.roleBuilder.permission(role);
      return permission.granted;
    });
     return hasRoles;
  }
}