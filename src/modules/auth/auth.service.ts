import { BadRequestException, Injectable } from '@nestjs/common';
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
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(username);
        if (user) {
            const isValid = this.usersService.comparePassword(pass, user.password);
            if (isValid) {
                const { password, refreshToken, ...res } = user.toObject()
                return res
            }
        }
        return null;
    }

    async login(
        user: any,
        response: any,
    ) {
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
        return {
            access_token,
            refresh_token,
            user
        }
    }

    register(registerUserDto: RegisterUserDto) {
        return this.usersService.create(registerUserDto)
    }

    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("REFRESHTOKEN_SECRET_KEY"),
            expiresIn: 525600 * 1000
        })
        return refresh_token
    }

    createAccessToken = (payload: any) => {
        const access_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("ACCESSTOKEN_SECRET_KEY"),
            expiresIn: 300 * 1000
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
                const { password, refreshToken, ...payload } = user
                const refresh_token = this.createRefreshToken(payload)

                await this.usersService.updateUserToken(refresh_token, user._id.toString())
                response.clearCookie('refresh_token')
                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: this.configService.get<number>("REFRESHTOKEN_EXPIRE") * 24 * 60 * 60
                })
                let access_token = this.createAccessToken(payload)

                return {
                    access_token,
                    refresh_token,
                    user: payload
                };
            } else {
                return new BadRequestException()
            }
        } catch (error) {
            return new BadRequestException()
        }
    }
}