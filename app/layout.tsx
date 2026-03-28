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
          colorDanger: '#ff6b6b',
          colorSuccess: '#00ff88',
          borderRadius: '8px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          spacingUnit: '4px',
          zIndex: '100',
        },
        elements: {
          formButtonPrimary: 'bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] hover:from-[#00b8e6] hover:to-[#0099bb] text-white shadow-lg shadow-cyan-500/25',
          formButtonSecondary: 'bg-[#1e1e2a] hover:bg-[#252533] text-white border border-[#2a2a3a]',
          formFieldInput: 'bg-[#1e1e2a] border-[#2a2a3a] text-white focus:border-[#00d4ff] focus:ring-2 focus:ring-cyan-500/20',
          formFieldLabel: 'text-[#aaaabc]',
          formFieldInputShowPasswordButton: 'text-[#aaaabc]',
          card: 'bg-[#16161f] border border-[#2a2a3a] shadow-xl',
          headerTitle: 'text-white text-2xl font-bold',
          headerSubtitle: 'text-[#aaaabc]',
          socialButtonsBlockButton: 'bg-[#1e1e2a] border border-[#2a2a3a] text-white hover:bg-[#252533]',
          socialButtonsBlockButtonText: 'text-white font-medium',
          dividerLine: 'bg-[#2a2a3a]',
          dividerText: 'text-[#aaaabc]',
          formFieldAction: 'text-[#00d4ff] hover:text-[#00b8e6]',
          footerActionLink: 'text-[#00d4ff] hover:text-[#00b8e6]',
          identityPreviewText: 'text-white',
          identityPreviewEditButton: 'text-[#00d4ff]',
          otpCodeFieldInput: 'bg-[#1e1e2a] border-[#2a2a3a] text-white',
          footer: 'bg-[#16161f] border-t border-[#2a2a3a]',
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
