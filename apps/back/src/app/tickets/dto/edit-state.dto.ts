import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { TicketStatus } from "../entities/ticket.entity";

export enum editState {
    EDITED = 'cambiado',
    CLOSED = 'cerrado',
}

export class EditStatusDto {
    @IsEnum(TicketStatus, { message: 'status contiene un valor no válido' })
    status?: TicketStatus

    @IsString({ message: 'comment contiene un valor no válido' })
    @IsOptional()
    comment?: string
}

export class EditTicketDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsUUID()
    @IsOptional()
    assignedToUuid?: string;


    @IsOptional()
    @IsString()
    @MaxLength(255)
    comment?: string;
}

