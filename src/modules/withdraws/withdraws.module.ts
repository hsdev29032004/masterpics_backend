import { Module } from '@nestjs/common';
import { WithdrawsService } from './withdraws.service';
import { WithdrawsController } from './withdraws.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Withdraw, WithdrawSchema } from './schemas/withdraw.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature(
    [
      { name: Withdraw.name, schema: WithdrawSchema },
    ]),
    NotificationsModule,
    UsersModule
  ],
  controllers: [WithdrawsController],
  providers: [WithdrawsService],
})
export class WithdrawsModule { }
