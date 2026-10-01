import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'iSolar - Energias Renovables',
  description: 'Equipos de energia solar en Colombia. Paneles, inversores, baterias, controladores y mas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
