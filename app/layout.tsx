import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'DeepWorkOS - Gestión de Estudio',
  description: 'Aplicación de seguimiento de sesiones de estudio con técnica Pomodoro/Flowtime',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        variables: {
          colorPrimary: '#00d4ff',
          colorTextOnPrimaryBackground: '#ffffff',
          colorBackground: '#16161f',
          colorInputBackground: '#1e1e2a',
          colorInputText: '#ffffff',
          colorTextSecondary: '#aaaabc',
          colorText: '#ffffff',
          borderRadius: '8px',
        },
        elements: {
          formButtonPrimary: 'bg-deepworkos-turquoise hover:bg-deepworkos-turquoise text-white',
          formFieldInput: 'bg-deepworkos-card-secondary border-deepworkos-border',
          card: 'bg-deepworkos-card border-deepworkos-border',
        }
      }}
    >
      <html lang="es" data-theme="dark">
        <body className="bg-deepworkos-bg-dark text-white antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
