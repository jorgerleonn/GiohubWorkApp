import { SignUp } from '@clerk/nextjs'

const appearance = {
  variables: {
    colorPrimary: '#00d4ff',
    colorPrimaryHover: '#00b8e6',
    colorTextOnPrimaryBackground: '#ffffff',
    colorBackground: '#ffffff',
    colorInputBackground: '#f5f5f5',
    colorInputText: '#000000',
    colorTextSecondary: '#666666',
    colorText: '#000000',
    colorDanger: '#ff6b6b',
    colorSuccess: '#00ff88',
    borderRadius: '8px',
  },
  elements: {
    formButtonPrimary: 'bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] hover:from-[#00b8e6] hover:to-[#0099bb] text-white shadow-lg shadow-cyan-500/25',
    formButtonSecondary: 'bg-[#f0f0f0] hover:bg-[#e0e0e0] text-black border border-[#cccccc]',
    formFieldInput: 'bg-[#f5f5f5] border-[#cccccc] text-black placeholder:text-gray-400 focus:border-[#00d4ff] focus:ring-2 focus:ring-cyan-500/20',
    formFieldLabel: 'text-black font-medium',
    formFieldInputShowPasswordButton: 'text-black hover:text-black',
    formFieldWarningText: 'text-yellow-600',
    formFieldErrorText: 'text-red-600',
    formFieldSuccessText: 'text-green-600',
    card: 'bg-white border border-[#cccccc] shadow-xl rounded-xl',
    headerTitle: 'text-black text-2xl font-bold',
    headerSubtitle: 'text-gray-600',
    socialButtonsBlockButton: 'bg-[#f0f0f0] border border-[#cccccc] text-black hover:bg-[#e0e0e0]',
    socialButtonsBlockButtonText: 'text-black font-medium',
    dividerLine: 'bg-[#cccccc]',
    dividerText: 'text-gray-600',
    formFieldAction: 'text-[#00d4ff] hover:text-[#00b8e6]',
    footerActionLink: 'text-[#00d4ff] hover:text-[#00b8e6]',
    footer: 'bg-white text-gray-600',
    footer__main: 'text-gray-600',
    footerLink: 'text-[#00d4ff] hover:text-[#00b8e6]',
    footerPageLink: 'text-[#00d4ff]',
    footerActionText: 'text-gray-600',
    formFooterActionText: 'text-gray-600',
    identityPreviewText: 'text-black',
    identityPreviewEditButton: 'text-[#00d4ff] hover:text-[#00b8e6]',
    otpCodeFieldInput: 'bg-[#f5f5f5] border-[#cccccc] text-black',
    otpCodeFieldInput__wrapper: 'text-black',
    branded: 'text-gray-600',
    backLink: 'text-black hover:text-gray-600',
    formFieldInputShowPassword: 'text-black',
  }
}

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deepworkos-bg-dark via-deepworkos-bg-dark-secondary to-[#0f0f1a]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-deepworkos-turquoise/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-deepworkos-purple/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10">
        <SignUp appearance={appearance} />
      </div>
    </div>
  )
}
