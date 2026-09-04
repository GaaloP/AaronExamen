export const CREATE_TICKET_ENDPOINT = {
  method: 'POST',
  path: '/api/v1/tickets',
  headers: { 'Content-Type': 'application/json' },
} as const;

export const GET_AGENTS_ENDPOINT = {
  method: 'GET',
  path: '/api/v1/agents/',
} as const;

export const TICKET_CATEGORIES = [ //Lista cat de ticket
  'Soporte técnico',
  'Facturación',
  'Cuenta',
  'Otro',
] as const;
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

export const TICKET_STATUS = {
  ABIERTO: 'Abierto',
  EN_PROGRESO: 'En progreso',
  CERRADO: 'Cerrado',
} as const;

export interface CreateTicketRequestDto {
  category: string;
  description: string;
  assignedToUuid?: string;
}

export interface TicketPersonDto {
  uuid: string;
  fullName: string;
}

export interface CreateTicketResponseDto {
  statusCode: 201;
  data: {
    uuid: string;
    ticketCode: string;
    category: string;
    description: string;
    assignedTo: TicketPersonDto | null;
    createdAt: string;
    createdBy: TicketPersonDto;
    updatedAt: string;
    status: string;
    closedAt: string | null;
  };
}

export interface AgentDto {
  uuid: string;
  fullName: string;
}

export interface GetAgentsResponseDto {
  statusCode: 200;
  data: AgentDto[];
}

export interface ApiErrorResponseDto {
  statusCode: 400 | 401 | 403 | 404 | 500;
  error: string;
  message: string;
}

export const TICKET_API_ERRORS: Record<400 | 401 | 403 | 500, ApiErrorResponseDto> = {
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
  403: {
    statusCode: 403,
    error: 'Acceso denegado',
    message: 'No cuentas con los permisos necesarios para crear este recurso.',
  },
  500: {
    statusCode: 500,
    error: 'Error interno del servidor',
    message: 'Ocurrió un error inesperado al procesar la solicitud.',
  },
};

export function buildAgentNotFoundError(uuid: string): ApiErrorResponseDto {
  return {
    statusCode: 404,
    error: 'No encontrado',
    message: `Agente asignado con uuid ${uuid} no encontrado.`,
  };
}