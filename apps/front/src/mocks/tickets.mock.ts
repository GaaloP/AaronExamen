import {
  AgentDto,
  ApiErrorResponseDto,
  CreateTicketRequestDto,
  CreateTicketResponseDto,
  GetAgentsResponseDto,
  TICKET_API_ERRORS,
  TICKET_STATUS,
  buildAgentNotFoundError,
} from '../contracts/tickets.contract';

const MOCK_AGENTS: AgentDto[] = [
  { uuid: 'uuid-agente-001', fullName: 'Agente de Prueba' },
  { uuid: 'uuid-agente-002', fullName: 'Laura Jiménez' },
  { uuid: 'uuid-agente-003', fullName: 'Carlos Medina' },
];

export class MockTicketApiError extends Error {
  constructor(public response: ApiErrorResponseDto) {
    super(response.message);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let mockTicketSequence = 3;

export async function mockGetAgents(): Promise<GetAgentsResponseDto> {
  await delay(400);
  return { statusCode: 200, data: MOCK_AGENTS };
}

interface MockCurrentUser {
  uuid: string;
  fullName: string;
  role: string;
}

export async function mockCreateTicket(
  dto: CreateTicketRequestDto,
  currentUser: MockCurrentUser
): Promise<CreateTicketResponseDto> {
  await delay(600);

  if (!dto.category || !dto.description) {
    throw new MockTicketApiError(TICKET_API_ERRORS[400]);
  }

  let assignedTo: { uuid: string; fullName: string };

  if (currentUser.role === 'agente') {
    if (dto.assignedToUuid && dto.assignedToUuid !== currentUser.uuid) {
      throw new MockTicketApiError(TICKET_API_ERRORS[403]);
    }
    assignedTo = { uuid: currentUser.uuid, fullName: currentUser.fullName };
  } else {
    if (!dto.assignedToUuid) {
      throw new MockTicketApiError(TICKET_API_ERRORS[400]);
    }
    const found = MOCK_AGENTS.find((a) => a.uuid === dto.assignedToUuid);
    if (!found) {
      throw new MockTicketApiError(buildAgentNotFoundError(dto.assignedToUuid));
    }
    assignedTo = found;
  }

  mockTicketSequence += 1;
  const now = new Date().toISOString();

  return {
    statusCode: 201,
    data: {
      uuid: `uuid-tck-${mockTicketSequence}`,
      ticketCode: `TCK-${String(mockTicketSequence).padStart(3, '0')}`,
      category: dto.category,
      description: dto.description,
      assignedTo,
      createdAt: now,
      createdBy: { uuid: currentUser.uuid, fullName: currentUser.fullName },
      updatedAt: now,
      status: TICKET_STATUS.ABIERTO,
      closedAt: null,
    },
  };
}