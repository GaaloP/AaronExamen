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
                message = 'Los parámetros contienen valores no válidos.';
            } else if (status === HttpStatus.UNAUTHORIZED) {
                error = 'No autorizado';
                message =
                    typeof res === 'object' && (res as any).message
                        ? (res as any).message
                        : 'Las credenciales son incorrectas';
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