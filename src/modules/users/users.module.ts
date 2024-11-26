import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Role, RoleSchema } from '../roles/schemas/role.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema }
    ]),
    forwardRef(() => AuthModule),
    NotificationsModule,
    forwardRef(() => RolesModule)
  ],
  controllers: [UsersController],
  providers: [UsersService, CloudinaryService],
  exports: [UsersService]
})
export class UsersModule { }
