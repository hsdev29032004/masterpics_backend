import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Res, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.gaurd';
import { Public, Require, User } from 'src/common/decorators/customise.decorator';
import { Request, Response } from 'express';
import { CONFIG_PERMISSIONS } from 'src/config';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { IUser } from '../users/users.interface';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';
// import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // private readonly cloudinaryService: CloudinaryService
  ) { }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadImage(@UploadedFile() file: Express.Multer.File) {
  //   return this.cloudinaryService.uploadFile(file);
  // }

  // @Get('')
  // @Require(CONFIG_PERMISSIONS.USER.GET)
  // // @Public()
  // ok(@Req() req) {
  //   return req.user
  // }

  // [POST]: /api/auth/login
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Req() req,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto){
    return this.authService.register(registerUserDto)
  }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('/refresh')
  refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies["refresh_token"] || request.headers["authorization"]?.split(" ")[1];
    return this.authService.refresh(refreshToken, response)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(user, res)
  }
}