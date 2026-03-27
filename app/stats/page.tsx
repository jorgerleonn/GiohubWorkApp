'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Header } from '@/components/layout/Header'
import { BackButton } from '@/components/layout/BackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HorasPorAsignaturaChart } from '@/components/stats/HorasPorAsignaturaChart'
import { HorasPorDiaChart } from '@/components/stats/HorasPorDiaChart'
import { getMinutosHoy, getHorasPorAsignatura, getHorasPorDia } from '@/lib/actions/estadisticas'
import { getSesionesRecientes } from '@/lib/actions/sesiones'
import { 
  EstadisticaMinutosHoy, 
  EstadisticaPorAsignatura, 
  EstadisticaPorDia,
  SesionConAsignatura 
} from '@/lib/types'
import { minutesToHoursMinutes, formatDate } from '@/lib/utils'

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
      const [minHoy, hrsPorAsig, hrsPorDia, sesiones] = await Promise.all([
        getMinutosHoy(),
        getHorasPorAsignatura(),
        getHorasPorDia(diasMostrar),
        getSesionesRecientes(20)
      ])

      setMinutosHoy(minHoy)
      setHorasPorAsignatura(hrsPorAsig)
      setHorasPorDia(hrsPorDia)
      setSesionesRecientes(sesiones)
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
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

  if (loading) {
    return (
      <main className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-white text-xl">Cargando estadísticas...</div>
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
      
      <div className="max-w-7xl mx-auto">
        <Card className="bg-giohub-card border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl text-white">
              📊 Panel de Estadísticas
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8 p-8">
            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-giohub-card-secondary rounded-lg p-6 text-center">
                <p className="text-sm text-gray-400 mb-2">Tiempo hoy</p>
                <p className="text-4xl font-bold text-white">
                  {minutosHoy ? minutesToHoursMinutes(minutosHoy.total_minutos) : '0m'}
                </p>
              </div>
              
              <div className="bg-giohub-card-secondary rounded-lg p-6 text-center">
                <p className="text-sm text-gray-400 mb-2">Total asignaturas</p>
                <p className="text-4xl font-bold text-white">
                  {horasPorAsignatura.length}
                </p>
              </div>
              
              <div className="bg-giohub-card-secondary rounded-lg p-6 text-center">
                <p className="text-sm text-gray-400 mb-2">Sesiones totales</p>
                <p className="text-4xl font-bold text-white">
                  {horasPorAsignatura.reduce((sum, a) => sum + a.sesiones_count, 0)}
                </p>
              </div>
            </div>

            {/* Gráficas */}
            <div className="space-y-6">
              {/* Horas por asignatura */}
              <div className="bg-giohub-card-secondary rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Horas Totales por Asignatura
                </h3>
                <HorasPorAsignaturaChart data={horasPorAsignatura} />
              </div>

              {/* Horas por día */}
              <div className="bg-giohub-card-secondary rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Horas por Día (Últimos {diasMostrar} días)
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setDiasMostrar(7)}
                      className={diasMostrar === 7 ? 'bg-giohub-primary' : 'bg-giohub-card'}
                    >
                      7 días
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setDiasMostrar(30)}
                      className={diasMostrar === 30 ? 'bg-giohub-primary' : 'bg-giohub-card'}
                    >
                      30 días
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setDiasMostrar(90)}
                      className={diasMostrar === 90 ? 'bg-giohub-primary' : 'bg-giohub-card'}
                    >
                      90 días
                    </Button>
                  </div>
                </div>
                <HorasPorDiaChart data={horasPorDia} />
              </div>
            </div>

            {/* Tabla de sesiones recientes */}
            <div className="bg-giohub-card-secondary rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Sesiones Recientes
              </h3>
              
              {sesionesRecientes.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No hay sesiones registradas todavía
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-giohub-gray">
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Fecha</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Asignatura</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Tarea</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Horario</th>
                        <th className="text-right py-3 px-2 text-gray-400 font-medium">Duración</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sesionesRecientes.map((sesion) => (
                        <tr key={sesion.id} className="border-b border-giohub-gray/30 hover:bg-giohub-bg-dark">
                          <td className="py-3 px-2 text-white">
                            {formatDate(new Date(sesion.fecha))}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              {sesion.asignatura.color && (
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: sesion.asignatura.color }}
                                />
                              )}
                              <span className="text-white font-medium">
                                {sesion.asignatura.nombre}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-gray-400">
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
          </CardContent>
        </Card>
      </div>
    </main>
    </>
  )
}
