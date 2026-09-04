'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Importante para la navegación en Next.js
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../features/auth/authSlice';

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function MainScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, accessToken } = useSelector((s: RootState) => s.auth);

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Menú Lateral / Sidebar */}
      <Box sx={{ width: 150, bgcolor: '#92aed7', flexShrink: 0 }}>
        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 18, px: 2, py: 2 }}>
          TiCheck
        </Typography>

        <List disablePadding>
          {/* Opción 1: Dashboard */}
          <ListItemButton component={Link} href="/dashboard" sx={{ py: 1 }}>
            <ListItemIcon sx={{ minWidth: 32, color: '#1e2a3a' }}>
              <GridViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" slotProps={{ primary: { sx: menuItemSx } }} />
          </ListItemButton>

          {/* Opción 2: Tickets */}
          <ListItemButton component={Link} href="/tickets" sx={{ py: 1 }}>
            <ListItemIcon sx={{ minWidth: 32, color: '#1e2a3a' }}>
              <EventNoteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Tickets" slotProps={{ primary: { sx: menuItemSx } }} />
          </ListItemButton>
        </List>
      </Box>

      {/* Contenido Principal */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header / Barra superior */}
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
          <Typography
            onClick={handleLogout}
            sx={{ color: '#c62828', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
          >
            Cerrar sesión
          </Typography>
        </Box>

        {/* Vista central */}
        <Box sx={{ flex: 1, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: '#1e2a3a', fontSize: 28, textAlign: 'center' }}>
            Hola de nuevo {capitalize(user.role)}
            <br />
            {user.fullName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}