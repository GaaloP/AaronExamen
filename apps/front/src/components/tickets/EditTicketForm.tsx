'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Box, Typography, Paper, TextField, Button, MenuItem,
  FormControl, InputLabel, Select, FormHelperText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { updateTicket } from '../../features/auth/ticketSlice';
import { TICKET_CATEGORIES } from '../../contracts/tickets.contract';

export default function EditTicketForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { uuid } = useParams<{ uuid: string }>();

  const user = useSelector((s: RootState) => s.auth.user);
  const ticket = useSelector((s: RootState) => s.tickets.list.find((t) => t.uuid === uuid));
  const agentsCatalog = useSelector((s: RootState) => s.tickets.agentsCatalog);

  const isSupervisor = user?.role === 'supervisor';
  const isOwner = ticket?.assignedTo?.uuid === user?.uuid;
  const isClosed = ticket?.status === 'Cerrado';
  const canEdit = !!ticket && !isClosed && (isSupervisor || isOwner);

  const [category, setCategory] = useState(ticket?.category ?? '');
  const [description, setDescription] = useState(ticket?.description ?? '');
  const [status, setStatus] = useState(ticket?.status ?? '');
  const [assignedToUuid, setAssignedToUuid] = useState(ticket?.assignedTo?.uuid ?? '');
  const [error, setError] = useState('');

  if (!ticket) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography sx={{ mb: 2 }}>Ticket no encontrado.</Typography>
        <Button component={Link} href="/tickets">Volver</Button>
      </Box>
    );
  }

  if (!canEdit) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography sx={{ mb: 2, color: '#c62828' }}>
          {isClosed ? 'Este ticket está cerrado, debe reabrirse primero.' : 'No tienes permiso para editar este ticket.'}
        </Typography>
        <Button component={Link} href="/tickets">Volver</Button>
      </Box>
    );
  }
  const statusOptions = isSupervisor
    ? ['Abierto', 'En progreso', 'Cerrado']
    : [ticket.status, 'Cerrado'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !description.trim()) {
      setError('Categoría y descripción son obligatorias');
      return;
    }

    const assignedTo = isSupervisor
      ? agentsCatalog.find((a) => a.uuid === assignedToUuid) ?? ticket.assignedTo
      : ticket.assignedTo;

    dispatch(updateTicket({
      uuid: ticket.uuid,
      changes: { category, description, status, assignedTo },
    }));

    router.push('/tickets');
  };

  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ width: 420, p: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
          Editar ticket {ticket.ticketCode}
        </Typography>

        <TextField label="Número de ticket" value={ticket.ticketCode} disabled fullWidth sx={{ mb: 2 }} />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Categoría</InputLabel>
          <Select value={category} label="Categoría" onChange={(e) => setCategory(e.target.value)}>
            {TICKET_CATEGORIES.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline rows={3} fullWidth sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Estado</InputLabel>
          <Select value={status} label="Estado" onChange={(e) => setStatus(e.target.value)}>
            {statusOptions.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
          {!isSupervisor && <FormHelperText>Como agente, solo puedes cerrar el ticket.</FormHelperText>}
        </FormControl>

        {isSupervisor && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Asignado a</InputLabel>
            <Select value={assignedToUuid} label="Asignado a" onChange={(e) => setAssignedToUuid(e.target.value)}>
              {agentsCatalog.map((a) => <MenuItem key={a.uuid} value={a.uuid}>{a.fullName}</MenuItem>)}
            </Select>
          </FormControl>
        )}

        {error && <Typography sx={{ color: '#c62828', fontSize: 13, mb: 2 }}>{error}</Typography>}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button component={Link} href="/tickets">Cancelar</Button>
          <Button type="submit" variant="contained">Guardar</Button>
        </Box>
      </Paper>
    </Box>
  );
}