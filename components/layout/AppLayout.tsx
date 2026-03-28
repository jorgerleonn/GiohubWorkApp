'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Sidebar } from './Sidebar'
import { Menu, X } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

export function AppLayout({ children }: Props) {
  const { isSignedIn, isLoaded } = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-deepworkos-card border border-deepworkos-border md:hidden"
      >
        {sidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="md:ml-64 min-h-screen p-4 md:p-8 pt-16 md:pt-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
