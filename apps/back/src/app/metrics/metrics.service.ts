import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from '../tickets/entities/ticket.entity';
import { MetricsDto } from './dto/metrics.dto';

@Injectable()
export class MetricsService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
    ) { }

    private calculateTotalSolutionTime(tickets: Ticket[]): number {
        return tickets.reduce((total, ticket) => {
            if (!ticket.closedAt) return total;

            return total + ticket.closedAt.getTime() - ticket.createdAt.getTime();
        }, 0);
    }

    private calculateAverageSolutionTime(totalTime: number, ticketsCount: number): number {
        if (ticketsCount === 0) return 0;

        const averageTimeInMilliseconds = totalTime / ticketsCount;
        return Number((averageTimeInMilliseconds / (1000 * 60 * 60)).toFixed(2));
    }

    async getMetrics(): Promise<MetricsDto> {
        const openedTicketsCount = await this.ticketRepository.countBy({ status: TicketStatus.OPEN }); 

        const inProgressTicketsCount = await this.ticketRepository.countBy({ status: TicketStatus.IN_PROGRESS });
        
        const closedTicketsCount = await this.ticketRepository.countBy({ status: TicketStatus.CLOSED });
        

        const closedTickets = await this.ticketRepository.find({
            where: { status: TicketStatus.CLOSED },
            select: {
                createdAt: true,
                closedAt: true,
            },
        });

        const totalSolutionTime = this.calculateTotalSolutionTime(closedTickets);
        const averageSolutionTime = this.calculateAverageSolutionTime(
            totalSolutionTime,
            closedTickets.filter((ticket) => ticket.closedAt).length,
        );

        return {
            metricData: {
                openedTicketsCount,
                inProgressTicketsCount,
                closedTicketsCount,
                averageSolutionTime,
            },
        };
    }
}