import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../auth.service';
import { User } from '../../../users/user.entity';

describe('AuthService - backend security', () => {
    let service: AuthService;
    let userRepository: { findOne: jest.Mock };
    let jwtService: { sign: jest.Mock };

    beforeEach(async () => {
        userRepository = { findOne: jest.fn() };
        jwtService = { sign: jest.fn().mockReturnValue('signed-token') };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: getRepositoryToken(User), useValue: userRepository },
                { provide: JwtService, useValue: jwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('login exitoso con credenciales válidas', async () => {
        const password = 'Pass1234!';
        const user = {
            uuid: 'agent-001',
            email: 'agent@test.com',
            role: 'user',
            fullName: 'Agente A',
            password: await bcrypt.hash(password, 10),
        };

        userRepository.findOne.mockResolvedValue(user);

        const result = await service.login({ email: user.email, password });

        expect(result.message).toBe('Login successful');
        expect(result.data.accessToken).toBe('signed-token');
        expect(result.data.user.role).toBe('user');
        expect(result.data.user.uuid).toBe(user.uuid);
        expect(jwtService.sign).toHaveBeenCalledWith(
            { sub: user.uuid, email: user.email, role: user.role },
            { expiresIn: 3600 },
        );
    });

    it.each([
        ['usuario inexistente', { email: 'noexiste@test.com', password: 'Pass1234!' }],
        ['contraseña incorrecta', { email: 'agent@test.com', password: 'WrongPassword123!' }],
    ])('rechaza login inválido: %s', async (_label, dto) => {
        const hashedPassword = await bcrypt.hash('Pass1234!', 10);

        if (dto.email === 'agent@test.com') {
            userRepository.findOne.mockResolvedValue({
                uuid: 'agent-001',
                email: dto.email,
                role: 'user',
                fullName: 'Agente A',
                password: hashedPassword,
            });
        } else {
            userRepository.findOne.mockResolvedValue(null);
        }

        await expect(service.login(dto as any)).rejects.toThrow(UnauthorizedException);
        await expect(service.login(dto as any)).rejects.toThrow('Las credenciales son incorrectas');
    });
});
