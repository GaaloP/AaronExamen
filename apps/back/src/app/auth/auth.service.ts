import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async login(dto: LoginDto) {
        const user = await this.userRepository.findOne({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Las credenciales son incorrectas');
        }

        if (!user.password) {
            throw new UnauthorizedException('Las credenciales son incorrectas');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Las credenciales son incorrectas');
        }

        const payload = { sub: user.uuid, email: user.email, role: user.role };
        const expiresIn = 3600;
        const accessToken = this.jwtService.sign(payload, { expiresIn });

        return {
            message: 'Login successful',
            data: {
                accessToken,
                expiresIn,
                user: {
                    role: user.role,
                    fullName: user.fullName,
                    uuid: user.uuid,
                },
            },
        };
    }
}