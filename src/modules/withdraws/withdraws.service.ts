import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Withdraw } from './schemas/withdraw.schema';
import { sendResponse } from 'src/config';

@Injectable()
export class WithdrawsService {
  constructor(
    @InjectModel(Withdraw.name) private withdrawModel: Model<Withdraw>,
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
    await this.withdrawModel.updateOne({_id: id}, {status: true})
    return sendResponse("success", "Duyệt thành công", null)
  }
}
