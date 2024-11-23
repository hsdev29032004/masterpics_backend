import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/common/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, CloudinaryService, JwtStrategy],
  imports: [
    UsersModule, 
    PassportModule,
    JwtModule,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}