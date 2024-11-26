import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Require } from 'src/common/decorators/customise.decorator';
import { CONFIG_PERMISSIONS } from 'src/config';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('')
  @Require(CONFIG_PERMISSIONS.ROLE.GET)
  getListRole(){
    return this.rolesService.getListRole()
  }

  @Get(':id')
  @Require(CONFIG_PERMISSIONS.ROLE.GET)
  getDetailRole(
    @Param('id') id: string
  ){
    return this.rolesService.getDetailRole(id)
  }

  @Post('create')
  @Require(CONFIG_PERMISSIONS.ROLE.CREATE)
  createRole(
    @Body() createRoleDto: CreateRoleDto
  ){
    return this.rolesService.createRole(createRoleDto)
  }

  @Delete('delete/:id')
  @Require(CONFIG_PERMISSIONS.ROLE.DELETE)
  deleteRole(
    @Param('id') id: string
  ){
    return this.rolesService.deleteRole(id)
  }

  @Patch('edit/:id')
  @Require(CONFIG_PERMISSIONS.ROLE.DELETE)
  editRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto
  ){
    return this.rolesService.editRole(id, updateRoleDto)
  }
}
