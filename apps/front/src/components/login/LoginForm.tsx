'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Paper, Typography, TextField, Button, IconButton,
  InputAdornment, Divider, Alert, Snackbar,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { loginUser } from '../../features/auth/authSlice';
import { isValidEmail } from '../../lib/validators';

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { status, errorMessage } = useSelector((s: RootState) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) return setEmailError('El correo es obligatorio');
    if (!isValidEmail(email)) return setEmailError('El correo no tiene un formato válido');
    setEmailError('');

    if (!password) return setPasswordError('La contraseña es obligatoria');
    setPasswordError('');

    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      router.push('/main_screen');
    } else {
      setSnackbarOpen(true);
    }
  };

  return (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#7391b8' }}>
    <Paper component="form" onSubmit={handleSubmit} elevation={0}
      sx={{ width: 345, p: 4, bgcolor: '#48607d', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>TiCheck</Typography>
      <Typography variant="body2" sx={{ color: '#d7dee6', mb: 3 }}>Inicia sesión para continuar</Typography>

      <TextField
        fullWidth placeholder="Correo" value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!emailError} helperText={emailError}
        sx={{ mb: 2, bgcolor: '#fff', borderRadius: 1 }}
      />

      <TextField
        fullWidth placeholder="Contraseña" type={showPassword ? 'text' : 'password'}
        value={password} onChange={(e) => setPassword(e.target.value)}
        error={!!passwordError} helperText={passwordError}
        sx={{ mb: 2, bgcolor: '#fff', borderRadius: 1 }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

        <Divider sx={{ borderColor: '#5f7791', my: 2 }} />

        <Button type="submit" fullWidth disabled={status === 'loading'}
          sx={{ bgcolor: '#1e2a3a', color: '#fff', py: 1.2, '&:hover': { bgcolor: '#151d29' } }}>
          {status === 'loading' ? 'Ingresando...' : 'Iniciar Sesión'}
        </Button>
      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>{errorMessage}</Alert>
      </Snackbar>
    </Box>
  );
}