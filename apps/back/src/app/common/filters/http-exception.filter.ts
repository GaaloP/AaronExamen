import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let error = 'Error interno del servidor';
        let message = 'Ocurrió un error inesperado al procesar la solicitud.';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();

            if (status === HttpStatus.BAD_REQUEST) {
                error = 'Petición inválida';
                message = typeof res === 'object' && (res as any).message
                    ? (res as any).message
                    : 'Los parámetros contienen valores no válidos.';
            } else if (status === HttpStatus.UNAUTHORIZED) {
                error = 'No autenticado';
                message = 'El token de autenticación no fue proporcionado o ha expirado.';
            } else if (typeof res === 'object' && (res as any).message) {
                message = (res as any).message;
                error = (res as any).error ?? error;
            }
        }

        response.status(status).json({
            statusCode: status,
            error,
            message,
        });
    }
}