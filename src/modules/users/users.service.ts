import { BadRequestException, Body, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt, { compareSync } from "bcryptjs"
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { sendResponse } from 'src/config';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ){}

  getHashPassword = (password: string) : string => {
    const salt = genSaltSync(10)
    const hash = hashSync(password, salt)
    return hash
  }

  comparePassword = (password: string, hash: string) : boolean => {
    return compareSync(password, hash)
  }

  async create(registerUserDto: RegisterUserDto) {
    const {email, password, repassword, fullName} = registerUserDto
    if(!email || !password || !fullName || !repassword){
      throw new BadRequestException(
        sendResponse("error", "Nhập đầy đủ thông tin", null)
      );
    }

    if(password !== repassword){
      throw new BadRequestException(
        sendResponse("error", "Mật khẩu nhập lại chưa đúng", null)
      );
    }

    const user = await this.userModel.findOne({email, type: "SYSTEM"})
    if(user){
      throw new BadRequestException(
        sendResponse("error", "Email đã tồn tại trong hệ thống", null)
      );
    }

    const hash = this.getHashPassword(password)
    const newUser = await this.userModel.create({
      email,
      password: hash,
      fullName,
      type: "SYSTEM"
    })
    return sendResponse("success", "Đăng ký thành công", newUser);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  findByEmail(username: string){
    return this.userModel.findOne({email: username}).populate({path: "role"})
  }

  findUserByToken(refresh_token: string){
    return this.userModel.findOne({refreshToken: refresh_token}).populate({path: "role"})
  }

  updateUserToken(refreshToken: string, id: string){    
    return this.userModel.updateOne({_id: id},{refreshToken})
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
