'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Timer } from '@/components/work/Timer'
import { TodoList } from '@/components/work/TodoList'
import { useTimerStore } from '@/lib/store/timerStore'
import { getAsignaturas } from '@/lib/actions/asignaturas'
import { createSesion, getSesionesHoy, deleteSesion } from '@/lib/actions/sesiones'
import { Asignatura, SesionConAsignatura } from '@/lib/types'
import { formatTime, getDayOfWeek, getToday, minutesToHoursMinutes } from '@/lib/utils'
import { Clock, Trash2 } from 'lucide-react'

export default function WorkPage() {
  const { isSignedIn, isLoaded } = useUser()
  const { segundos: storeSegundos, activo: storeActivo, setAsignaturaId, setTipoTarea } = useTimerStore()
  
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('')
  const [tipoTarea, setTipoTareaLocal] = useState('')
  const [modo, setModo] = useState<'pomodoro' | 'flowtime'>('flowtime')
  const [breakRatio, setBreakRatio] = useState(4) // 1:4 ratio by default for flowtime
  const [pomodoroDuration, setPomodoroDuration] = useState(25) // minutes
  const [pomodoroBreak, setPomodoroBreak] = useState(5) // minutes
  const [sesionesHoy, setSesionesHoy] = useState<SesionConAsignatura[]>([])
  const [totalMinutosHoy, setTotalMinutosHoy] = useState(0)
  const [mensaje, setMensaje] = useState<{tipo: 'success' | 'error', texto: string} | null>(null)
  const [syncCalendar, setSyncCalendar] = useState(true)
  const [horaActual, setHoraActual] = useState('')
  const [ubicacion, setUbicacion] = useState<string | null>(null)

  useEffect(() => {
    const actualizarHora = () => {
      const ahora = new Date()
      setHoraActual(ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    actualizarHora()
    const intervalo = setInterval(actualizarHora, 1000)
    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
            )
            const data = await response.json()
            const city = data.address.city || data.address.town || data.address.village || data.address.county
            const country = data.address.country_code?.toUpperCase()
            if (city) {
              setUbicacion(country ? `${city}, ${country}` : city)
            }
          } catch {
            // No se pudo obtener la ubicación
          }
        },
        () => {
          // Usuario denegó o error
        }
      )
    }
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    if (asignaturaSeleccionada) {
      setAsignaturaId(asignaturaSeleccionada)
    }
  }, [asignaturaSeleccionada, setAsignaturaId])

  useEffect(() => {
    setTipoTarea(tipoTarea)
  }, [tipoTarea, setTipoTarea])

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
      await createSesion({
        fecha,
        dia_semana: diaSemana,
        asignatura_id: asignaturaSeleccionada,
        hora_inicio: horaInicio,
        hora_final: horaFinal,
        minutos_estudio: minutos,
        tipo_tarea: tipoTarea || undefined
      })

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

      await cargarDatos()
      setTipoTareaLocal('')
    } catch (error) {
      mostrarMensaje('error', 'Error al guardar la sesión')
      console.error(error)
    }
  }

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje(null), 4000)
  }

  const handleEliminarSesion = async (sesionId: string) => {
    if (!confirm('¿Eliminar esta sesión?')) return
    try {
      await deleteSesion(sesionId)
      mostrarMensaje('success', 'Sesión eliminada')
      await cargarDatos()
    } catch (error) {
      mostrarMensaje('error', 'Error al eliminar sesión')
    }
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
      <main className="min-h-screen p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-[#ff4c4c]" style={{ textShadow: '0 0 10px rgba(255,76,76,0.5)' }}>Work</span> / Pomodoro
          </h1>
          <p className="text-deepworkos-text-muted">Inicia una sesión de estudio</p>
        </div>

        {mensaje && (
          <div className={`mb-6 p-3 rounded-lg text-sm font-medium ${
            mensaje.tipo === 'success' 
              ? 'bg-deepworkos-success/10 text-deepworkos-success border border-deepworkos-success/30' 
              : 'bg-deepworkos-primary/10 text-deepworkos-primary border border-deepworkos-primary/30'
          }`}>
            {mensaje.texto}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-deepworkos-card/50 border border-deepworkos-border/50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label className="text-deepworkos-text-muted">Asignatura</Label>
                <Select
                  value={asignaturaSeleccionada}
                  onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
                  className="bg-deepworkos-bg-dark border-deepworkos-border text-white"
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

              <div className="space-y-2">
                <Label className="text-deepworkos-text-muted">Tipo de tarea (opcional)</Label>
                <Input
                  placeholder="Ej: Ejercicios, Teoría, Proyecto..."
                  value={tipoTarea}
                  onChange={(e) => setTipoTareaLocal(e.target.value)}
                  className="bg-deepworkos-bg-dark border-deepworkos-border text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-deepworkos-text-muted">Modo</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setModo('pomodoro')}
                    className={`flex-1 ${
                      modo === 'pomodoro' 
                        ? 'bg-deepworkos-primary hover:bg-deepworkos-primary-hover shadow-neon-primary' 
                        : 'bg-deepworkos-card-secondary hover:bg-deepworkos-card-hover'
                    }`}
                  >
                    Pomodoro
                  </Button>
                  <Button
                    onClick={() => setModo('flowtime')}
                    className={`flex-1 ${
                      modo === 'flowtime' 
                        ? 'bg-deepworkos-turquoise text-deepworkos-bg-dark hover:bg-deepworkos-turquoise/80 shadow-neon-turquoise' 
                        : 'bg-deepworkos-card-secondary hover:bg-deepworkos-card-hover'
                    }`}
                  >
                    Flowtime
                  </Button>
                </div>
              </div>

              {modo === 'flowtime' && (
                <div className="space-y-2">
                  <Label className="text-deepworkos-text-muted">Descanso (Flowtime)</Label>
                  <Select
                    value={breakRatio.toString()}
                    onChange={(e) => setBreakRatio(parseInt(e.target.value))}
                    className="bg-deepworkos-bg-dark border-deepworkos-border text-white"
                  >
                    <option value="2">1:2 (50% estudio, 50% descanso)</option>
                    <option value="3">1:3 (25% descanso)</option>
                    <option value="4">1:4 (20% descanso) - Recomendado</option>
                    <option value="5">1:5 (16% descanso)</option>
                    <option value="6">1:6 (14% descanso)</option>
                    <option value="8">1:8 (11% descanso)</option>
                    <option value="10">1:10 (9% descanso)</option>
                  </Select>
                </div>
              )}

              {modo === 'pomodoro' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-deepworkos-text-muted">Duración Pomodoro</Label>
                    <Select
                      value={pomodoroDuration.toString()}
                      onChange={(e) => setPomodoroDuration(parseInt(e.target.value))}
                      className="bg-deepworkos-bg-dark border-deepworkos-border text-white"
                    >
                      <option value="15">15 minutos</option>
                      <option value="20">20 minutos</option>
                      <option value="25">25 minutos - Clásico</option>
                      <option value="30">30 minutos</option>
                      <option value="45">45 minutos</option>
                      <option value="60">60 minutos</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-deepworkos-text-muted">Descanso Pomodoro</Label>
                    <Select
                      value={pomodoroBreak.toString()}
                      onChange={(e) => setPomodoroBreak(parseInt(e.target.value))}
                      className="bg-deepworkos-bg-dark border-deepworkos-border text-white"
                    >
                      <option value="5">5 minutos</option>
                      <option value="10">10 minutos</option>
                      <option value="15">15 minutos</option>
                      <option value="20">20 minutos</option>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label className="text-deepworkos-text-muted">Opciones</Label>
                <label className="flex items-center gap-2 p-3 bg-deepworkos-card-secondary/50 rounded-lg cursor-pointer border border-deepworkos-border hover:border-deepworkos-turquoise transition-colors">
                  <input
                    type="checkbox"
                    checked={syncCalendar}
                    onChange={(e) => setSyncCalendar(e.target.checked)}
                    className="w-4 h-4 accent-deepworkos-turquoise"
                  />
                  <span className="text-sm text-white">Sincronizar con Google Calendar</span>
                </label>
              </div>
            </div>

            <div className="border-t border-deepworkos-border/50 pt-6">
              <Timer 
                onComplete={handleTimerComplete} 
                modo={modo} 
                breakRatio={modo === 'flowtime' ? breakRatio : pomodoroBreak}
                pomodoroDuration={modo === 'pomodoro' ? pomodoroDuration : 0}
                onBreakComplete={() => {
                  mostrarMensaje('success', '¡Descanso completado! Puedes iniciar una nueva sesión.')
                }}
              />
              <TodoList asignaturas={asignaturas} currentAsignaturaId={asignaturaSeleccionada} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-deepworkos-card/50 border border-deepworkos-border/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <p className="text-4xl font-bold text-white tabular-nums tracking-wider" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>
                  {horaActual}
                </p>
                {ubicacion && (
                  <p className="text-xs text-deepworkos-text-muted">{ubicacion}</p>
                )}
              </div>
            </div>

            <div className="bg-deepworkos-card/50 border border-deepworkos-border/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-deepworkos-text-muted">Sesiones hoy</h3>
                <Clock className="w-4 h-4 text-deepworkos-text-muted" />
              </div>
              <p className="text-3xl font-bold text-white">{sesionesHoy.length}</p>
            </div>

            <div className="bg-deepworkos-card/50 border border-deepworkos-border/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-deepworkos-text-muted">Tiempo total</h3>
                <Clock className="w-4 h-4 text-deepworkos-text-muted" />
              </div>
              <p className="text-3xl font-bold text-white">{minutesToHoursMinutes(totalMinutosHoy)}</p>
            </div>

            {sesionesHoy.length > 0 && (
              <div className="bg-deepworkos-card/50 border border-deepworkos-border/50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-deepworkos-text-muted mb-3">Sesiones de hoy</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sesionesHoy.map((sesion) => (
                    <div key={sesion.id} className="bg-deepworkos-bg-dark/50 p-2 rounded-lg flex justify-between items-center text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate flex items-center gap-1.5">
                          {sesion.asignatura.color && (
                            <span 
                              className="w-2 h-2 rounded-full flex-shrink-0" 
                              style={{ 
                                backgroundColor: sesion.asignatura.color,
                                boxShadow: `0 0 4px ${sesion.asignatura.color}`
                              }}
                            />
                          )}
                          <span className="truncate">{sesion.asignatura.nombre}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-deepworkos-text-muted text-xs">
                          {sesion.hora_inicio.slice(0, 5)} · {minutesToHoursMinutes(sesion.minutos_estudio)}
                        </span>
                        <button
                          onClick={() => handleEliminarSesion(sesion.id)}
                          className="text-deepworkos-primary hover:text-deepworkos-primary-hover p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  )
}
