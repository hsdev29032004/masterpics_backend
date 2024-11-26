import { BadRequestException, Body, forwardRef, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt, { compareSync } from "bcryptjs"
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { CONFIG_ICON, sendResponse } from 'src/config';
import { IUser } from './users.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RolesService } from '../roles/roles.service';
import { IRole } from '../roles/roles.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
    private readonly notificationsService: NotificationsService,
  ) { }

  getHashPassword = (password: string): string => {
    const salt = genSaltSync(10)
    const hash = hashSync(password, salt)
    return hash
  }

  comparePassword = (password: string, hash: string): boolean => {
    return compareSync(password, hash)
  }

  async create(registerUserDto: RegisterUserDto) {
    const { email, password, repassword, fullName } = registerUserDto
    if (!email || !password || !fullName || !repassword) {
      throw new BadRequestException(
        sendResponse("error", "Nhập đầy đủ thông tin", null)
      );
    }

    if (password !== repassword) {
      throw new BadRequestException(
        sendResponse("error", "Mật khẩu nhập lại chưa đúng", null)
      );
    }

    const user = await this.userModel.findOne({ email, type: "SYSTEM" })
    if (user) {
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

  async updateMoney(money: number, id: string){
    await this.userModel.updateOne(
      {_id: id}, 
      { $inc: { money: money } }
    )
  }

  findByEmail(username: string) {
    return this.userModel.findOne({ email: username }).populate({ path: "role" })
  }

  findUserByToken(refresh_token: string) {
    return this.userModel.findOne({ refreshToken: refresh_token }).populate({ path: "role" })
  }

  updateUserToken(refreshToken: string, id: string) {
    return this.userModel.updateOne({ _id: id }, { refreshToken })
  }

  async getUserBySlug(slug: string) {
    const user = await this.userModel.findOne({ slug: slug }).select("-email -password -role -money -type -refreshToken")
      .populate({ path: "follow", select: "fullName avatar slug" })

    if (!user) {
      throw new NotFoundException(sendResponse("error", "Không tìm thấy người dùng", null))
    }

    return sendResponse("success", "Tìm thấy người dùng", user)
  }

  async getAllUser() {
    const listUser = await this.userModel.find({ banned: false })
      .select("-password -refreshToken")
      .populate({
        path: "role"
      })

    return sendResponse("success", "Lấy danh sách người dùng thành công", listUser)
  }

  async banUser(id: string) {
    /**
     * CHỈ CHO PHÉP BAN NGƯỜI DÙNG KHÔNG CÓ QUYỀN QUẢN TRỊ
     */
    const user: any = await this.userModel.findOne({ _id: id })
      .populate({ path: "role" })

    if (user && user.role?.permissions.length > 0) {
      throw new BadRequestException(sendResponse("error", "Không thể ban người có quyền quản trị", null))
    }

    user.banned = true;
    await user.save()
    return sendResponse("success", "Cấm người dùng thành công", null)
  }

  async editUser(updateUserDto: UpdateUserDto, avatar: Express.Multer.File, user: IUser) {
    const { fullName, slug, bio } = updateUserDto

    if (!fullName || !slug) {
      throw new BadRequestException(sendResponse("success", "Vui lòng nhập đủ thông tin", null))
    }

    let newUser: {
      fullName: string;
      slug: string;
      bio: string;
      avatar?: string
    } = {
      fullName,
      slug,
      bio
    }

    if (avatar) {
      const res = await this.cloudinaryService.uploadFile(avatar)
      newUser.avatar = res.url
    }

    await this.userModel.updateOne({ _id: user._id }, newUser)
    const updateUser = await this.userModel.findOne({ _id: user._id })
      .select("-password -refreshToken")
      .populate({ path: "role" })

    return sendResponse("success", "Cập nhật người dùng thành công", updateUser)
  }

  async follow(id: ObjectId /*id người muốn follow*/, user: IUser) {
    /**
     * Không cho phép follow bản thân
     */
    if(id.toString() == user._id){
      throw new BadRequestException(sendResponse("error", "Không thể follow bản thân", null))
    }

    const userRecord = await this.userModel.findOne({ _id: user._id })
    const isFollowed = userRecord.follow.some(item => item == id)
    if (isFollowed) {
      userRecord.follow = userRecord.follow.filter(item => item != id)
      await userRecord.save()
      await this.userModel.updateOne(
        { _id: id },
        { $inc: { quantityFollow: -1 } }
      )

      return sendResponse("success", "Bỏ theo dõi thành công", null)
    } else {
      userRecord.follow.push(id)
      await userRecord.save()
      await this.userModel.updateOne(
        { _id: id },
        { $inc: { quantityFollow: 1 } }
      )

      /**
       * Thông báo tới người được theo dõi
       */
      await this.notificationsService.create(`/users/${user.slug}`, CONFIG_ICON.FOLLOW, `<b>${user.fullName}</b> vừa theo dõi bạn`, id.toString())

      return sendResponse("success", "Theo dõi thành công", null)
    }
  }

  async updateRoleWhenDelete(id: string, newRole: string){
    const affectedUsers = await this.userModel.find({ role: id })
    await this.userModel.updateMany({role: id}, {role: newRole})

    /**
     * THÔNG BÁO TỚI TẤT CẢ CÁC USER BỊ CẬP NHẬT QUYỀN
     */
    for (const user of affectedUsers) {
      await this.notificationsService.create("", CONFIG_ICON.SYSTEM, "Hệ thông đã cập nhật quyền <b>BASIC</b> cho bạn", user._id.toString())
    }
  }

  async updateRole(idUser: string, role: string){
    const roleRecord: IRole = await (await this.rolesService.getDetailRole(role)).data
    if(!roleRecord){
      throw new BadRequestException(sendResponse("error", "Không tồn tại quyền", null))
    }

    await this.userModel.updateOne({_id: idUser}, {role: role})
    await this.notificationsService.create("", CONFIG_ICON.SYSTEM, `Hệ thông đã cập nhật quyền <b>${roleRecord.name}</b> cho bạn`, idUser)

    const user = await this.userModel.findOne({_id: idUser})
      .select("-password -refreshToken")
      .populate("role")
    return sendResponse("success", "Cập nhật quyền thành công", user)
  }
}