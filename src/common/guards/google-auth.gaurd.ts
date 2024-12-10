import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Sử dụng AuthGuard của Passport để bảo vệ route cho xác thực Google
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}