import { LoginRequestDto, LoginSuccessResponseDto } from '../contracts/auth.contract';
import { mockLogin, MockApiError } from '../mocks/auth.mock';

export class AuthServiceError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export async function login(dto: LoginRequestDto): Promise<LoginSuccessResponseDto> {
  try {
    return await mockLogin(dto);
  } catch (err) {
    if (err instanceof MockApiError) {
      throw new AuthServiceError(err.response.statusCode, err.response.message);
    }
    throw new AuthServiceError(500, 'Ocurrió un error inesperado al procesar la solicitud.');
  }
}