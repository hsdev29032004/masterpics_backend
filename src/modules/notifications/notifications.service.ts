import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { sendResponse } from 'src/config';
import { Notification } from './schemas/notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../users/users.interface';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ){}

  async create(link: string, icon: string, content: string, idUser: string){
    if(!content || !idUser){
      throw new BadRequestException(sendResponse("error", "Thông báo thiếu thông tin", null))
    }

    await this.notificationModel.create({link, icon, content, user: idUser})
  }

  async getListNotification(user: IUser){
    const notifications = await this.notificationModel.find({user: user._id.toString()}).sort({createdAt: -1})
    return sendResponse("success", "Lấy danh sách thông báo thành công", notifications)
  }

  async readNotification(id: string, user: IUser){
    let notification = await this.notificationModel.findOne({_id: id})
    if(notification.user.toString() == user._id){
      notification.isRead = true
      await notification.save()
      return sendResponse("success", "Đọc thông báo thành công", null)
    }else{
      throw new ForbiddenException(sendResponse("error", "Bạn không có quyền đọc thông báo này", null))
    }
  }

  async readAllNotification(user: IUser){
    await this.notificationModel.updateMany({user: user._id}, {isRead: true})
  }
}
