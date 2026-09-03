import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from '../features/auth/authSlice';
import ticketReducer from '../features/auth/ticketSlice'; 

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      tickets: ticketReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Hooks tipados listos para usar directamente
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
