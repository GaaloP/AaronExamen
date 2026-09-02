/**
 * Estructuras para login tomadas  de las notas técnicas :p
 */

export const AUTH_LOGIN_ENDPOINT = {
  method: 'POST',
  path: '/api/v1/auth/login',
  headers: { 'Content-Type': 'application/json' },
} as const;

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthUserDto {
  role: string;
  fullName: string;
  uuid: string;
}

export interface LoginSuccessResponseDto {
  message: string;
  data: {
    accessToken: string;
    expiresIn: number;
    user: AuthUserDto;
  };
}

export interface ApiErrorResponseDto {
  statusCode: 400 | 401 | 500;
  error: string;
  message: string;
}

export const API_ERRORS: Record<400 | 401 | 500, ApiErrorResponseDto> = {
  400: {
    statusCode: 400,
    error: 'Petición inválida',
    message: 'Los parámetros contienen valores no válidos.',
  },
  401: {
    statusCode: 401,
    error: 'No autorizado',
    message: 'Las credenciales son incorrectas',
  },
  500: {
    statusCode: 500,
    error: 'Error interno del servidor',
    message: 'Ocurrió un error inesperado al procesar la solicitud.',
  },
};