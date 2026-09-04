import { AgentDto, CreateTicketRequestDto, CreateTicketResponseDto } from '../contracts/tickets.contract';
import { mockCreateTicket, mockGetAgents, MockTicketApiError } from '../mocks/tickets.mock';

export class TicketServiceError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

interface CurrentUser {
  uuid: string;
  fullName: string;
  role: string;
}

export async function getAgents(): Promise<AgentDto[]> {
  const response = await mockGetAgents();
  return response.data;
}

export async function createTicket(
  dto: CreateTicketRequestDto,
  currentUser: CurrentUser
): Promise<CreateTicketResponseDto['data']> {
  try {
    const response = await mockCreateTicket(dto, currentUser);
    return response.data;
  } catch (err) {
    if (err instanceof MockTicketApiError) {
      throw new TicketServiceError(err.response.statusCode, err.response.message);
    }
    throw new TicketServiceError(500, 'Ocurrió un error inesperado al prcesar la solicitud.');
  }
}