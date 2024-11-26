import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { WithdrawsService } from './withdraws.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Require, User } from 'src/common/decorators/customise.decorator';
import { CONFIG_PERMISSIONS } from 'src/config';
import { ObjectId } from 'mongoose';
import { IUser } from '../users/users.interface';

@Controller('withdraws')
export class WithdrawsController {
  constructor(private readonly withdrawsService: WithdrawsService) {}

  // api/withdraws?status=&user=
  @Get('')
  @Require(CONFIG_PERMISSIONS.WITHDRAW.GET)
  getListWithdraw(
    @Query('status') status: string,
    @Query('user') user: string
  ){
    return this.withdrawsService.findAll(status, user)
  }

  // Lúc làm fe sẽ quay lại endpoint này
  @Post('')
  createWithdraw(
    @Body() createWithdrawDto: CreateWithdrawDto
  ){
    return this.withdrawsService.createWithdraw(createWithdrawDto.money)
  }

  @Post('approve/:id')
  @Require(CONFIG_PERMISSIONS.WITHDRAW.UPDATE)
  @HttpCode(HttpStatus.OK)
  approveWithdraw(
    @Param('id') id: ObjectId,
    // @User() user: IUser
  ){
    return this.withdrawsService.approveWithdraw(id)
  }

  @Delete('refuse/:id')
  @Require(CONFIG_PERMISSIONS.WITHDRAW.DELETE)
  @HttpCode(HttpStatus.OK)
  refuseWithdraw(
    @Param('id') id: ObjectId,
    // @User() user: IUser
  ){
    return this.withdrawsService.refuseWithdraw(id)
  }
}
