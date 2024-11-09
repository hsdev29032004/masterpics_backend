import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CloudinaryService],
})
export class AuthModule {}
