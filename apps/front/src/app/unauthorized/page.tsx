import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';

export default function UnauthorizedPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#1e2a3a' }}>
        No tienes permiso para acceder a esta pantalla
      </Typography>
      <Button component={Link} href="/main_screen" variant="contained" sx={{ textTransform: 'none' }}>
        Volver al inicio
      </Button>
    </Box>
  );
}