import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketCategory, TicketStatus } from './entities/ticket.entity';
import { GetTicketsQueryDto } from './dto/get-tickets-query.dto';
import { History } from './entities/history.entity';
import { EditStatusDto, EditTicketDto } from './dto/edit-ticket.dto';
import { AuthenticatedUser } from './dto/autenticated-user.dto';


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

        // Agentes solo ven sus propios tickets
        if (currentUser.role?.toLowerCase() === 'user') {
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

        // Agentes solo pueden ver tickets asignados a ellos
        if (currentUser.role?.toLowerCase() === 'user') {
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
                    prevValue: h.lasState ?? '',
                    newValue: h.actualState ?? '',
                    comment: h.comment ?? '',
                })),
            },
        };
    }

    async editstatus(id: string, payload: EditStatusDto, currentUser: AuthenticatedUser) {
        // Obtener el ticket actual
        const ticket = await this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.assignedTo', 'assignedTo')
            .where('ticket.uuid = :id', { id })
            .getOne();

        // Validar que el ticket existe
        if (!ticket) {
            return {
                statusCode: 404,
                error: 'No encontrado',
                message: `El ticket con uuid ${id} no existe.`,
            };
        }

        // Validar permisos: agentes solo pueden editar sus propios tickets
        if (currentUser.role?.toLowerCase() === 'user') {
            if (ticket.assignedTo?.uuid !== currentUser.uuid) {
                return {
                    statusCode: 403,
                    error: 'Acceso denegado',
                    message: 'No cuentas con los permisos necesarios para crear este recurso.',
                };
            }
        }

        // Validar transiciones de estado según regla de negocio
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
            // Actualizar solo el status del ticket
            await this.ticketRepository
                .createQueryBuilder('ticket')
                .update()
                .set({
                    status: newStatus,
                    closedAt: newStatus === TicketStatus.CLOSED ? new Date() : null
                })
                .where('uuid = :id', { id })
                .execute();

            // Registrar en historial
            const historyEntry = this.historyRepository.create({
                date: new Date(),
                modifierUser: { uuid: currentUser.uuid } as any,
                ticketUuid: id,
                lasState: currentStatus,
                actualState: newStatus,
                comment: payload.comment || 'status updated',
            });

            await this.historyRepository.save(historyEntry);

            // Retornar ticket actualizado
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
        const ticket = await this.ticketRepository
            .createQueryBuilder()
            .update(Ticket)
            .set({
                category: payload.category == typeof TicketCategory ? TicketCategory[payload.category] as any : undefined,
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
            date: new Date(),
            modifierUser: { uuid: currentUser.uuid } as any,
            ticketUuid: id,
            lasState: ticketActualizado?.status as TicketStatus,
            actualState: ticketActualizado?.status as TicketStatus,
            comment: payload.comment || 'ticket updated',
        });

        await this.historyRepository.save(historyEntry);

        return {
            editedTicket: {
                uuid: ticketActualizado?.uuid,
                ticketCode: ticketActualizado?.ticketCode,
                category: ticketActualizado?.category,
                description: ticketActualizado?.description,
                assignedTo: ticketActualizado?.assignedTo?.fullName || null,
                createdAt: ticketActualizado?.openAt,
                createdBy: ticketActualizado?.assignedTo?.fullName || null,
                status: ticketActualizado?.status,
                closedAt: ticketActualizado?.closedAt
            }
        }
    }
}