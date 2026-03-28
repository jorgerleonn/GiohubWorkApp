'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { PieChartNeon } from '@/components/stats/PieChartNeon'
import { BarStackNeon } from '@/components/stats/BarStackNeon'
import { LineChartNeon } from '@/components/stats/LineChartNeon'
import { getMinutosHoy, getHorasPorAsignatura, getHorasPorDia } from '@/lib/actions/estadisticas'
import { getSesionesRecientes } from '@/lib/actions/sesiones'
import { 
  EstadisticaMinutosHoy, 
  EstadisticaPorAsignatura, 
  EstadisticaPorDia,
  SesionConAsignatura 
} from '@/lib/types'
import { minutesToHoursMinutes, formatDate } from '@/lib/utils'
import { Clock, BookOpen, FileText, TrendingUp } from 'lucide-react'

export default function StatsPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [minutosHoy, setMinutosHoy] = useState<EstadisticaMinutosHoy | null>(null)
  const [horasPorAsignatura, setHorasPorAsignatura] = useState<EstadisticaPorAsignatura[]>([])
  const [horasPorDia, setHorasPorDia] = useState<EstadisticaPorDia[]>([])
  const [sesionesRecientes, setSesionesRecientes] = useState<SesionConAsignatura[]>([])
  const [diasMostrar, setDiasMostrar] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarEstadisticas()
  }, [diasMostrar])

  const cargarEstadisticas = async () => {
    setLoading(true)
    try {
      const [minHoy, hrsPorAsig, hrsPorDiaData, sesiones] = await Promise.all([
        getMinutosHoy(),
        getHorasPorAsignatura(),
        getHorasPorDia(diasMostrar),
        getSesionesRecientes(20)
      ])

      setMinutosHoy(minHoy)
      setHorasPorAsignatura(hrsPorAsig)
      setHorasPorDia(hrsPorDiaData)
      setSesionesRecientes(sesiones)
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <AppLayout>
        <main className="min-h-screen p-8 flex items-center justify-center">
          <div className="text-deepworkos-turquoise text-xl animate-pulse">Cargando estadísticas...</div>
        </main>
      </AppLayout>
    )
  }

  const statCards = [
    {
      title: 'Tiempo hoy',
      value: minutosHoy ? minutesToHoursMinutes(minutosHoy.total_minutos) : '0m',
      icon: Clock,
      color: 'from-deepworkos-turquoise to-deepworkos-blue',
    },
    {
      title: 'Asignaturas',
      value: horasPorAsignatura.length,
      icon: BookOpen,
      color: 'from-deepworkos-purple to-deepworkos-pink',
    },
    {
      title: 'Sesiones',
      value: horasPorAsignatura.reduce((sum, a) => sum + a.sesiones_count, 0),
      icon: FileText,
      color: 'from-deepworkos-success to-deepworkos-green',
    },
    {
      title: 'Horas totales',
      value: horasPorDia.reduce((sum, d) => sum + d.total_horas, 0).toFixed(1) + 'h',
      icon: TrendingUp,
      color: 'from-deepworkos-orange to-deepworkos-yellow',
    },
  ]

  return (
    <AppLayout>
      <main className="min-h-screen p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-deepworkos-turquoise" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>Estadísticas</span> de Estudio
          </h1>
          <p className="text-deepworkos-text-muted">Visualiza tu progreso y hábitos de estudio</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index} 
                className="bg-deepworkos-card/50 border border-deepworkos-border/50 rounded-xl p-4 hover:bg-deepworkos-card transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-deepworkos-text-muted text-xs">{stat.title}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-deepworkos-card/50 border border-deepworkos-border/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-deepworkos-success" style={{ boxShadow: '0 0 8px #00ff88' }} />
              Distribución por Asignatura
            </h2>
            <PieChartNeon data={horasPorAsignatura} />
          </div>

          <div className="bg-deepworkos-card/50 border border-deepworkos-border/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-deepworkos-purple" style={{ boxShadow: '0 0 8px #bf5af2' }} />
              Horas por Asignatura
            </h2>
            <BarStackNeon data={horasPorAsignatura} />
          </div>
        </div>

        <div className="bg-deepworkos-card/50 border border-deepworkos-border/50 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-deepworkos-turquoise" style={{ boxShadow: '0 0 8px #00d4ff' }} />
              Histórico de Estudio
            </h2>
            <div className="flex gap-2">
              {[7, 30, 90].map((dias) => (
                <Button
                  key={dias}
                  size="sm"
                  onClick={() => setDiasMostrar(dias)}
                  className={`text-xs ${
                    diasMostrar === dias 
                      ? 'bg-deepworkos-turquoise text-deepworkos-bg-dark font-semibold' 
                      : 'bg-deepworkos-card-secondary text-deepworkos-text-muted hover:bg-deepworkos-card-hover'
                  }`}
                >
                  {dias} días
                </Button>
              ))}
            </div>
          </div>
          <LineChartNeon data={horasPorDia} />
        </div>

        <div className="bg-deepworkos-card/50 border border-deepworkos-border/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-deepworkos-orange" style={{ boxShadow: '0 0 8px #ff9f43' }} />
            Sesiones Recientes
          </h2>
          
          {sesionesRecientes.length === 0 ? (
            <p className="text-deepworkos-text-muted text-center py-8">
              No hay sesiones registradas todavía
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-deepworkos-border">
                    <th className="text-left py-3 px-2 text-deepworkos-text-muted font-medium">Fecha</th>
                    <th className="text-left py-3 px-2 text-deepworkos-text-muted font-medium">Asignatura</th>
                    <th className="text-left py-3 px-2 text-deepworkos-text-muted font-medium">Tarea</th>
                    <th className="text-left py-3 px-2 text-deepworkos-text-muted font-medium">Horario</th>
                    <th className="text-right py-3 px-2 text-deepworkos-text-muted font-medium">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  {sesionesRecientes.map((sesion) => (
                    <tr key={sesion.id} className="border-b border-deepworkos-border/30 hover:bg-deepworkos-card-hover/50 transition-colors">
                      <td className="py-3 px-2 text-white">
                        {formatDate(new Date(sesion.fecha))}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {sesion.asignatura.color && (
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: sesion.asignatura.color,
                                boxShadow: `0 0 6px ${sesion.asignatura.color}`
                              }}
                            />
                          )}
                          <span className="text-white font-medium">
                            {sesion.asignatura.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-deepworkos-text-muted">
                        {sesion.tipo_tarea || '-'}
                      </td>
                      <td className="py-3 px-2 text-white font-mono text-xs">
                        {sesion.hora_inicio.slice(0, 5)} - {sesion.hora_final.slice(0, 5)}
                      </td>
                      <td className="py-3 px-2 text-right text-white font-medium">
                        {minutesToHoursMinutes(sesion.minutos_estudio)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  )
}
