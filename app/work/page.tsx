'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Header } from '@/components/layout/Header'
import { BackButton } from '@/components/layout/BackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Timer } from '@/components/work/Timer'
import { getAsignaturas } from '@/lib/actions/asignaturas'
import { createSesion, getSesionesHoy } from '@/lib/actions/sesiones'
import { Asignatura, SesionConAsignatura } from '@/lib/types'
import { formatTime, getDayOfWeek, getToday, minutesToHoursMinutes } from '@/lib/utils'

export default function WorkPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('')
  const [tipoTarea, setTipoTarea] = useState('')
  const [modo, setModo] = useState<'pomodoro' | 'flowtime'>('flowtime')
  const [sesionesHoy, setSesionesHoy] = useState<SesionConAsignatura[]>([])
  const [totalMinutosHoy, setTotalMinutosHoy] = useState(0)
  const [mensaje, setMensaje] = useState<{tipo: 'success' | 'error', texto: string} | null>(null)
  const [syncCalendar, setSyncCalendar] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [asigsData, sesionesData] = await Promise.all([
        getAsignaturas(),
        getSesionesHoy()
      ])
      setAsignaturas(asigsData)
      setSesionesHoy(sesionesData)
      
      const totalMin = sesionesData.reduce((sum, s) => sum + s.minutos_estudio, 0)
      setTotalMinutosHoy(totalMin)

      // Auto-seleccionar primera asignatura si no hay ninguna seleccionada
      if (asigsData.length > 0 && !asignaturaSeleccionada) {
        setAsignaturaSeleccionada(asigsData[0].id)
      }
    } catch (error) {
      console.error('Error al cargar datos:', error)
    }
  }

  const handleTimerComplete = async (segundos: number) => {
    if (!asignaturaSeleccionada) {
      mostrarMensaje('error', 'Selecciona una asignatura')
      return
    }

    const minutos = Math.floor(segundos / 60)
    if (minutos === 0) {
      mostrarMensaje('error', 'La sesión debe durar al menos 1 minuto')
      return
    }

    const ahora = new Date()
    const horaFinal = formatTime(ahora)
    const fechaInicio = new Date(ahora.getTime() - (segundos * 1000))
    const horaInicio = formatTime(fechaInicio)
    const fecha = getToday()
    const diaSemana = getDayOfWeek(ahora)

    try {
      // Guardar sesión en Supabase
      await createSesion({
        fecha,
        dia_semana: diaSemana,
        asignatura_id: asignaturaSeleccionada,
        hora_inicio: horaInicio,
        hora_final: horaFinal,
        minutos_estudio: minutos,
        tipo_tarea: tipoTarea || undefined
      })

      // Sincronizar con Google Calendar si está activado
      if (syncCalendar) {
        try {
          const asig = asignaturas.find(a => a.id === asignaturaSeleccionada)
          await fetch('/api/calendar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              asignatura: asig?.nombre || 'Estudio',
              tipo_tarea: tipoTarea || '',
              fecha,
              hora_inicio: horaInicio,
              hora_final: horaFinal
            })
          })
          mostrarMensaje('success', `Sesión guardada (${minutos} min) y sincronizada con Calendar`)
        } catch {
          mostrarMensaje('success', `Sesión guardada (${minutos} min) - Error al sincronizar Calendar`)
        }
      } else {
        mostrarMensaje('success', `Sesión guardada: ${minutos} minutos`)
      }

      // Recargar sesiones
      await cargarDatos()
      
      // Limpiar tipo de tarea
      setTipoTarea('')
    } catch (error) {
      mostrarMensaje('error', 'Error al guardar la sesión')
      console.error(error)
    }
  }

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje(null), 4000)
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

  return (
    <>
      <Header />
      <main className="min-h-screen p-6">
        <div className="mb-6">
          <BackButton />
        </div>
      
      <div className="max-w-6xl mx-auto">
        <Card className="bg-giohub-card border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl text-white">
              ▶ Work / Pomodoro
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8 p-8">
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

            {/* Configuración */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Selector de asignatura */}
              <div className="space-y-2">
                <Label className="text-gray-300">Asignatura</Label>
                <Select
                  value={asignaturaSeleccionada}
                  onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
                  className="bg-giohub-bg-dark border-giohub-gray text-white"
                >
                  {asignaturas.length === 0 ? (
                    <option value="">No hay asignaturas (ve a Configuración)</option>
                  ) : (
                    <>
                      <option value="">Selecciona una asignatura</option>
                      {asignaturas.map((asig) => (
                        <option key={asig.id} value={asig.id}>
                          {asig.nombre}
                        </option>
                      ))}
                    </>
                  )}
                </Select>
              </div>

              {/* Tipo de tarea */}
              <div className="space-y-2">
                <Label className="text-gray-300">Tipo de tarea (opcional)</Label>
                <Input
                  placeholder="Ej: Ejercicios, Teoría, Proyecto..."
                  value={tipoTarea}
                  onChange={(e) => setTipoTarea(e.target.value)}
                  className="bg-giohub-bg-dark border-giohub-gray text-white"
                />
              </div>

              {/* Modo */}
              <div className="space-y-2">
                <Label className="text-gray-300">Modo</Label>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setModo('pomodoro')}
                    className={`flex-1 ${
                      modo === 'pomodoro' 
                        ? 'bg-giohub-primary' 
                        : 'bg-giohub-card-secondary'
                    }`}
                  >
                    Pomodoro
                  </Button>
                  <Button
                    onClick={() => setModo('flowtime')}
                    className={`flex-1 ${
                      modo === 'flowtime' 
                        ? 'bg-giohub-turquoise' 
                        : 'bg-giohub-card-secondary'
                    }`}
                  >
                    Flowtime
                  </Button>
                </div>
              </div>

              {/* Sincronizar Calendar */}
              <div className="space-y-2">
                <Label className="text-gray-300">Opciones</Label>
                <label className="flex items-center gap-2 p-3 bg-giohub-card-secondary rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncCalendar}
                    onChange={(e) => setSyncCalendar(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-white">Sincronizar con Google Calendar</span>
                </label>
              </div>
            </div>

            {/* Cronómetro */}
            <div className="bg-giohub-card-secondary rounded-lg p-8">
              <Timer onComplete={handleTimerComplete} modo={modo} />
            </div>

            {/* Estadísticas del día */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-giohub-card-secondary rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400">Sesiones hoy</p>
                <p className="text-3xl font-bold text-white">{sesionesHoy.length}</p>
              </div>
              <div className="bg-giohub-card-secondary rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400">Tiempo total hoy</p>
                <p className="text-3xl font-bold text-white">{minutesToHoursMinutes(totalMinutosHoy)}</p>
              </div>
            </div>

            {/* Historial del día */}
            {sesionesHoy.length > 0 && (
              <div className="bg-giohub-card-secondary rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Sesiones de hoy
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {sesionesHoy.map((sesion) => (
                    <div key={sesion.id} className="bg-giohub-bg-dark p-3 rounded-md flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{sesion.asignatura.nombre}</p>
                        {sesion.tipo_tarea && (
                          <p className="text-sm text-gray-400">{sesion.tipo_tarea}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-white font-mono text-sm">
                          {sesion.hora_inicio.slice(0, 5)} - {sesion.hora_final.slice(0, 5)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {minutesToHoursMinutes(sesion.minutos_estudio)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
    </>
  )
}
