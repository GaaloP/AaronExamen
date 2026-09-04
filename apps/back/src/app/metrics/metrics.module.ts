import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Ticket } from '../tickets/entities/ticket.entity';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
    imports: [TypeOrmModule.forFeature([Ticket]), AuthModule],
    controllers: [MetricsController],
    providers: [MetricsService],
})
export class MetricsModule { }