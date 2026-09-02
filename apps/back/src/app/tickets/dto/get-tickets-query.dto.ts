import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { TicketStatus } from '../ticket.entity';

export class GetTicketsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'page debe ser un número entero' })
    @Min(1, { message: 'page debe ser mayor o igual a 1' })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'limit debe ser un número entero' })
    @Min(1, { message: 'limit debe ser mayor o igual a 1' })
    limit?: number = 10;

    @IsOptional()
    @IsEnum(TicketStatus, { message: 'status contiene un valor no válido' })
    status?: TicketStatus;
}