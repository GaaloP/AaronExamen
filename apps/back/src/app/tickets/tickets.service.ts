import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { History } from './entities/history.entity';
import type { GetPaginatedTicketsDto } from './dto/get-tickets-query.dto';
import type { AuthenticatedUser } from '../auth/authenticated-user.interface';
import type { EditStatusDto } from './dto/edit-ticket-status.dto';
import type { EditTicketDto } from './dto/edit-ticket.dto';
import { UserRole } from '../users/user.entity';
import { User } from '../users/user.entity';
import type { CreateTicketDto } from './dto/create-ticket.dto';


@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
        @InjectRepository(History) private historyRepository: Repository<History>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async findAll(query: GetPaginatedTicketsDto, currentUser: AuthenticatedUser) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const qb = this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.assignedTo', 'assignedTo');

        if (query.status) {
            qb.andWhere('ticket.status = :status', { status: query.status });
        }

        if (currentUser.role === UserRole.AGENT) {
            qb.andWhere('assignedTo.uuid = :agentUuid', { agentUuid: currentUser.uuid });
        }
        qb.orderBy('ticket.createdAt', 'DESC')
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

        if (currentUser.role === UserRole.AGENT) {
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
                createdAt: ticket.createdAt,
                status: ticket.status,
                history: history.map((h) => ({
                    date: h.date,
                    updatedBy: h.modifierUser ? {
                        uuid: h.modifierUser.uuid,
                        fullName: h.modifierUser.fullName,
                    } : null,
                    field: 'status',
                    prevValue: h.lastState ?? '',
                    newValue: h.actualState ?? '',
                    comment: h.comment ?? '',
                })),
            },
        };
    }

    async editstatus(id: string, payload: EditStatusDto, currentUser: AuthenticatedUser) {
        const ticket = await this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.assignedTo', 'assignedTo')
            .where('ticket.uuid = :id', { id })
            .getOne();

        if (!ticket) {
            return {
                statusCode: 404,
                error: 'No encontrado',
                message: `El ticket con uuid ${id} no existe.`,
            };
        }

        if (currentUser.role === UserRole.AGENT) {
            if (ticket.assignedTo?.uuid !== currentUser.uuid) {
                return {
                    statusCode: 403,
                    error: 'Acceso denegado',
                    message: 'No cuentas con los permisos necesarios para crear este recurso.',
                };
            }
        }

        const validTransitions: Record<TicketStatus, TicketStatus[]> = {
            [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS],
            [TicketStatus.IN_PROGRESS]: [TicketStatus.CLOSED],
            [TicketStatus.CLOSED]: [],
        };

        const currentStatus = ticket.status as TicketStatus;
        const newStatus = payload.status as TicketStatus;

        if (!validTransitions[currentStatus]?.includes(newStatus)) {
            return {
                statusCode: 409,
                error: 'Conflicto de registro',
                message: 'No se pudo editar estado porque no se cumple con la regla de transiciones',
            };
        }

        try {
            await this.ticketRepository
                .createQueryBuilder('ticket')
                .update()
                .set({
                    status: newStatus,
                    closedAt: newStatus === TicketStatus.CLOSED ? new Date() : null
                })
                .where('uuid = :id', { id })
                .execute();

            const historyEntry = this.historyRepository.create({
                modifierUser: { uuid: currentUser.uuid } as any,
                ticketUuid: id,
                lastState: currentStatus,
                actualState: newStatus,
                comment: payload.comment || 'status updated',
            });

            await this.historyRepository.save(historyEntry);

            return {
                statusCode: 200,
                editedTicket: {
                    uuid: ticket.uuid,
                    ticketCode: ticket.ticketCode,
                    category: ticket.category,
                    description: ticket.description,
                    assignedTo: ticket.assignedTo?.fullName || null,
                    createdAt: ticket.createdAt,
                    createdBy: ticket.assignedTo?.fullName || null,
                    status: newStatus,
                    closedAt: newStatus === TicketStatus.CLOSED ? new Date().toISOString() : '',
                },
            };

        } catch (error) {
            return {
                statusCode: 500,
                error: 'Error interno del servidor',
                message: 'Ocurrió un error inesperado al procesar la solicitud.',
            };
        }
    }

    async editTicket(id: string, payload: EditTicketDto, currentUser: AuthenticatedUser) {
        const currentTicket = await this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.assignedTo', 'assignedTo')
            .where('ticket.uuid = :id', { id })
            .getOne();

        if (!currentTicket) {
            return {
                statusCode: 404,
                error: 'No encontrado',
                message: `El ticket con uuid ${id} no existe.`,
            };
        }

        if (currentUser.role === UserRole.AGENT) {
            if (currentTicket.assignedTo?.uuid !== currentUser.uuid) {
                return {
                    statusCode: 403,
                    error: 'Acceso denegado',
                    message: 'No cuentas con los permisos necesarios para editar este recurso.',
                };
            }

            if (payload.assignedToUuid !== undefined) {
                return {
                    statusCode: 403,
                    error: 'Acceso denegado',
                    message: 'Los agentes no pueden reasignar tickets.',
                };
            }
        }

        const ticket = await this.ticketRepository
            .createQueryBuilder()
            .update(Ticket)
            .set({
                category: payload.category,
                description: payload.description,
                assignedTo: payload.assignedToUuid ? { uuid: payload.assignedToUuid } as any : undefined
            })
            .where('uuid = :id', { id })
            .execute();
        if (ticket.affected === 0) {
            return {
                statusCode: 404,
                error: 'No encontrado',
                message: `El ticket con uuid ${id} no existe.`,
            };
        }

        const ticketActualizado = await this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.assignedTo', 'assignedTo')
            .where('ticket.uuid = :id', { id })
            .getOne();

        const historyEntry = this.historyRepository.create({
            date: ticketActualizado?.createdAt,
            modifierUser: { uuid: ticketActualizado?.createdBy?.uuid } as any,
            ticketUuid: id,
            actualState: ticketActualizado?.status as TicketStatus,
            comment: payload.comment || 'Se creo el ticket',
        });

        await this.historyRepository.save(historyEntry);

        return {
            editedTicket: {
                uuid: ticketActualizado?.uuid,
                ticketCode: ticketActualizado?.ticketCode,
                category: ticketActualizado?.category,
                description: ticketActualizado?.description,
                assignedTo: ticketActualizado?.assignedTo?.fullName || null,
                createdAt: ticketActualizado?.createdAt,
                createdBy: ticketActualizado?.assignedTo?.fullName || null,
                status: ticketActualizado?.status,
                closedAt: ticketActualizado?.closedAt
            }
        }
    }

    async createTicket(payload: CreateTicketDto, currentUser: AuthenticatedUser) {

        if (currentUser.role !== UserRole.SUPERVISOR && payload.assignedToUuid ) throw new ForbiddenException('No cuentas con los permisos necesarios para crear este recurso.');

        if (payload.assignedToUuid) {
            const assignedUser = await this.userRepository.findOneBy({
                uuid: payload.assignedToUuid,
            });

            if (!assignedUser) {
                throw new NotFoundException('El usuario asignado no existe.');
            }
        }
        
        

        const assignedToUuid = currentUser.role == UserRole.AGENT ? currentUser.uuid : payload.assignedToUuid;
        const newTicket = this.ticketRepository.create({
            category: payload.category,
            description: payload.description,
            assignedTo: assignedToUuid ? {uuid: assignedToUuid} as any : undefined,
            createdBy: { uuid: currentUser.uuid } as any,
            status: TicketStatus.OPEN,
        });

        const savedTicket = await this.ticketRepository.save(newTicket);

        const historyEntry = this.historyRepository.create({
            date: new Date(),
            modifierUser: { uuid: currentUser.uuid } as any,
            ticketUuid: savedTicket.uuid,
            actualState: TicketStatus.OPEN,
            comment: 'Ticket creado',
        });

        await this.historyRepository.save(historyEntry);

        return savedTicket;
    }
}