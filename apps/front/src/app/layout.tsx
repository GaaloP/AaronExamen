import './global.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import StoreProvider from '../store/StoreProvider';

export const metadata = {
  title: 'TiCheck',
  description: 'TiCheck',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppRouterCacheProvider>
          <StoreProvider>{children}</StoreProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}