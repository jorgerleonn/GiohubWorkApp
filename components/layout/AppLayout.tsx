'use client'

import { useUser } from '@clerk/nextjs'
import { Sidebar } from './Sidebar'

interface Props {
  children: React.ReactNode
}

export function AppLayout({ children }: Props) {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-deepworkos-bg-dark flex items-center justify-center">
        <div className="text-deepworkos-turquoise animate-pulse">Cargando...</div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-deepworkos-bg-dark">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
