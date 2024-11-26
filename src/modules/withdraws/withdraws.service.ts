import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Withdraw } from './schemas/withdraw.schema';
import { CONFIG_ICON, sendResponse } from 'src/config';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class WithdrawsService {
  constructor(
    @InjectModel(Withdraw.name) private withdrawModel: Model<Withdraw>,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ){}

  async findAll(status: string, user: string) {
    let query: any = {}

    if(status == "true"){
      query.status = true
    }else if(status == "false"){
      query.status = false
    }

    if(user){
      query.user = user
    }


    const withdraws = await this.withdrawModel
    .find(query)
    .sort({ createdAt: -1 })

    return sendResponse("success", "Danh sách lệnh rút tiền", withdraws)
  }

  async createWithdraw(money: number){
    if(money < 10000){
      throw new BadRequestException(sendResponse("error", "Nạp tối thiểu 10.000đ", null))
    }

    return "Nạp tiền"
  }

  async approveWithdraw(id: ObjectId){
    const record = await this.withdrawModel.findByIdAndUpdate({_id: id}, {status: true})

    /**
     * THÔNG BÁO TỚI USER 
     */
    this.notificationsService.create("", CONFIG_ICON.WITHDRAW, `Lệnh rút ${record.money} đã được duyệt. Vui lòng kiểm tra tài khoản.`, record.user.toString())
    return sendResponse("success", "Duyệt thành công", null)
  }

  async refuseWithdraw(id: ObjectId){
    const record = await this.withdrawModel.findByIdAndDelete({_id: id})
    this.usersService.updateMoney(record.money, record.user.toString())

    /**
     * THÔNG BÁO TỚI USER 
     */
    this.notificationsService.create("", CONFIG_ICON.WITHDRAW, `Lệnh rút ${record.money} không được chấp thuận. Vui lòng thử lại sau.`, record.user.toString())
    return sendResponse("success", "Xóa thành công", null)
  }
}
