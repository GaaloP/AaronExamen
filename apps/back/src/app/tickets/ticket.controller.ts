import { BadRequestException, Controller, Get, Query, Req, Version, ValidationPipe, UseGuards, Param, ParseUUIDPipe } from '@nestjs/common';
import type { Request } from 'express';
import { GetTicketsQueryDto } from './dto/get-tickets-query.dto';
import { TicketsService } from './ticket.services';
import { JwtGuard } from '../auth/guards/jwt.guard';

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
        const currentUser = req.user;
        return this.ticketsService.findAll(query, currentUser);
    }

    @Get(':id')
    @Version('1')
    @UseGuards(JwtGuard)
    getTicketById(
        @Param('id', ParseUUIDPipe) id: string,
        @Req() req: RequestWithUser,
    ) {
        const currentUser = req.user;
        return this.ticketsService.getTicketById(id, currentUser);
    }
}