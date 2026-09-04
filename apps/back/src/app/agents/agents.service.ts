import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { AgentsDto } from './dto/agents.dto';

@Injectable()
export class AgentsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getAgents(): Promise<AgentsDto> {
        const agents = await this.userRepository.find({
            where: { role: UserRole.AGENT },
            select: {
                uuid: true,
                fullName: true,
            },
            order: {
                fullName: 'ASC',
            },
        });

        return {
            agents,
        };
    }
}
