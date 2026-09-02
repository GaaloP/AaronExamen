import { BadRequestException, Controller, Get, Query, Req, Version, ValidationPipe, UseGuards, Param, ParseUUIDPipe, Patch, Body } from '@nestjs/common';
import type { Request } from 'express';
import { GetTicketsQueryDto } from './dto/get-tickets-query.dto';
import { TicketsService } from './ticket.services';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { EditStatusDto } from './dto/edit-state.dto';
import { AuthenticatedUser } from './dto/autenticated-user.dto';

type RequestWithUser = Request & {
    user: { uuid: string; email: string; role: string };
};

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Get()
    @Version('1')
    @UseGuards(JwtGuard)
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
        )
        query: GetTicketsQueryDto,
        @Req() req: RequestWithUser,
    ) {
        const currentUser: AuthenticatedUser = req.user;
        return this.ticketsService.findAll(query, currentUser);
    }

    @Get(':id')
    @Version('1')
    @UseGuards(JwtGuard)
    getTicketById(
        @Param('id', ParseUUIDPipe) id: string,
        @Req() req: RequestWithUser,
    ) {
        const currentUser: AuthenticatedUser = req.user;
        return this.ticketsService.getTicketById(id, currentUser);
    }

    @Patch(':id/status')
    @Version('1')
    @UseGuards(JwtGuard)
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
        const userInfo: AuthenticatedUser = req.user;
        return this.ticketsService.editstatus(id, payload, userInfo);
    }
}