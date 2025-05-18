// auth/decorators/require-roles.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles';

export function RequireRoles(...roles: string[]) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), RolesGuard),
    Roles(...roles),
  );
}