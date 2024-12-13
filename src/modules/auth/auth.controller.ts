import { Controller, Post, Body, UseInterceptors, UploadedFile, UseGuards, Res, Req, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { Public, User } from 'src/common/decorators/customise.decorator';
import { Request, Response } from 'express';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { IUser } from '../users/users.interface';
import { GoogleAuthGuard } from 'src/common/guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

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
  async register(@Body() registerUserDto: RegisterUserDto) {
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

  //[POST]: /api/auth/check-access-token
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('check-access-token')
  checkToken(@Req() request: Request) {
    const accessToken = request.headers["authorization"]?.split(" ")[1] || request?.cookies?.["access_token"]
    return this.authService.checkAccessToken(accessToken)
  }

  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
  }

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleLoginCallback(@Req() req: Request, @Res() res: Response) {
    return this.authService.googleLoginCallback(req.user, res)
  }
}