import { BadRequestException, Controller, Get, Query, Req, Version, ValidationPipe, Param, ParseUUIDPipe, Patch, Body, Post } from '@nestjs/common';
import type { Request } from 'express';
import { TicketsService } from './tickets.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../users/user.entity';
import type { GetPaginatedTicketsDto } from './dto/get-tickets-query.dto';
import type { EditStatusDto } from './dto/edit-ticket-status.dto';
import type { EditTicketDto } from './dto/edit-ticket.dto';
import type { CreateTicketDto } from './dto/create-ticket.dto';

type RequestWithUser = Request & {
    user: { uuid: string; email: string; role: string };
};

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Get()
    @Version('1')
    @Auth(UserRole.SUPERVISOR, UserRole.AGENT)
    findAll(
        @Query(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                exceptionFactory: () =>
                    new BadRequestException({
                        error: 'Petición inválida',
                        message: 'Los parámetros de búsqueda contienen valores no válidos.',
                    }),
            }),
        ) query: GetPaginatedTicketsDto,
        @Req() req: RequestWithUser,
    ) {
        const currentUser = req.user;
        return this.ticketsService.findAll(query, currentUser);
    }

    @Get(':id')
    @Version('1')
    @Auth(UserRole.SUPERVISOR, UserRole.AGENT)
    getTicketById(
        @Param('id', ParseUUIDPipe) id: string,
        @Req() req: RequestWithUser,
    ) {
        const currentUser = req.user;
        return this.ticketsService.getTicketById(id, currentUser);
    }

    @Patch(':id/status')
    @Version('1')
    @Auth(UserRole.SUPERVISOR, UserRole.AGENT)
    editStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                exceptionFactory: () =>
                    new BadRequestException({
                        statusCode: 400,
                        error: 'Petición inválida',
                        message: 'Los parámetros contienen valores no válidos.',
                    }),
            }),
        )
        payload: EditStatusDto,
        @Req() req: RequestWithUser
    ) {
        const userInfo = req.user;
        return this.ticketsService.editstatus(id, payload, userInfo);
    }

    @Patch(':id')
    @Version('1')
    @Auth(UserRole.SUPERVISOR, UserRole.AGENT)
    editTicket(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                exceptionFactory: () =>
                    new BadRequestException({
                        statusCode: 400,
                        error: 'Petición inválida',
                        message: 'Los parámetros contienen valores no válidos.',
                    }),
            }),
        ) payload: EditTicketDto,
        @Req() req: RequestWithUser,) {
        const currentUser = req.user;
        return this.ticketsService.editTicket(id, payload, currentUser);
    }

    @Post()
    @Version('1')
    @Auth(UserRole.SUPERVISOR, UserRole.AGENT)
    createTicket(
        @Body() payload: CreateTicketDto,
        @Req() req: RequestWithUser
    ) {
        const currentUser = req.user;
        return this.ticketsService.createTicket(payload, currentUser);
    }
} 