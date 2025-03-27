import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ClientLayout } from './components/ClientLayout'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rotarara 2025',
  description: 'Celebrando a Excelência em Vinhos',
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={playfair.variable}>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
} 