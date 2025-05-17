import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles';
import { JwtUser } from '../../auth/types/jwt-user.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      // Roles 데코레이터 없으면 바로 허용
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtUser = request.user;

    return requiredRoles.includes(user.role);
  }
}
