import './global.css';
import StoreProvider from '../store/StoreProvider';

export const metadata = { title: 'TiCheck', description: 'TiCheck' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}