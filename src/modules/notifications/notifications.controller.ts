import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User } from 'src/common/decorators/customise.decorator';
import { IUser } from '../users/users.interface';

/**
 * CÁC TRƯỜNG HỢP THÔNG BÁO
 * Tạo mới bài viết (thông báo cho người theo dõi)
 * Mua ảnh (thông báo tới người mua và người bán)
 * Admin xóa bài viết (thông báo cho user bị xóa)
 * Admin tạo thông báo (thông báo cho danh sách người dùng được chọn)
 * Nạp tiền thành công (thông báo tới user nạp tiền)
 * Tạo lệnh rút tiền (thông báo tới user có quyền updateWithdraw)
 * Rút tiền thành công (thông báo tới user rút tiền)
 * Cập nhật quyền (Thông báo tới user được cập nhật)
 */

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('')
  getListNotification(
    @User() user: IUser
  ){
    return this.notificationsService.getListNotification(user)
  }

  @Post('read/:id')
  @HttpCode(HttpStatus.OK)
  readNotification(
    @Param('id') id: string,
    @User() user: IUser
  ){
    return this.notificationsService.readNotification(id, user)
  }

  @Post('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  readAllNotification(
    @User() user: IUser
  ){
    return this.notificationsService.readAllNotification(user)
  }
}
