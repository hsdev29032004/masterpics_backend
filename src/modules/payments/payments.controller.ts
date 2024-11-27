import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { User } from 'src/common/decorators/customise.decorator';
import { IUser } from '../users/users.interface';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('purchase')
  getListPurchaseHistory(
    @User() user: IUser
  ){
    return this.paymentsService.purchaseHistory(user)
  }

  @Get('sale')
  getListSaleHistory(
    @User() user: IUser
  ){
    return this.paymentsService.getListSaleHistory(user)
  }

  @Post('buy/:id')
  buyPicture(
    @User() user: IUser,
    @Param('id') id: string
  ){
    return this.paymentsService.buy(user, id)
  }
}
