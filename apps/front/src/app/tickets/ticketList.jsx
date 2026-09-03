// Ubicación: src/components/TicketList.jsx
'use client';

import { useState } from 'react'; //Ver modificaciones de datos
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter, setPage, setLimit } from '../features/ticketSlice';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  IconButton, Dialog, DialogTitle, DialogContent, Typography, Chip, Box,
  FormControl, InputLabel, Select, MenuItem, TablePagination, Button
} from '@mui/material';
import { Search as SearchIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const getStatusChipColor = (status) => {
  switch (status) {
    case 'Abierto':
      return 'error';
    case 'En progreso':
      return 'warning';
    case 'Cerrado':
      return 'success';
    default:
      return 'default';
  }
};

export default function TicketList() {
  const router = useRouter();

  const [modalAbierto, setModalAbierto] = useState(false); //Abre y cierra un modal
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null); //Selecciona un ticket específico

  const dispatch = useDispatch();//obtener el estado global y la función dispatch con redux
  const tickets = useSelector((state) => state.tickets.list);
  const filter = useSelector((state) => state.tickets.filter);
  const page = useSelector((state) => state.tickets.page);
  const limit = useSelector((state) => state.tickets.limit);

  const ticketsFiltrados = tickets.filter((ticket) => {
    if (filter === 'Todos') return true;  // filtrado sencillo de los tickets según el valor en redux
    return ticket.status === filter;
  });

  // Corte de datos según la página y límite actual
  const ticketsPaginados = ticketsFiltrados.slice(page * limit, page * limit + limit);

  const abrirHistorial = (ticket) => {
    setTicketSeleccionado(ticket); 
    setModalAbierto(true); //Abre el historial con un ticket 
  };

  const cerrarHistorial = () => {
    setModalAbierto(false);
    setTicketSeleccionado(null); //Cierra el ticket y lo deja como estaba
  };

  return (
    <Box sx={{ p: 4, width: '100%' }}>
      {/* Botón de navegación para regresar al Dashboard */}
      <Box sx={{ mb: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.push('/dashboard')}
          sx={{ textTransform: 'none' }}
        >
          Volver al Dashboard
        </Button>
      </Box>

      <Typography variant="h3" gutterBottom>
        Vista de Tickets
      </Typography>

      {/* este es un select sencillo para el filtro por estado */}
      <Box sx={{ minWidth: 200, maxWidth: 300, mt: 2, mb: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="filtro-estado-label">Filtrar por Estado</InputLabel>
          <Select
            labelId="filtro-estado-label"
            value={filter}
            label="Filtrar por Estado"
            onChange={(e) => dispatch(setFilter(e.target.value))}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Abierto">Abierto</MenuItem>
            <MenuItem value="En progreso">En progreso</MenuItem>
            <MenuItem value="Cerrado">Cerrado</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#adaee4' }}>
            <TableRow>
              <TableCell><b>Número de Ticket</b></TableCell>
              <TableCell><b>Categoría</b></TableCell>
              <TableCell><b>Estado</b></TableCell>
              <TableCell><b>Agente Asignado</b></TableCell>
              <TableCell align="center"><b>Historial</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ticketsPaginados.map((ticket) => (
              <TableRow key={ticket.uuid}>
                <TableCell>
                  {/* navegación al detalle individual del ticket */}
                  <Typography
                    component={Link}
                    href={`/tickets/${ticket.uuid}`}
                    sx={{ 
                      color: 'primary.main', 
                      textDecoration: 'none', 
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {ticket.ticketCode}
                  </Typography>
                </TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>
                  <Chip 
                    label={ticket.status} 
                    color={getStatusChipColor(ticket.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{ticket.assignedTo?.fullName || 'Sin asignar'}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => abrirHistorial(ticket)}>
                    <SearchIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Paginador que se ajusta a las variables page y limit del contrato */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={ticketsFiltrados.length}
          rowsPerPage={limit}
          page={page}
          onPageChange={(_, newPage) => dispatch(setPage(newPage))}
          onRowsPerPageChange={(e) => dispatch(setLimit(parseInt(e.target.value, 10)))}
          labelRowsPerPage="Filas por página:"
        />
      </TableContainer>

      {/* aqui tenemos el modal de historial de ticket */}     
      <Dialog open={modalAbierto} onClose={cerrarHistorial} maxWidth="md" fullWidth>
        <DialogTitle>Historial de Cambios - {ticketSeleccionado?.ticketCode}</DialogTitle>  
        <DialogContent dividers>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Fecha</b></TableCell>
                <TableCell><b>Usuario</b></TableCell>
                <TableCell><b>Estado Anterior</b></TableCell>
                <TableCell><b>Estado Nuevo</b></TableCell>
                <TableCell><b>Comentario</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* validación condicional limpia para mapear el historial */}
              {ticketSeleccionado && ticketSeleccionado.history && ticketSeleccionado.history.length > 0 ? (
                ticketSeleccionado.history.map((hist, index) => (
                  <TableRow key={index}>
                    <TableCell>{hist.date}</TableCell>
                    <TableCell>{hist.updatedBy?.fullName || 'Sin usuario'}</TableCell>
                    <TableCell>{hist.prevValue}</TableCell>
                    <TableCell>{hist.newValue}</TableCell>
                    <TableCell>{hist.comment || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay cambios en el historial
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </Box>
  );
}