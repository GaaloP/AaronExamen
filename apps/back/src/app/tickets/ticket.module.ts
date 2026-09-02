import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { History } from './entities/history.entity';
import { TicketsController } from './ticket.controller';
import { TicketsService } from './ticket.services';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Ticket, History]), AuthModule],
    controllers: [TicketsController],
    providers: [TicketsService],
})
export class TicketsModule { }