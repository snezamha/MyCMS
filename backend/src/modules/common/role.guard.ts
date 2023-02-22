import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const rolesHandler = this.reflector.get('roles', context.getHandler());
    const { user } = context.switchToHttp().getRequest();

    return rolesHandler.some((role: string) => role == user.role);
  }
}
