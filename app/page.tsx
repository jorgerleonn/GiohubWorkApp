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
        <Card className="w-full max-w-2xl bg-deepworkos-card/80 backdrop-blur-xl border-deepworkos-border neon-border">
          <CardHeader className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-deepworkos-turquoise via-deepworkos-purple to-deepworkos-success flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-5xl font-bold text-white tracking-tight">
              DeepWorkOS
            </CardTitle>
            <p className="text-deepworkos-text-muted mt-2">Gestión de Estudio Inteligente</p>
          </CardHeader>
          
          <CardContent className="space-y-4 px-12 pb-12">
            <Link href="/sign-in">
              <Button 
                className="w-full h-16 text-xl font-medium bg-gradient-to-r from-deepworkos-turquoise to-deepworkos-turquoise-hover hover:shadow-neon-turquoise transition-all duration-300"
              >
                Iniciar Sesión
              </Button>
            </Link>
            
            <Link href="/sign-up">
              <Button 
                className="w-full h-16 text-xl font-medium bg-deepworkos-card-secondary border border-deepworkos-border hover:border-deepworkos-purple hover:shadow-neon-purple transition-all duration-300"
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
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bienvenido, <span className="text-deepworkos-turquoise" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>{user.firstName || 'Usuario'}</span>
            </h1>
            <p className="text-deepworkos-text-muted">¿Qué quieres hacer hoy?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/work" className="group">
              <Card className="bg-deepworkos-card border-deepworkos-border hover:border-deepworkos-primary hover:shadow-neon-primary transition-all duration-300 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-deepworkos-primary to-deepworkos-orange flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Timer className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white mb-2">Work / Pomodoro</CardTitle>
                  <p className="text-deepworkos-text-muted text-sm">Inicia una sesión de estudio con técnica Pomodoro o Flowtime</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/stats" className="group">
              <Card className="bg-deepworkos-card border-deepworkos-border hover:border-deepworkos-success hover:shadow-neon-success transition-all duration-300 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-deepworkos-success to-deepworkos-turquoise flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white mb-2">Estadísticas</CardTitle>
                  <p className="text-deepworkos-text-muted text-sm">Visualiza tu progreso con gráficos interactivos</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/config" className="group">
              <Card className="bg-deepworkos-card border-deepworkos-border hover:border-deepworkos-purple hover:shadow-neon-purple transition-all duration-300 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-deepworkos-purple to-deepworkos-pink flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white mb-2">Configuración</CardTitle>
                  <p className="text-deepworkos-text-muted text-sm">Administra tus asignaturas y preferencias</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}
