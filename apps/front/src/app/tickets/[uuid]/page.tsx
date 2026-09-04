// Ubicación: src/app/tickets/[uuid]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, Typography, Paper, Chip, Button, Table, 
  TableBody, TableCell, TableHead, TableRow, Alert, CircularProgress 
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

// Tipado explícito para TypeScript
interface HistoryItem {
  date: string;
  updatedBy?: {
    uuid: string;
    fullName: string;
  };
  field?: string;
  prevValue: string;
  newValue: string;
  comment?: string;
}

interface TicketDetail {
  uuid: string;
  ticketCode: number | string;
  category: string;
  description: string;
  status: string;
  assignedTo?: {
    uuid: string;
    fullName: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  history?: HistoryItem[];
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const uuid = params?.uuid as string;

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uuid) return;
    const token = localStorage.getItem('token');

    fetch(`/api/v1/tickets/${uuid}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo obtener el detalle del ticket');
        return res.json();
      })
      .then((response) => {
        if (response.statusCode === 200) {
          setTicket(response.data);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [uuid]);

  if (loading) return <Box sx={{ p: 4 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Box>;
  // Validación de nulo para evitar el error "'ticket' is possibly 'null'"
  if (!ticket) return <Box sx={{ p: 4 }}><Alert severity="warning">Ticket no encontrado</Alert></Box>;

  return (
    <Box sx={{ p: 4, maxWidth: 900, margin: '0 auto' }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => router.push('/tickets')} 
        sx={{ mb: 2 }}
      >
        Volver a la Lista
      </Button>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Ticket #{ticket.ticketCode}
        </Typography>

<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>          <Box>
            <Typography variant="subtitle2" color="textSecondary">Categoría</Typography>
            <Typography variant="body1">{ticket.category}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Estado Actual</Typography>
            <Chip label={ticket.status} color="primary" size="small" />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Asignado a</Typography>
            <Typography variant="body1">{ticket.assignedTo?.fullName || 'Sin asignar'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Fecha Creación</Typography>
            <Typography variant="body1">{new Date(ticket.createdAt).toLocaleString()}</Typography>
          </Box>
          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <Typography variant="subtitle2" color="textSecondary">Descripción</Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>{ticket.description}</Typography>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Historial de Cambios
      </Typography>
      
      <Paper>
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
            {ticket.history && ticket.history.length > 0 ? (
              ticket.history.map((hist: HistoryItem, index: number) => (
                <TableRow key={index}>
                  <TableCell>{new Date(hist.date).toLocaleString()}</TableCell>
                  <TableCell>{hist.updatedBy?.fullName || 'Sistema'}</TableCell>
                  <TableCell>{hist.prevValue}</TableCell>
                  <TableCell>{hist.newValue}</TableCell>
                  <TableCell>{hist.comment || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Sin registros previos en el historial
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}