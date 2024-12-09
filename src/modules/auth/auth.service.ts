import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { IUser } from '../users/users.interface';
import { sendResponse } from 'src/config';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(username);
        if (user) {
            const isValid = this.usersService.comparePassword(pass, user.password);
            if (isValid) {
                const { password, refreshToken, follow, ...res } = user.toObject()
                return res
            }
        }
        return null;
    }

    async login(
        user: IUser,
        response: any,
    ) {
        if(user.banned){
            return sendResponse("error", "Tài khoản bị cấm", null)
        }
        let access_token = this.createAccessToken(user)
        let refresh_token = this.createRefreshToken(user)

        await this.usersService.updateUserToken(refresh_token, user._id)

        response.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: this.configService.get<number>("ACCESSTOKEN_EXPIRE") * 1000
        })

        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: this.configService.get<number>("REFRESHTOKEN_EXPIRE") * 1000
        })
        return sendResponse("success", "Đăng nhập thành công", {
            access_token,
            refresh_token,
            user
        })
    }

    register(registerUserDto: RegisterUserDto) {
        return this.usersService.create(registerUserDto)
    }

    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("REFRESHTOKEN_SECRET_KEY"),
            expiresIn: 100 * 24 * 60 * 60
        })
        return refresh_token
    }

    createAccessToken = (payload: any) => {
        const access_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("ACCESSTOKEN_SECRET_KEY"),
            expiresIn: 15
        })
        return access_token
    }

    async logout(user: IUser, res: Response) {
        await this.usersService.updateUserToken("", user._id);
        res.clearCookie("refresh_token");
        return sendResponse("success", "Đăng xuất thành công", null)
    }

    refresh = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("REFRESHTOKEN_SECRET_KEY"),
            })

            let user = (await this.usersService.findUserByToken(refreshToken)).toObject()
            if (user) {
                const { password, refreshToken, follow, ...payload } = user
                const refresh_token = this.createRefreshToken(payload)

                await this.usersService.updateUserToken(refresh_token, user._id.toString())
                response.clearCookie('refresh_token')
                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: this.configService.get<number>("REFRESHTOKEN_EXPIRE") * 1000
                })
                let access_token = this.createAccessToken(payload)
                response.clearCookie('access_token')
                response.cookie('access_token', access_token, {
                    httpOnly: true,
                    maxAge: this.configService.get<number>("ACCESSTOKEN_EXPIRE") * 1000
                })

                return sendResponse("success", "Refresh thành công", {
                    access_token,
                    refresh_token,
                    user: payload
                })
            } else {
                throw new BadRequestException(sendResponse("error", "Refresh token không hợp lệ", null))
            }
        } catch (error) {
            throw new BadRequestException(sendResponse("error", "Refresh token không hợp lệ", null))
        }
    }

    checkAccessToken = async (access_token: string) => {        
        try {
            const user = this.jwtService.verify(access_token, {
                secret: this.configService.get<string>("ACCESSTOKEN_SECRET_KEY"),
            })
            return sendResponse("success", "Xác thực thành công", user)
        } catch (error) {
            return sendResponse("error", "Access token không hợp lệ", null)
        }
    }
}