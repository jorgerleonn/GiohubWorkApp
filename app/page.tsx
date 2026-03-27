'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-white">Cargando...</div>
      </main>
    )
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-giohub-card border-none shadow-2xl">
          <CardHeader className="text-center py-12">
            <CardTitle className="text-6xl font-bold text-white">
              GIOHUB
            </CardTitle>
            <p className="text-gray-400 mt-4">Gestión de Estudio Inteligente</p>
          </CardHeader>
          
          <CardContent className="space-y-4 px-12 pb-12">
            <Link href="/sign-in">
              <Button 
                className="w-full h-16 text-xl font-medium bg-giohub-primary hover:bg-giohub-primary-hover transition-colors"
              >
                Iniciar Sesión
              </Button>
            </Link>
            
            <Link href="/sign-up">
              <Button 
                className="w-full h-16 text-xl font-medium bg-giohub-card-secondary hover:bg-giohub-gray transition-colors"
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
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-giohub-card border-none shadow-2xl">
        <CardHeader className="text-center py-8">
          <CardTitle className="text-5xl font-bold text-white">
            GIOHUB
          </CardTitle>
          <p className="text-gray-400 mt-2">
            Bienvenido, {user.firstName || user.emailAddresses[0]?.emailAddress}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 px-12 pb-12">
          <Link href="/work">
            <Button 
              className="w-full h-16 text-xl font-medium bg-giohub-primary hover:bg-giohub-primary-hover transition-colors"
            >
              ▶ Work / Pomodoro
            </Button>
          </Link>
          
          <Link href="/stats">
            <Button 
              className="w-full h-16 text-xl font-medium bg-giohub-orange hover:bg-giohub-red transition-colors"
            >
              📊 Gráficas de Estudio
            </Button>
          </Link>
          
          <Link href="/config">
            <Button 
              className="w-full h-16 text-xl font-medium bg-giohub-card-secondary hover:bg-giohub-gray transition-colors"
            >
              ⚙ Configuración
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
