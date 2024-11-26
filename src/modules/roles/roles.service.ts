import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { sendResponse } from 'src/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private rolemodel: Model<Role>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ){}

  async getListRole(){
    const roles = await this.rolemodel.find({})
      .select("-description -permissions")

    return sendResponse("success", "Lấy danh sách quyền thành công", roles)
  }

  async getDetailRole(id: string){
    const role = await this.rolemodel.findOne({_id: id})
    return sendResponse("success", "Lấy chi tiết quyền thành công", role)
  }

  async createRole(createRoleDto: CreateRoleDto){
    let {name, description, permissions} = createRoleDto
    let arrPermissions = permissions ? permissions.split(',').map(id => id.trim()) : []
    if(!name){
      throw new BadRequestException(sendResponse("error", "Vui lòng nhập tên quyền", null))
    }

    const existName = await this.rolemodel.findOne({name})
    if(existName){
      throw new BadRequestException(sendResponse("error", "Tên quyền đã tồn tại. Nhập tên khác", null))
    }

    const record = await this.rolemodel.create({name, description, permissions: arrPermissions})
    return sendResponse("success", "Tạo mới quyền thành công", record)
  }

  async deleteRole(id: string){
    const record = await this.rolemodel.findOne({_id: id})
    if(!record.canDelete){
      throw new BadRequestException(sendResponse("error", "Không thể xóa quyền này", null))
    }

    await record.deleteOne()
    /**
     * TRIGGER CẬP NHẬT TẤT CẢ CÁC USER CÓ QUYỀN BỊ XÓA THÀNH BASIC
     */
    this.usersService.updateRoleWhenDelete(id, "672d86a24ec190235905df15")
    return sendResponse("success", "Xóa quyền thành công", null)
  }

  async editRole(id: string, updateRoleDto: UpdateRoleDto){
    const {name, description, permissions} = updateRoleDto
    if(!name){
      throw new BadRequestException(sendResponse("error", "Vui lòng nhập tên quyền", null))
    }

    const existName = await this.rolemodel.findOne({name, _id: { $ne: id } })
    if(existName){
      throw new BadRequestException(sendResponse("error", "Tên quyền đã tồn tại. Nhập tên khác", null))
    }

    const record = await this.rolemodel.findOne({_id: id})
    if(!record.canDelete){
      throw new BadRequestException(sendResponse("error", "Không thể cập nhật quyền này", null))
    }

    let updateRole: {name: string, description: string, permissions?: string[]} = {name, description, permissions: []}
    if(permissions){
      let arrPermissions = permissions ? permissions.split(',').map(id => id.trim()) : []
      updateRole.permissions = arrPermissions
    }

    await this.rolemodel.updateOne({_id: id}, updateRole)
    const role = await this.rolemodel.findOne({_id: id})
    return sendResponse("success", "Cập nhật quyền thành công", role)
  }
}
