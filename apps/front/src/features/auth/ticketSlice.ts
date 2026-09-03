import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface TicketHistory {
  date: string;
  updatedBy: { uuid: string; fullName: string };
  field: string;
  prevValue: string;
  newValue: string;
  comment: string;
}

export interface Ticket {
  uuid: string;
  ticketCode: string;
  category: string;
  status: string;
  assignedTo: { uuid: string; fullName: string } | null;
  history: TicketHistory[];
}

export interface TicketState {
  list: Ticket[];
  selectedTicket: Ticket | null;
  filter: string;
  page: number;
  limit: number;
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
        comment: 'Asignado a Juan' 
      }
    ]
  },
  {
    uuid: 'TCK-002',
    ticketCode: 'TCK-002',
    category: 'Infraestructura',
    status: 'En progreso',
    assignedTo: { uuid: 'USR-002', fullName: 'María López' },
    history: []
  },
  {
    uuid: 'TCK-003',
    ticketCode: 'TCK-003',
    category: 'Software',
    status: 'Cerrado',
    assignedTo: null,
    history: []
  }
];

const initialState: TicketState = {
  list: initialTickets,
  selectedTicket: null, // Guarda el ticket activo para vistas de detalle 
  filter: 'Todos',
  page: 0,      // la pagina actual pq mui usa indice cero
  limit: 5      // límite de elementos por página
};

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
      state.page = 0; // reinicia a la primera página al cambiar filtro
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
      state.selectedTicket = null; // esto limpia la selección al salir de la vista de detalle
    }
  }
});

export const { 
  setFilter, 
  setPage, 
  setLimit, 
  setSelectedTicketByUuid, 
  clearSelectedTicket 
} = ticketSlice.actions;

export default ticketSlice.reducer;