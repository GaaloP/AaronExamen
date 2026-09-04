'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box, Typography, List, ListItemButton, ListItemIcon, ListItemText,
  Paper, TextField, Button, MenuItem, FormControl, InputLabel, Select,
  FormHelperText, Snackbar, Alert, CircularProgress,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../features/auth/authSlice';
import { createTicket, fetchAgents, resetCreateStatus } from '../../features/auth/ticketSlice';
import { TICKET_CATEGORIES } from '../../contracts/tickets.contract';

function capitalize(value: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function CreateTicketForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { user, accessToken } = useSelector((s: RootState) => s.auth);
  const { agentsCatalog, agentsStatus, createStatus, createErrorMessage } = useSelector(
    (s: RootState) => s.tickets
  );

  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToUuid, setAssignedToUuid] = useState('');

  const [categoryError, setCategoryError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [assignedToError, setAssignedToError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const isSupervisor = user?.role === 'supervisor';

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
    }
  }, [accessToken, router]);

  useEffect(() => {
    if (isSupervisor) {
      dispatch(fetchAgents());
    }
  }, [isSupervisor, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetCreateStatus());
    };
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (!user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!category) {
      setCategoryError('El campo Categoría es obligatorio');
      hasError = true;
    } else {
      setCategoryError('');
    }

    if (!description.trim()) {
      setDescriptionError('El campo Descripción es obligatorio');
      hasError = true;
    } else {
      setDescriptionError('');
    }

    if (isSupervisor && !assignedToUuid) {
      setAssignedToError('El campo Asignado a es obligatorio');
      hasError = true;
    } else {
      setAssignedToError('');
    }

    if (hasError) return;

    const result = await dispatch(
      createTicket({
        dto: {
          category,
          description,
          ...(isSupervisor ? { assignedToUuid } : {}),
        },
        currentUser: { uuid: user.uuid, fullName: user.fullName, role: user.role },
      })
    );

    if (createTicket.fulfilled.match(result)) {
      router.push('/tickets');
    } else {
      setSnackbarOpen(true);
    }
  };

  const menuItemSx = { fontSize: 13, color: '#1e2a3a' };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
            height: 56, bgcolor: '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'flex-end', px: 3, boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
          }}
        >
          <Typography sx={{ mr: 3, color: '#666', fontSize: 13 }}>
            {user.fullName} ({capitalize(user.role)})
          </Typography>
          <Typography onClick={handleLogout} sx={{ color: '#c62828', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            Cerrar sesión
          </Typography>
        </Box>

        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={0} component="form" onSubmit={handleSubmit} sx={{ width: 480, p: 4, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              component={Link}
              href="/tickets"
              sx={{ textTransform: 'none', mb: 2, color: '#666' }}
            >
              Volver a tickets
            </Button>

            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e2a3a', mb: 3 }}>
              Crear nuevo ticket
            </Typography>

            <TextField
              label="Número de ticket"
              value="Generado automáticamente"
              disabled
              fullWidth
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth error={!!categoryError} sx={{ mb: 3 }}>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={category}
                label="Categoría"
                onChange={(e) => setCategory(e.target.value)}
              >
                {TICKET_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
              {categoryError && <FormHelperText>{categoryError}</FormHelperText>}
            </FormControl>

            <TextField
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!descriptionError}
              helperText={descriptionError}
              multiline
              rows={4}
              fullWidth
              sx={{ mb: 3 }}
            />

            {isSupervisor && (
              <FormControl fullWidth error={!!assignedToError} sx={{ mb: 3 }}>
                <InputLabel>Asignado a</InputLabel>
                <Select
                  value={assignedToUuid}
                  label="Asignado a"
                  onChange={(e) => setAssignedToUuid(e.target.value)}
                  disabled={agentsStatus === 'loading'}
                >
                  {agentsCatalog.map((agent) => (
                    <MenuItem key={agent.uuid} value={agent.uuid}>{agent.fullName}</MenuItem>
                  ))}
                </Select>
                {agentsStatus === 'loading' && (
                  <FormHelperText>
                    <CircularProgress size={12} sx={{ mr: 1 }} />
                    Cargando agentes...
                  </FormHelperText>
                )}
                {assignedToError && <FormHelperText>{assignedToError}</FormHelperText>}
              </FormControl>
            )}

            <TextField
              label="Estado"
              value="Abierto"
              disabled
              fullWidth
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button component={Link} href="/tickets" sx={{ textTransform: 'none' }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createStatus === 'loading'}
                sx={{ textTransform: 'none' }}
              >
                {createStatus === 'loading' ? 'Guardando...' : 'Crear ticket'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {createErrorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}