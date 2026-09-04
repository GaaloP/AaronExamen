import { Controller, Get, Version } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../users/user.entity';
import { MetricsDto } from './dto/metrics.dto';

@Controller('metrics')
export class MetricsController {
    constructor(private readonly metricsService: MetricsService) { }

    @Get()
    @Version('1')
    @Auth(UserRole.SUPERVISOR)
    getMetrics(): Promise<MetricsDto> {
        return this.metricsService.getMetrics();
    }
}