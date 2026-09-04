import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { TicketCategory } from "../entities/ticket.entity";

export class EditTicketDto {
    @IsOptional()
    @IsEnum(TicketCategory, { message: 'Category contiene un valor no válido' })
    category?: TicketCategory;

    @IsOptional()
    @MaxLength(500, { message: 'Description no puede exceder los 500 caracteres' })
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

