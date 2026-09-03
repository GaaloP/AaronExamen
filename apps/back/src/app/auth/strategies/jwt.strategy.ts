import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { AuthenticatedUser } from '../authenticated-user.interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET')!,
        });
    }

    validate(payload: AuthenticatedUser) {
        return {
            uuid: payload.uuid,
            email: payload.email,
            role: payload.role,
        };
    }
}
