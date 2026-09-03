import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { History } from './entities/history.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Ticket, History, User]), AuthModule],
    controllers: [TicketsController],
    providers: [TicketsService],
})
export class TicketsModule { }