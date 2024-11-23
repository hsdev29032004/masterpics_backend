import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

/**
 * Public route không cần check token
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Check xem user có quyền truy cập không 
 */
export const PERMISSION = 'permission';
export const Require = (permissions: string) => SetMetadata(PERMISSION, permissions);

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);