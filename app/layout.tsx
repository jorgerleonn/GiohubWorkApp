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
          colorPrimaryHover: '#00b8e6',
          colorTextOnPrimaryBackground: '#ffffff',
          colorBackground: '#1e1e2a',
          colorInputBackground: '#252533',
          colorInputText: '#ffffff',
          colorTextSecondary: '#ffffff',
          colorText: '#ffffff',
          colorDanger: '#ff6b6b',
          colorSuccess: '#00ff88',
          borderRadius: '8px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          spacingUnit: '4px',
          zIndex: '100',
        },
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        elements: {
          formButtonPrimary: 'bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] hover:from-[#00b8e6] hover:to-[#0099bb] text-white shadow-lg shadow-cyan-500/25',
          formButtonSecondary: 'bg-[#2a2a3a] hover:bg-[#353545] text-white border border-[#3a3a4a]',
          formFieldInput: 'bg-[#252533] border-[#3a3a4a] text-white placeholder:text-gray-400 focus:border-[#00d4ff] focus:ring-2 focus:ring-cyan-500/20',
          formFieldLabel: 'text-white font-medium',
          formFieldInputShowPasswordButton: 'text-white hover:text-white',
          formFieldWarningText: 'text-yellow-400',
          formFieldErrorText: 'text-red-400',
          formFieldSuccessText: 'text-green-400',
          card: 'bg-[#282834] border border-[#3a3a4a] shadow-xl rounded-xl',
          headerTitle: 'text-white text-2xl font-bold',
          headerSubtitle: 'text-white',
          socialButtonsBlockButton: 'bg-[#2a2a3a] border border-[#4a4a5a] text-white hover:bg-[#353545] hover:border-[#00d4ff]',
          socialButtonsBlockButtonText: 'text-white font-medium',
          dividerLine: 'bg-[#3a3a4a]',
          dividerText: 'text-white',
          formFieldAction: 'text-[#00d4ff] hover:text-[#00b8e6]',
          footerActionLink: 'text-[#00d4ff] hover:text-[#00b8e6]',
          footer: 'bg-[#282834] text-white',
          footer__main: 'text-white',
          footerLink: 'text-[#00d4ff] hover:text-[#00b8e6]',
          footerPageLink: 'text-[#00d4ff]',
          footerActionText: 'text-white',
          formFooterActionText: 'text-white',
          identityPreviewText: 'text-white',
          identityPreviewEditButton: 'text-[#00d4ff] hover:text-[#00b8e6]',
          otpCodeFieldInput: 'bg-[#252533] border-[#3a3a4a] text-white',
          otpCodeFieldInput__wrapper: 'text-white',
          branded: 'text-white',
          backLink: 'text-white hover:text-white',
          formFieldInputShowPassword: 'text-white',
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
