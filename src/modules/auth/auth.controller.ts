import { Controller, Post, Body, UseInterceptors, UploadedFile, UseGuards, Res, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.gaurd';
import { Public, User } from 'src/common/decorators/customise.decorator';
import { Request, Response } from 'express';
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

  // [POST]: /api/auth/register
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto){
    return this.authService.register(registerUserDto)
  }

  // [POST]: /api/auth/logout
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(user, res)
  }

  // [POST]: /api/auth/refresh
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('/refresh')
  refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies["refresh_token"] || request.headers["authorization"]?.split(" ")[1];
    return this.authService.refresh(refreshToken, response)
  }
}