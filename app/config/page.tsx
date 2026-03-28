'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getAsignaturas, createAsignatura, deleteAsignatura } from '@/lib/actions/asignaturas'
import { Asignatura } from '@/lib/types'
import { Plus, Trash2, Palette } from 'lucide-react'

const defaultColors = [
  '#00ff88',
  '#00d4ff',
  '#bf5af2',
  '#ff6b9d',
  '#ffd93d',
  '#ff9f43',
  '#ff4c4c',
  '#00ffff',
]

export default function ConfigPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])
  const [nombreNueva, setNombreNueva] = useState('')
  const [colorNueva, setColorNueva] = useState('#00ff88')
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{tipo: 'success' | 'error', texto: string} | null>(null)

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

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje(null), 3000)
  }

  if (!isLoaded) {
    return (
      <AppLayout>
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-deepworkos-turquoise animate-pulse">Cargando...</div>
        </main>
      </AppLayout>
    )
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white">Por favor, inicia sesión para continuar</div>
      </main>
    )
  }

  return (
    <AppLayout>
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              <span className="text-deepworkos-purple" style={{ textShadow: '0 0 10px rgba(191,90,242,0.5)' }}>Configuración</span>
            </h1>
            <p className="text-deepworkos-text-muted">Administra tus asignaturas</p>
          </div>

          <Card className="bg-deepworkos-card border-deepworkos-border">
            <CardContent className="p-6 space-y-6">
              {mensaje && (
                <div className={`p-3 rounded-md text-sm font-medium ${
                  mensaje.tipo === 'success' 
                    ? 'bg-deepworkos-success/10 text-deepworkos-success border border-deepworkos-success/30' 
                    : 'bg-deepworkos-primary/10 text-deepworkos-primary border border-deepworkos-primary/30'
                }`}>
                  {mensaje.texto}
                </div>
              )}

              <div className="bg-deepworkos-card-secondary rounded-xl p-6 space-y-4 border border-deepworkos-border">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-deepworkos-success" />
                  Añadir Asignatura
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="asignatura" className="text-deepworkos-text-muted">
                    Nombre de la asignatura
                  </Label>
                  <Input
                    id="asignatura"
                    placeholder="Ej: Matemáticas"
                    value={nombreNueva}
                    onChange={(e) => setNombreNueva(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAñadir()}
                    className="bg-deepworkos-bg-dark border-deepworkos-border text-white"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-deepworkos-text-muted">Color</Label>
                  <div className="flex gap-2 items-center">
                    <div className="flex gap-1">
                      {defaultColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setColorNueva(color)}
                          className={`w-8 h-8 rounded-lg transition-all ${
                            colorNueva === color ? 'ring-2 ring-white ring-offset-2 ring-offset-deepworkos-card' : ''
                          }`}
                          style={{ 
                            backgroundColor: color,
                            boxShadow: colorNueva === color ? `0 0 12px ${color}` : 'none'
                          }}
                        />
                      ))}
                    </div>
                    <Input
                      value={colorNueva}
                      onChange={(e) => setColorNueva(e.target.value)}
                      className="w-28 bg-deepworkos-bg-dark border-deepworkos-border text-white"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleAñadir}
                  disabled={loading || !nombreNueva.trim()}
                  className="w-full bg-deepworkos-success hover:bg-deepworkos-success/80 shadow-neon-success"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {loading ? 'Añadiendo...' : 'Añadir Asignatura'}
                </Button>
              </div>
            
              <div className="bg-deepworkos-card-secondary rounded-xl p-6 border border-deepworkos-border">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-deepworkos-purple" />
                  Asignaturas Actuales ({asignaturas.length})
                </h3>
                
                {asignaturas.length === 0 ? (
                  <p className="text-deepworkos-text-muted text-sm text-center py-4">
                    No hay asignaturas registradas. Añade una arriba.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {asignaturas.map((asig) => (
                      <div 
                        key={asig.id}
                        className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all ${
                          asignaturaSeleccionada === asig.id
                            ? 'bg-deepworkos-card-hover border border-deepworkos-turquoise'
                            : 'bg-deepworkos-bg-dark hover:bg-deepworkos-card-hover border border-transparent'
                        }`}
                        onClick={() => setAsignaturaSeleccionada(asig.id)}
                      >
                        {asig.color && (
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ 
                              backgroundColor: asig.color,
                              boxShadow: `0 0 8px ${asig.color}`
                            }}
                          />
                        )}
                        <span className="text-white font-medium flex-1">{asig.nombre}</span>
                        {asignaturaSeleccionada === asig.id && (
                          <span className="text-xs text-deepworkos-turquoise">✓</span>
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
                    className="w-full mt-4 bg-deepworkos-primary/20 text-deepworkos-primary border border-deepworkos-primary/30 hover:bg-deepworkos-primary hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {loading ? 'Eliminando...' : 'Eliminar Seleccionada'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  )
}
