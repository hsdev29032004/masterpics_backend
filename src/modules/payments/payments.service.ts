import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './schemas/payment.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../users/users.interface';
import { CONFIG_ICON, sendResponse } from 'src/config';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ){}
  
  async purchaseHistory(user: IUser){
    const purchases = await this.paymentModel.find({buyer: user._id})
    return sendResponse("success", "Lấy lịch sử mua ảnh thành công", purchases)
  }

  async getListSaleHistory(user: IUser){
    const sales = await this.paymentModel.find({seller: user._id})
    return sendResponse("success", "Lấy lịch sử bán ảnh thành công", sales)
  }

  async buy(userProp: IUser, idPost: string){
    let post = await this.postsService.findById(idPost)
    let buyer = await this.usersService.findByEmail(userProp.email)
    let seller = await this.usersService.findById(post.user.toString())

    if(buyer._id.toString() == post.user.toString()){
      throw new BadRequestException(sendResponse("error", "Không thể mua ảnh của bản thân.", null))
    }

    const existPayment = await this.paymentModel.findOne({buyer: userProp._id, post: idPost})
    if(existPayment){
      throw new BadRequestException(sendResponse("error", "Bạn đã mua hình ảnh này trước đó rồi.", null))
    }

    if(buyer.money < post.price){
      throw new BadRequestException(sendResponse("error", "Không đủ tiền, vui lòng nạp thêm.", null))
    }

    post.quantityBuy += 1
    await post.save()

    buyer.money -= post.price
    await buyer.save()

    seller.money += post.price * 60 / 100 // <----- Nhận được 60% giá trị hình ảnh, số còn lại là phí của hệ thống
    await seller.save()

    const payment = await this.paymentModel.create({
      buyer: userProp._id,
      seller: post.user,
      post: post._id,
      price: post.price,
      image: post.image
    })

    /**
     * THÔNG BÁO TỚI NGƯỜI BÁN
     */
    await this.notificationsService.create("", CONFIG_ICON.DEPOSIT, `<b>+${payment.price * 60 / 100}đ</b> từ giao dịch mua ảnh <b>${post.title}</b> của <b>${buyer.fullName}</b>`, seller._id.toString())
    /**
     * THÔNG BÁO TỚI NGƯỜI MUA
     */
    await this.notificationsService.create("/purchase-history", CONFIG_ICON.PURCHASE, `<b>-${payment.price}đ</b> từ giao dịch mua ảnh <b>${post.title}</b>`, buyer._id.toString())

    return(sendResponse("success", "Mua ảnh thành công, check lịch sử mua hàng.", payment))
  }
}
