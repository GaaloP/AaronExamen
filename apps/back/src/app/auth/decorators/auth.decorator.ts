import { applyDecorators, UseGuards } from "@nestjs/common";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { JwtGuard } from "../guards/jwt.guard";

export function Auth(...roles: string[]) {
    return applyDecorators(
        Roles(...roles),
        UseGuards(JwtGuard, RolesGuard)
    )
}