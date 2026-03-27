import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'GIOHUB - Gestión de Estudio',
  description: 'Aplicación de seguimiento de sesiones de estudio con técnica Pomodoro/Flowtime',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <html lang="es" data-theme="dark">
        <body className="bg-giohub-bg-dark text-white antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
