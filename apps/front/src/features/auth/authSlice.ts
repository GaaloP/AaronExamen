import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, AuthServiceError } from '../../services/auth.service';
import { AuthUserDto, LoginRequestDto } from '../../contracts/auth.contract';

const SESSION_KEY = 'ticheck_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

interface LoginFulfilledPayload {
  accessToken: string;
  user: AuthUserDto;
}

interface LoginThunkConfig {
  rejectValue: string;
}

// AQUÍ ESTÁ LA CORRECCIÓN: Se agregó "export"
export interface AuthState {
  accessToken: string | null;
  user: AuthUserDto | null;
  expiresAt: number | null;
  status: 'idle' | 'loading' | 'failed';
  errorMessage: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  expiresAt: null,
  status: 'idle',
  errorMessage: null,
};

export const loginUser = createAsyncThunk<LoginFulfilledPayload, LoginRequestDto, LoginThunkConfig>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      return { accessToken: response.data.accessToken, user: response.data.user };
    } catch (err) {
      if (err instanceof AuthServiceError) {
        const message =
          err.statusCode === 401
            ? 'El usuario o contraseña es incorrecto, intente de nuevo'
            : err.message;
        return rejectWithValue(message);
      }
      return rejectWithValue('Ocurrió un error inesperado');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.expiresAt = null;
      if (typeof window !== 'undefined') localStorage.removeItem(SESSION_KEY);
    },
    hydrateFromStorage(state) {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.expiresAt < Date.now()) {
        localStorage.removeItem(SESSION_KEY);
        return;
      }
      state.accessToken = parsed.accessToken;
      state.user = parsed.user;
      state.expiresAt = parsed.expiresAt;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.expiresAt = Date.now() + SESSION_TTL_MS;

        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            accessToken: state.accessToken,
            user: state.user,
            expiresAt: state.expiresAt,
          })
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload ?? 'Ocurrió un error inesperado';
      });
  },
});

export const { logout, hydrateFromStorage } = authSlice.actions;
export default authSlice.reducer;