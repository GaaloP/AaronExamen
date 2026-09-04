import { Controller, Get, Version } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../users/user.entity';
import { AgentsDto } from './dto/agents.dto';
import { AgentsService } from './agents.service';

@Controller('agents')
export class AgentsController {
    constructor(private readonly agentsService: AgentsService) { }

    @Get()
    @Version('1')
    @Auth(UserRole.SUPERVISOR)
    getAgents(): Promise<AgentsDto> {
        return this.agentsService.getAgents();
    }
}
