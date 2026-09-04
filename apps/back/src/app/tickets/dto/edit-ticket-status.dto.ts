import { IsEnum, IsOptional, IsString } from "class-validator";
import { TicketStatus } from "../entities/ticket.entity";


export class EditStatusDto {
    @IsEnum(TicketStatus, { message: 'status contiene un valor no válido' })
    status!: TicketStatus

    @IsString({ message: 'comment contiene un valor no válido' })
    @IsOptional()
    comment?: string
}