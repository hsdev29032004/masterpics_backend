import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Public, Require, User as UserDecorator } from 'src/common/decorators/customise.decorator';
import { CONFIG_PERMISSIONS, sendResponse } from 'src/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name) private postModel: Model<User>,
    private readonly usersService: UsersService
  ) {}

  @Get('')
  @Require(CONFIG_PERMISSIONS.USER.GET)
  getAllUser(){
    return this.usersService.getAllUser()
  }

  @Get(':slug')
  @Public()
  getUserBySlug(
    @Param("slug") slug: string
  ){
    return this.usersService.getUserBySlug(slug)
  }

  @Delete('ban/:id')
  @Require(CONFIG_PERMISSIONS.USER.DELETE)
  @HttpCode(HttpStatus.OK)
  banUser(@Param('id') id: string){
    return this.usersService.banUser(id)
  }

  @Post('/edit')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (_, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new BadRequestException(sendResponse("error", "Chỉ được phép tải ảnh lên", null)), false)
        }
        callback(null, true)
      },
    }),
  )
  editUser(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
    @UserDecorator() user: IUser
  ){
    return this.usersService.editUser(updateUserDto, avatar, user)
  }
}
