'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Grid, Card, CardContent
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../features/auth/authSlice';

function capitalize(value: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user, accessToken } = useSelector((s: RootState) => s.auth);
  const { list } = useSelector((s: RootState) => s.tickets);

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
      return;
    }
    if (user?.role !== 'supervisor') {
      router.replace('/tickets');
    }
  }, [accessToken, user, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (!user || user.role !== 'supervisor') return null;

  const menuItemSx = { fontSize: 13, color: '#1e2a3a' };

  const metrics = useMemo(() => {
    let abiertos = 0;
    let progreso = 0;
    let cerrados = 0;

    let totalClosingTimeHours = 0;
    let validClosedTickets = 0;

    list.forEach((ticket) => {
      const status = ticket.status.toLowerCase();
      if (status === 'abierto') abiertos++;
      else if (status === 'en progreso') progreso++;
      else if (status === 'cerrado') cerrados++;

      if (status === 'cerrado' && ticket.history.length > 0) {
        const creationEvent = ticket.history[0];
        const closingEvent = ticket.history.find(h => h.newValue.toLowerCase() === 'cerrado');

        if (creationEvent && closingEvent) {
          const createdDate = new Date(creationEvent.date).getTime();
          const closedDate = new Date(closingEvent.date).getTime();
          
          const diffMs = closedDate - createdDate;
          if (diffMs > 0) {
            totalClosingTimeHours += diffMs / (1000 * 60 * 60);
            validClosedTickets++;
          }
        }
      }
    });

    const averageCloseTime = validClosedTickets > 0 
      ? (totalClosingTimeHours / validClosedTickets).toFixed(1) 
      : '0';

    return { abiertos, progreso, cerrados, averageCloseTime };
  }, [list]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Menú Lateral */}
      <Box sx={{ width: 150, bgcolor: '#92aed7', flexShrink: 0 }}>
        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 18, px: 2, py: 2 }}>
          TiCheck
        </Typography>

        <List disablePadding>
          <ListItemButton component={Link} href="/dashboard" sx={{ py: 1, bgcolor: 'rgba(255,255,255,0.2)' }}>
            <ListItemIcon sx={{ minWidth: 32, color: '#1e2a3a' }}>
              <GridViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" slotProps={{ primary: { sx: { ...menuItemSx, fontWeight: 'bold' } } }} />
          </ListItemButton>

          <ListItemButton component={Link} href="/tickets" sx={{ py: 1 }}>
            <ListItemIcon sx={{ minWidth: 32, color: '#1e2a3a' }}>
              <EventNoteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Tickets" slotProps={{ primary: { sx: menuItemSx } }} />
          </ListItemButton>
        </List>
      </Box>

      {}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
        {/* Barra superior */}
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

        {/* dashboard de metricas */}
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e2a3a', mb: 3 }}>
            Dashboard de Métricas
          </Typography>

          <Grid container spacing={3}>
            {/* Tarjeta 1 */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ bgcolor: '#ffebee', p: 1.5, borderRadius: 2, mr: 2 }}>
                    <AssignmentIcon sx={{ color: '#d32f2f' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Tickets Abiertos
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {metrics.abiertos}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* tarjeta */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ bgcolor: '#fff8e1', p: 1.5, borderRadius: 2, mr: 2 }}>
                    <AutorenewIcon sx={{ color: '#fbc02d' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      En Progreso
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {metrics.progreso}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* tarjeta 3 */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ bgcolor: '#e8f5e9', p: 1.5, borderRadius: 2, mr: 2 }}>
                    <CheckCircleIcon sx={{ color: '#388e3c' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Tickets Cerrados
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {metrics.cerrados}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* tarjeta 4 */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ bgcolor: '#e3f2fd', p: 1.5, borderRadius: 2, mr: 2 }}>
                    <AccessTimeIcon sx={{ color: '#1976d2' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Promedio de Cierre
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {metrics.averageCloseTime} <Typography component="span" variant="body1" color="text.secondary">hrs</Typography>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

