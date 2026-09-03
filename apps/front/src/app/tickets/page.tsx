'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Box, Typography, List, ListItemButton, ListItemIcon, ListItemText,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, FormControl, InputLabel, Select, MenuItem, Chip,
  Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HistoryIcon from '@mui/icons-material/History';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../features/auth/authSlice';
import { setFilter, setPage, setLimit } from '../../features/auth/ticketSlice';
import AddIcon from '@mui/icons-material/Add';

function capitalize(value: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function TicketsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user, accessToken } = useSelector((s: RootState) => s.auth);
  const { list, filter, page, limit } = useSelector((s: RootState) => s.tickets);

  const [selectedTicketHistory, setSelectedTicketHistory] = useState<any | null>(null);

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
    }
  }, [accessToken, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (!user) return null;

  const menuItemSx = { fontSize: 13, color: '#1e2a3a' };

  const filteredTickets = list.filter((ticket) => 
    filter === 'Todos' ? true : ticket.status === filter
  );
  const displayedTickets = filteredTickets.slice(page * limit, page * limit + limit);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'abierto': return 'error';
      case 'en progreso': return 'warning';
      case 'cerrado': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Menú Lateral */}
      <Box sx={{ width: 150, bgcolor: '#92aed7', flexShrink: 0 }}>
        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 18, px: 2, py: 2 }}>
          TiCheck
        </Typography>

        <List disablePadding>
          <ListItemButton component={Link} href="/dashboard" sx={{ py: 1 }}>
            <ListItemIcon sx={{ minWidth: 32, color: '#1e2a3a' }}>
              <GridViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" slotProps={{ primary: { sx: menuItemSx } }} />
          </ListItemButton>

          <ListItemButton component={Link} href="/tickets" sx={{ py: 1, bgcolor: 'rgba(255,255,255,0.2)' }}>
            <ListItemIcon sx={{ minWidth: 32, color: '#1e2a3a' }}>
              <EventNoteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Tickets" slotProps={{ primary: { sx: { ...menuItemSx, fontWeight: 'bold' } } }} />
          </ListItemButton>
        </List>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
        <Box
          sx={{
            height: 56,
            bgcolor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justify: 'flex-end',
            px: 3,
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
          }}
        >
          <Typography sx={{ mr: 3, color: '#666', fontSize: 13 }}>
            {user.fullName} ({capitalize(user.role)})
          </Typography>
          <Typography
            onClick={handleLogout}
            sx={{ color: '#c62828', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
          >
            Cerrar sesión
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e2a3a' }}>
                Gestión de Tickets
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filter}
                    label="Estado"
                    onChange={(e) => dispatch(setFilter(e.target.value))}
                  >
                    <MenuItem value="Todos">Todos</MenuItem>
                    <MenuItem value="Abierto">Abiertos</MenuItem>
                    <MenuItem value="En progreso">En Progreso</MenuItem>
                    <MenuItem value="Cerrado">Cerrados</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  component={Link}
                  href="/tickets/new"
                  sx={{ textTransform: 'none' }}
                >
                  Crear ticket
                </Button>
              </Box>
          </Box>

          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#e0e0e0' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Asignado A</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedTickets.length > 0 ? (
                    displayedTickets.map((ticket) => (
                      <TableRow key={ticket.uuid} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{ticket.ticketCode}</TableCell>
                        <TableCell>{ticket.category}</TableCell>
                        <TableCell>
                          {ticket.assignedTo ? ticket.assignedTo.fullName : 'Sin asignar'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={ticket.status} 
                            color={getStatusColor(ticket.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<HistoryIcon />}
                            onClick={() => setSelectedTicketHistory(ticket)}
                            sx={{ textTransform: 'none' }}
                          >
                            Historial
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        No hay tickets que coincidan con el filtro.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTickets.length}
              rowsPerPage={limit}
              page={page}
              onPageChange={(e, newPage) => dispatch(setPage(newPage))}
              onRowsPerPageChange={(e) => dispatch(setLimit(parseInt(e.target.value, 10)))}
              labelRowsPerPage="Filas por página:"
            />
          </Paper>
        </Box>
      </Box>

      {}
      <Dialog 
        open={!!selectedTicketHistory} 
        onClose={() => setSelectedTicketHistory(null)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Historial de Cambios - {selectedTicketHistory?.ticketCode}
        </DialogTitle>  
        <DialogContent dividers>
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><b>Fecha</b></TableCell>
                  <TableCell><b>Usuario</b></TableCell>
                  <TableCell><b>Estado Anterior</b></TableCell>
                  <TableCell><b>Estado Nuevo</b></TableCell>
                  <TableCell><b>Comentario</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTicketHistory && selectedTicketHistory.history && selectedTicketHistory.history.length > 0 ? (
                  selectedTicketHistory.history.map((hist: any, index: number) => (
                    <TableRow key={index} hover>
                      <TableCell>{hist.date}</TableCell>
                      <TableCell>{hist.updatedBy?.fullName || 'Sin usuario'}</TableCell>
                      <TableCell>{hist.prevValue}</TableCell>
                      <TableCell>{hist.newValue}</TableCell>
                      <TableCell>{hist.comment || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      No hay cambios en el historial
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTicketHistory(null)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

