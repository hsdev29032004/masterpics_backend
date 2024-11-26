import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { WithdrawsService } from './withdraws.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Require } from 'src/common/decorators/customise.decorator';
import { CONFIG_PERMISSIONS } from 'src/config';
import { ObjectId } from 'mongoose';

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
    @Param('id') id: ObjectId
  ){
    return this.withdrawsService.approveWithdraw(id)
  }
}
