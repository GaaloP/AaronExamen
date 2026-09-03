import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class UsersSeedService implements OnApplicationBootstrap {
    private readonly logger = new Logger(UsersSeedService.name);

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly config: ConfigService,
    ) { }

    async onApplicationBootstrap() {
        const shouldSeed = true;
        if (!shouldSeed) return;

        const users = [
            { fullName: 'Carlitos Su Papa', email: 'admin@test.com', password: 'admin123', role: 'supervisor' },
            { fullName: 'Valer IA', email: 'user1@test.com', password: 'user123', role: 'agente' },
            { fullName: 'Chris Chan', email: 'user2@test.com', password: 'user123', role: 'agente' },
            { fullName: 'Gael Posaderas', email: 'user3@test.com', password: 'user123', role: 'agente' },
        ];

        for (const userData of users) {
            const exists = await this.userRepository.findOne({ where: { email: userData.email } });
            if (exists) {
                this.logger.log(`Usuario ${userData.email} ya existe, se omite.`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = this.userRepository.create({ ...userData, password: hashedPassword });
            await this.userRepository.save(user);
            this.logger.log(`Usuario creado: ${userData.email}`);
        }

        this.logger.log('Seed de usuarios finalizado.');
    }
}