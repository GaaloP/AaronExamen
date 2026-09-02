import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { GetTicketsQueryDto } from './dto/get-tickets-query.dto';

interface AuthenticatedUser {
    uuid: string;
    email: string;
    role: string;
}

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
    ) { }

    async findAll(query: GetTicketsQueryDto, currentUser: AuthenticatedUser) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const qb = this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.assignedTo', 'assignedTo');

        if (query.status) {
            qb.andWhere('ticket.status = :status', { status: query.status });
        }

        if (currentUser.role?.toLowerCase() === 'agente') {
            qb.andWhere('assignedTo.uuid = :agentUuid', { agentUuid: currentUser.uuid });
        }
        qb.orderBy('ticket.openAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [tickets, total] = await qb.getManyAndCount();
        const totalPages = Math.ceil(total / limit) || 1;

        return {
            statusCode: 200,
            data: tickets.map((ticket) => ({
                uuid: ticket.uuid,
                ticketCode: ticket.ticketCode,
                category: ticket.category,
                status: ticket.status,
                assignedTo: ticket.assignedTo ? {
                    uuid: ticket.assignedTo.uuid,
                    fullName: ticket.assignedTo.fullName,
                } : null,
            })),
            meta: {
                total,
                page,
                limit,
                totalPages,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
            },
        };
    }
}