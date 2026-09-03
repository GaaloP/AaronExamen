import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { TicketCategory, TicketStatus } from "../entities/ticket.entity";

export class EditTicketDto {
    @IsOptional()
    @IsEnum(TicketCategory, { message: 'Category contiene un valor no válido' })
    category?: TicketCategory;

    @IsOptional()
    @IsString({ message: 'Description contiene un valor no válido' })
    description?: string;

    @IsUUID(undefined, { message: 'assignedToUuid contiene un valor no válido' })
    @IsOptional()
    assignedToUuid?: string;


    @IsOptional()
    @IsString({ message: 'Comment contiene un valor no válido' })
    @MaxLength(255)
    comment?: string;
}

