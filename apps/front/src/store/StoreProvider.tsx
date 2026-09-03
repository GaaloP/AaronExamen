'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { hydrateFromStorage } from '../features/auth/authSlice';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) storeRef.current = makeStore();

  useEffect(() => {
    storeRef.current?.dispatch(hydrateFromStorage());
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}