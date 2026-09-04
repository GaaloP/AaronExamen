import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAgents, createTicket as createTicketService, TicketServiceError } from '../../services/tickets.service';
import { AgentDto, CreateTicketRequestDto } from '../../contracts/tickets.contract';

export interface TicketHistory {
  date: string;
  updatedBy: { uuid: string; fullName: string };
  field: string;
  prevValue: string;
  newValue: string;
  comment: string;
}

export interface TicketPerson {
  uuid: string;
  fullName: string;
}

export interface Ticket {
  uuid: string;
  ticketCode: string;
  category: string;
  status: string;
  assignedTo: TicketPerson | null;
  history: TicketHistory[];
  description?: string;
  createdBy?: TicketPerson;
  createdAt?: string;
  updatedAt?: string;
  closedAt?: string | null;
}

export interface TicketState {
  list: Ticket[];
  selectedTicket: Ticket | null;
  filter: string;
  page: number;
  limit: number;
  agentsCatalog: AgentDto[];
  agentsStatus: 'idle' | 'loading' | 'failed';
  createStatus: 'idle' | 'loading' | 'failed';
  createErrorMessage: string | null;
}

const initialTickets: Ticket[] = [
  {
    uuid: 'TCK-001',
    ticketCode: 'TCK-001',
    category: 'Soporte Técnico',
    status: 'Abierto',
    assignedTo: { uuid: 'USR-001', fullName: 'Juan Pérez' },
    history: [
      {
        date: '2023-10-25 10:00',
        updatedBy: { uuid: 'USR-000', fullName: 'Admin' },
        field: 'status',
        prevValue: 'Nuevo',
        newValue: 'Abierto',
        comment: 'Asignado a Juan',
      },
    ],
  },
  {
    uuid: 'TCK-002',
    ticketCode: 'TCK-002',
    category: 'Infraestructura',
    status: 'En progreso',
    assignedTo: { uuid: 'USR-002', fullName: 'María López' },
    history: [],
  },
  {
    uuid: 'TCK-003',
    ticketCode: 'TCK-003',
    category: 'Software',
    status: 'Cerrado',
    assignedTo: null,
    history: [],
  },
];

const initialState: TicketState = {
  list: initialTickets,
  selectedTicket: null,
  filter: 'Todos',
  page: 0,
  limit: 5,
  agentsCatalog: [],
  agentsStatus: 'idle',
  createStatus: 'idle',
  createErrorMessage: null,
};

export const fetchAgents = createAsyncThunk('tickets/fetchAgents', async () => {
  return await getAgents();
});

interface CreateTicketArgs {
  dto: CreateTicketRequestDto;
  currentUser: { uuid: string; fullName: string; role: string };
}

interface CreateTicketThunkConfig {
  rejectValue: string;
}

export const createTicket = createAsyncThunk<Ticket, CreateTicketArgs, CreateTicketThunkConfig>(
  'tickets/create',
  async ({ dto, currentUser }, { rejectWithValue }) => {
    try {
      const created = await createTicketService(dto, currentUser);
      return {
        uuid: created.uuid,
        ticketCode: created.ticketCode,
        category: created.category,
        status: created.status,
        assignedTo: created.assignedTo,
        history: [],
        description: created.description,
        createdBy: created.createdBy,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
        closedAt: created.closedAt,
      };
    } catch (err) {
      if (err instanceof TicketServiceError) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Ocurrió un error inesperado');
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
      state.page = 0;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 0;
    },
    setSelectedTicketByUuid: (state, action: PayloadAction<string>) => {
      const found = state.list.find((ticket) => ticket.uuid === action.payload);
      state.selectedTicket = found || null;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = 'idle';
      state.createErrorMessage = null;
    },
    updateTicket: (state, action: PayloadAction<{ uuid: string; changes: Partial<Ticket> }>) => {
      const idx = state.list.findIndex((t) => t.uuid === action.payload.uuid);
      if (idx !== -1) {
        state.list[idx] = { ...state.list[idx], ...action.payload.changes };
      }
    } 
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.agentsStatus = 'loading';
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.agentsStatus = 'idle';
        state.agentsCatalog = action.payload;
      })
      .addCase(fetchAgents.rejected, (state) => {
        state.agentsStatus = 'failed';
      })
      .addCase(createTicket.pending, (state) => {
        state.createStatus = 'loading';
        state.createErrorMessage = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.createStatus = 'idle';
        state.list.unshift(action.payload); // aparece de primero en el listado
        state.page = 0;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createErrorMessage = action.payload ?? 'Ocurrió un error inesperado';
      });
  },
});

export const {
  setFilter,
  setPage,
  setLimit,
  setSelectedTicketByUuid,
  clearSelectedTicket,
  resetCreateStatus,
  updateTicket,
} = ticketSlice.actions;

export default ticketSlice.reducer;