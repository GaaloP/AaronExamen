import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { History } from '../../entities/history.entity';
import { Ticket, TicketStatus } from '../../entities/ticket.entity';
import { AuthenticatedUser } from '../../dto/autenticated-user.dto';
import { TicketsService } from '../../ticket.services';

const createQueryBuilderMock = () => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getManyAndCount: jest.fn(),
});

describe('TicketsService - guard de aislamiento de agente', () => {
    let service: TicketsService;
    let ticketRepository: any;
    let historyRepository: any;

    const agentA: AuthenticatedUser = {
        uuid: 'agent-001',
        email: 'agentA@test.com',
        role: 'user',
    };

    const agentB: AuthenticatedUser = {
        uuid: 'agent-002',
        email: 'agentB@test.com',
        role: 'user',
    };

    const createTicket = (overrides: Partial<any> = {}) => ({
        uuid: 'ticket-100',
        ticketCode: 123,
        category: 'Soporte técnico',
        description: 'Fallo del sistema',
        status: TicketStatus.OPEN,
        assignedTo: { uuid: agentA.uuid, fullName: 'Agente A' },
        openAt: new Date('2026-08-01T10:00:00Z'),
        closedAt: null,
        ...overrides,
    });

    beforeEach(async () => {
        ticketRepository = {
            createQueryBuilder: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        historyRepository = {
            createQueryBuilder: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TicketsService,
                { provide: getRepositoryToken(Ticket), useValue: ticketRepository },
                { provide: getRepositoryToken(History), useValue: historyRepository },
            ],
        })
            .overrideProvider(getRepositoryToken(Ticket))
            .useValue(ticketRepository)
            .overrideProvider(getRepositoryToken(History))
            .useValue(historyRepository)
            .compile();

        service = module.get<TicketsService>(TicketsService);
    });

    it('permite ver un ticket propio y devolver su detalle', async () => {
        const myTicket = createTicket();
        const ticketQuery = createQueryBuilderMock();
        const historyQuery = createQueryBuilderMock();

        ticketQuery.getOne.mockResolvedValue(myTicket);
        historyQuery.getMany.mockResolvedValue([]);

        ticketRepository.createQueryBuilder.mockReturnValue(ticketQuery);
        historyRepository.createQueryBuilder.mockReturnValue(historyQuery);

        const result = await service.getTicketById(myTicket.uuid, agentA);

        expect(result.statusCode).toBe(200);
        if (result.statusCode !== 200 || !result.data) {
            throw new Error('Se esperaba un ticket válido cuando el agente es propietario');
        }

        expect(result.data.uuid).toBe(myTicket.uuid);
        expect(result.data.assignedTo?.uuid).toBe(agentA.uuid);
    });

    it('bloquea la vista de un ticket ajeno para un agente', async () => {
        const foreignTicket = createTicket({
            uuid: 'ticket-200',
            assignedTo: { uuid: agentB.uuid, fullName: 'Agente B' },
        });

        const ticketQuery = createQueryBuilderMock();
        ticketQuery.getOne.mockResolvedValue(foreignTicket);
        ticketRepository.createQueryBuilder.mockReturnValue(ticketQuery);

        const result = await service.getTicketById(foreignTicket.uuid, agentA);

        expect(result.statusCode).toBe(403);
        expect(result.error).toBe('Acceso denegado');
        expect(result.message).toContain('permisos');
    });

    describe('transiciones permitidas (partición de equivalencia)', () => {
        it.each([
            ['open -> in_progress', TicketStatus.OPEN, TicketStatus.IN_PROGRESS],
            ['in_progress -> closed', TicketStatus.IN_PROGRESS, TicketStatus.CLOSED],
        ])('acepta %s', async (_name, currentStatus, nextStatus) => {
            const ticket = createTicket({
                status: currentStatus,
                assignedTo: { uuid: agentA.uuid, fullName: 'Agente A' },
            });

            const currentTicketQuery = createQueryBuilderMock();
            const updateQuery = createQueryBuilderMock();

            currentTicketQuery.getOne.mockResolvedValue(ticket);
            updateQuery.execute.mockResolvedValue({ affected: 1 });

            ticketRepository.createQueryBuilder
                .mockReturnValueOnce(currentTicketQuery)
                .mockReturnValueOnce(updateQuery);

            historyRepository.create.mockReturnValue({});
            historyRepository.save.mockResolvedValue({});

            const result = await service.editstatus(ticket.uuid, { status: nextStatus, comment: 'Cambio válido' }, agentA);

            expect(result.statusCode).toBe(200);
            if (result.statusCode !== 200 || !result.editedTicket) {
                throw new Error('Se esperaba un ticket editado válido para una transición permitida');
            }

            expect(result.editedTicket.status).toBe(nextStatus);
        });
    });

    describe('transiciones prohibidas (partición de equivalencia)', () => {
        it.each([
            ['open -> closed', TicketStatus.OPEN, TicketStatus.CLOSED],
            ['in_progress -> open', TicketStatus.IN_PROGRESS, TicketStatus.OPEN],
            ['closed -> open', TicketStatus.CLOSED, TicketStatus.OPEN],
        ])('rechaza %s', async (_name, currentStatus, nextStatus) => {
            const ticket = createTicket({
                status: currentStatus,
                assignedTo: { uuid: agentA.uuid, fullName: 'Agente A' },
            });

            const currentTicketQuery = createQueryBuilderMock();
            currentTicketQuery.getOne.mockResolvedValue(ticket);
            ticketRepository.createQueryBuilder.mockReturnValue(currentTicketQuery);

            const result = await service.editstatus(ticket.uuid, { status: nextStatus, comment: 'Cambio inválido' }, agentA);

            expect(result.statusCode).toBe(409);
            expect(result.error).toBe('Conflicto de registro');
            expect(result.message).toContain('regla de transiciones');
        });

        it('impide que un agente reabra un ticket cerrado', async () => {
            const ticket = createTicket({
                status: TicketStatus.CLOSED,
                assignedTo: { uuid: agentA.uuid, fullName: 'Agente A' },
            });

            const currentTicketQuery = createQueryBuilderMock();
            currentTicketQuery.getOne.mockResolvedValue(ticket);
            ticketRepository.createQueryBuilder.mockReturnValue(currentTicketQuery);

            const result = await service.editstatus(ticket.uuid, { status: TicketStatus.OPEN, comment: 'Reapertura no permitida' }, agentA);

            expect(result.statusCode).toBe(409);
            expect(result.message).toContain('regla de transiciones');
        });
    });

    it('bloquea que un agente modifique o cree un ticket asignándolo a otro agente', async () => {
        const ticket = createTicket({
            assignedTo: { uuid: agentA.uuid, fullName: 'Agente A' },
        });

        const currentTicketQuery = createQueryBuilderMock();
        const updateQuery = createQueryBuilderMock();

        currentTicketQuery.getOne.mockResolvedValue(ticket);
        updateQuery.execute.mockResolvedValue({ affected: 1 });

        ticketRepository.createQueryBuilder
            .mockReturnValueOnce(currentTicketQuery)
            .mockReturnValueOnce(updateQuery);

        const result = await service.editTicket(ticket.uuid, {
            category: 'Facturación',
            description: 'Intento de reasignación no permitida',
            assignedToUuid: agentB.uuid,
            comment: 'Se intenta asignarlo a otro agente',
        }, agentA);

        expect(result.statusCode).toBe(403);
        expect(result.error).toBe('Acceso denegado');
        expect(result.message).toContain('permisos');
    });
});
