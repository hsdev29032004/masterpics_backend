
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService
    ) {
        super({
            /**
             * Lấy token từ cookie
             * nếu không có thì lấy từ bearer
             * VÌ CÓ THỂ LÀ CLIENT ACTION HOẶC SERVER ACTION CỦA NEXTJS
             */
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                return req?.cookies?.["access_token"] || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
            }]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("ACCESSTOKEN_SECRET_KEY"),
        });
    }
    async validate(payload: any) {
        return payload;
    }
}
