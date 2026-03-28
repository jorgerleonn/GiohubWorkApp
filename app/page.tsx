'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Timer, BarChart3, Settings, Sparkles } from 'lucide-react'

export default function HomePage() {
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-deepworkos-turquoise animate-pulse">Cargando...</div>
        </div>
      </AppLayout>
    )
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-deepworkos-bg-dark via-deepworkos-bg-dark-secondary to-deepworkos-bg-dark pointer-events-none" />
        <Card className="w-full max-w-md sm:max-w-2xl bg-deepworkos-card/80 backdrop-blur-xl border-deepworkos-border neon-border">
          <CardHeader className="text-center py-8 sm:py-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-deepworkos-turquoise via-deepworkos-purple to-deepworkos-success flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              DeepWorkOS
            </CardTitle>
            <p className="text-deepworkos-text-muted mt-2">Gestión de Estudio Inteligente</p>
          </CardHeader>
          
          <CardContent className="space-y-4 px-6 sm:px-12 pb-8 sm:pb-12">
            <Link href="/sign-in">
              <Button 
                className="w-full h-12 sm:h-16 text-base sm:text-xl font-medium bg-gradient-to-r from-deepworkos-turquoise to-deepworkos-turquoise-hover hover:shadow-neon-turquoise transition-all duration-300"
              >
                Iniciar Sesión
              </Button>
            </Link>
            
            <Link href="/sign-up">
              <Button 
                className="w-full h-12 sm:h-16 text-base sm:text-xl font-medium bg-deepworkos-card-secondary border border-deepworkos-border hover:border-deepworkos-purple hover:shadow-neon-purple transition-all duration-300"
              >
                Registrarse
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <AppLayout>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Bienvenido, <span className="text-deepworkos-turquoise" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>{user.firstName || 'Usuario'}</span>
        </h1>
        <p className="text-deepworkos-text-muted">¿Qué quieres hacer hoy?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link href="/work" className="group">
          <Card className="bg-deepworkos-card border-deepworkos-border hover:border-deepworkos-primary hover:shadow-neon-primary transition-all duration-300 h-full">
            <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-deepworkos-primary to-deepworkos-orange flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl text-white mb-2">Work / Pomodoro</CardTitle>
              <p className="text-deepworkos-text-muted text-sm">Inicia una sesión de estudio con técnica Pomodoro o Flowtime</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/stats" className="group">
          <Card className="bg-deepworkos-card border-deepworkos-border hover:border-deepworkos-success hover:shadow-neon-success transition-all duration-300 h-full">
            <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-deepworkos-success to-deepworkos-turquoise flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl text-white mb-2">Estadísticas</CardTitle>
              <p className="text-deepworkos-text-muted text-sm">Visualiza tu progreso con gráficos interactivos</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/config" className="group sm:col-span-2 lg:col-span-1">
          <Card className="bg-deepworkos-card border-deepworkos-border hover:border-deepworkos-purple hover:shadow-neon-purple transition-all duration-300 h-full">
            <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-deepworkos-purple to-deepworkos-pink flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl text-white mb-2">Configuración</CardTitle>
              <p className="text-deepworkos-text-muted text-sm">Administra tus asignaturas y preferencias</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </AppLayout>
  )
}
