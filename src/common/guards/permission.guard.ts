import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION } from '../decorators/customise.decorator';
import { sendResponse } from 'src/config';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.get<string>(PERMISSION, context.getHandler())
        
        if (!requiredPermissions) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user = request.user

        if (user.role.permissions.includes(requiredPermissions)) {
            return true;
        }

        throw new ForbiddenException(sendResponse("error", "Bạn không có quyền truy cập", null))
    }
}
