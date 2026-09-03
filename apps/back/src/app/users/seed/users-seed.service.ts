import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { seedUsers } from '../../../database/seeds/seed-users';

@Injectable()
export class UsersSeedService implements OnApplicationBootstrap {
    private readonly logger = new Logger(UsersSeedService.name);

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async onApplicationBootstrap() {
        await seedUsers(this.userRepository, this.logger);
    }
}