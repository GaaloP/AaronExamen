import { IsEmail, IsString, IsUUID } from "class-validator";

export class AuthenticatedUser {
    @IsUUID()
    uuid?: string;

    @IsEmail()
    email?: string;

    @IsString()
    role?: string;
}