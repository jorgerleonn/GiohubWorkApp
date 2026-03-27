'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Header } from '@/components/layout/Header'
import { BackButton } from '@/components/layout/BackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getAsignaturas, createAsignatura, deleteAsignatura } from '@/lib/actions/asignaturas'
import { Asignatura } from '@/lib/types'

export default function ConfigPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])
  const [nombreNueva, setNombreNueva] = useState('')
  const [colorNueva, setColorNueva] = useState('#FF4C4C')
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{tipo: 'success' | 'error', texto: string} | null>(null)

  // Cargar asignaturas al montar
  useEffect(() => {
    cargarAsignaturas()
  }, [])

  const cargarAsignaturas = async () => {
    try {
      const data = await getAsignaturas()
      setAsignaturas(data)
    } catch (error) {
      mostrarMensaje('error', 'Error al cargar asignaturas')
    }
  }

  const handleAñadir = async () => {
    if (!nombreNueva.trim()) {
      mostrarMensaje('error', 'El nombre no puede estar vacío')
      return
    }

    setLoading(true)
    try {
      await createAsignatura({ nombre: nombreNueva, color: colorNueva })
      mostrarMensaje('success', `Asignatura "${nombreNueva}" añadida correctamente`)
      setNombreNueva('')
      await cargarAsignaturas()
    } catch (error) {
      mostrarMensaje('error', error instanceof Error ? error.message : 'Error al añadir asignatura')
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async () => {
    if (!asignaturaSeleccionada) {
      mostrarMensaje('error', 'Selecciona una asignatura para eliminar')
      return
    }

    const asig = asignaturas.find(a => a.id === asignaturaSeleccionada)
    if (!asig) return

    if (!confirm(`¿Estás seguro de eliminar "${asig.nombre}"? Se borrarán todas sus sesiones.`)) {
      return
    }

    setLoading(true)
    try {
      await deleteAsignatura(asignaturaSeleccionada)
      mostrarMensaje('success', `Asignatura "${asig.nombre}" eliminada`)
      setAsignaturaSeleccionada('')
      await cargarAsignaturas()
    } catch (error) {
      mostrarMensaje('error', 'Error al eliminar asignatura')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </main>
    )
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white">Por favor, inicia sesión para continuar</div>
      </main>
    )
  }

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje(null), 3000)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen p-6">
        <div className="mb-6">
          <BackButton />
        </div>
      
      <div className="max-w-2xl mx-auto">
        <Card className="bg-giohub-card border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl text-white">
              ⚙ Configuración
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 p-8">
            {/* Mensaje de feedback */}
            {mensaje && (
              <div className={`p-3 rounded-md text-sm font-medium ${
                mensaje.tipo === 'success' 
                  ? 'bg-giohub-success/20 text-giohub-success' 
                  : 'bg-giohub-primary/20 text-giohub-primary'
              }`}>
                {mensaje.texto}
              </div>
            )}

            {/* Formulario de añadir */}
            <div className="bg-giohub-card-secondary rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white">
                Añadir Asignatura
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="asignatura" className="text-gray-300">
                  Nombre de la asignatura
                </Label>
                <Input
                  id="asignatura"
                  placeholder="Ej: Matemáticas"
                  value={nombreNueva}
                  onChange={(e) => setNombreNueva(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAñadir()}
                  className="bg-giohub-bg-dark border-giohub-gray text-white"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color" className="text-gray-300">
                  Color (opcional)
                </Label>
                <div className="flex gap-2">
                  <input
                    id="color"
                    type="color"
                    value={colorNueva}
                    onChange={(e) => setColorNueva(e.target.value)}
                    className="h-10 w-20 rounded-md border border-giohub-gray cursor-pointer"
                    disabled={loading}
                  />
                  <Input
                    value={colorNueva}
                    onChange={(e) => setColorNueva(e.target.value)}
                    className="bg-giohub-bg-dark border-giohub-gray text-white"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleAñadir}
                disabled={loading || !nombreNueva.trim()}
                className="w-full bg-giohub-success hover:bg-giohub-success/80"
              >
                {loading ? '⏳ Añadiendo...' : '➕ Añadir Asignatura'}
              </Button>
            </div>
            
            {/* Lista de asignaturas */}
            <div className="bg-giohub-card-secondary rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Asignaturas Actuales ({asignaturas.length})
              </h3>
              
              {asignaturas.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No hay asignaturas registradas. Añade una arriba.
                </p>
              ) : (
                <div className="space-y-2">
                  {asignaturas.map((asig) => (
                    <div 
                      key={asig.id}
                      className={`p-3 rounded-md flex items-center gap-3 cursor-pointer transition-colors ${
                        asignaturaSeleccionada === asig.id
                          ? 'bg-giohub-primary/30 border border-giohub-primary'
                          : 'bg-giohub-bg-dark hover:bg-giohub-gray/30'
                      }`}
                      onClick={() => setAsignaturaSeleccionada(asig.id)}
                    >
                      {asig.color && (
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: asig.color }}
                        />
                      )}
                      <span className="text-white font-medium flex-1">{asig.nombre}</span>
                      {asignaturaSeleccionada === asig.id && (
                        <span className="text-xs text-giohub-primary">✓ Seleccionada</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {asignaturas.length > 0 && (
                <Button 
                  onClick={handleEliminar}
                  disabled={loading || !asignaturaSeleccionada}
                  variant="destructive"
                  className="w-full mt-4 bg-giohub-primary hover:bg-giohub-primary-hover"
                >
                  {loading ? '⏳ Eliminando...' : '🗑️ Eliminar Seleccionada'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
    </>
  )
}
