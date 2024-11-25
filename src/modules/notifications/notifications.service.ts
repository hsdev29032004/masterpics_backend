import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { sendResponse } from 'src/config';
import { Notification } from './schemas/notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
}
