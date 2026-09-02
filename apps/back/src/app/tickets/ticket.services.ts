import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { GetTicketsQueryDto } from './dto/get-tickets-query.dto';
import { History } from './entities/history.entity';

interface AuthenticatedUser {
    uuid: string;
    email: string;
    role: string;
}

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
        @InjectRepository(History) private historyRepository: Repository<History>,
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

    async getTicketById(id: string, currentUser: AuthenticatedUser) {
        const ticket = await this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.assignedTo', 'assignedTo')
            .where('ticket.uuid = :id', { id })
            .getOne();

        if (!ticket) {
            return {
                statusCode: 404,
                error: 'No encontrado',
                message: `Ticket con uuid ${id} no encontrado.`,
            };
        }

        if (currentUser.role?.toLowerCase() === 'agente') {
            if (ticket.assignedTo?.uuid !== currentUser.uuid) {
                return {
                    statusCode: 403,
                    error: 'Acceso denegado',
                    message: 'No cuentas con los permisos necesarios para acceder a este recurso.',
                };
            }
        }

        const history = await this.historyRepository
            .createQueryBuilder('history')
            .leftJoinAndSelect('history.modifierUser', 'modifierUser')
            .where('history.ticketUuid = :ticketUuid', { ticketUuid: id })
            .orderBy('history.date', 'ASC')
            .getMany();

        return {
            statusCode: 200,
            data: {
                uuid: ticket.uuid,
                ticketCode: ticket.ticketCode,
                category: ticket.category,
                description: ticket.description,
                assignedTo: ticket.assignedTo ? {
                    uuid: ticket.assignedTo.uuid,
                    fullName: ticket.assignedTo.fullName,
                } : null,
                createdAt: ticket.openAt,
                updatedAt: ticket.closedAt ?? ticket.openAt,
                status: ticket.status,
                history: history.map((h) => ({
                    date: h.date,
                    updatedBy: h.modifierUser ? {
                        uuid: h.modifierUser.uuid,
                        fullName: h.modifierUser.fullName,
                    } : null,
                    field: 'status',
                    prevValue: h.lasState ?? '',
                    newValue: h.actualState ?? '',
                    comment: h.comment ?? '',
                })),
            },
        };
    }
}