'use server'

import { createServerClient } from '@/lib/supabase/server'
import {
  EstadisticaMinutosHoy,
  EstadisticaPorAsignatura,
  EstadisticaPorDia
} from '@/lib/types'
import { getToday } from '@/lib/utils'
import { getUserId } from '@/lib/clerk'

export async function getMinutosHoy(): Promise<EstadisticaMinutosHoy> {
  const supabase = createServerClient()
  const clerkId = await getUserId()
  const hoy = getToday()

  const { data, error } = await supabase
    .from('sesiones_estudio')
    .select('minutos_estudio')
    .eq('clerk_id', clerkId)
    .eq('fecha', hoy)

  if (error) {
    console.error('Error al calcular minutos de hoy:', error)
    return { fecha: hoy, total_minutos: 0, total_horas: 0 }
  }

  const totalMinutos = data.reduce((sum, sesion) => sum + sesion.minutos_estudio, 0)

  return {
    fecha: hoy,
    total_minutos: totalMinutos,
    total_horas: parseFloat((totalMinutos / 60).toFixed(2))
  }
}

export async function getHorasPorAsignatura(): Promise<EstadisticaPorAsignatura[]> {
  const supabase = createServerClient()
  const clerkId = await getUserId()

  const { data, error } = await supabase
    .from('sesiones_estudio')
    .select(`
      minutos_estudio,
      asignatura:asignaturas(id, nombre, color)
    `)
    .eq('clerk_id', clerkId)

  if (error) {
    console.error('Error al obtener estadísticas por asignatura:', error)
    return []
  }

  const estadisticasMap = new Map<string, EstadisticaPorAsignatura>()

  data.forEach((sesion: any) => {
    if (!sesion.asignatura) return

    const asignaturaId = sesion.asignatura.id

    if (estadisticasMap.has(asignaturaId)) {
      const stats = estadisticasMap.get(asignaturaId)!
      stats.total_minutos += sesion.minutos_estudio
      stats.sesiones_count += 1
    } else {
      estadisticasMap.set(asignaturaId, {
        asignatura: sesion.asignatura.nombre,
        asignatura_id: asignaturaId,
        color: sesion.asignatura.color,
        total_minutos: sesion.minutos_estudio,
        total_horas: 0,
        sesiones_count: 1
      })
    }
  })

  const estadisticas = Array.from(estadisticasMap.values()).map(stat => ({
    ...stat,
    total_horas: parseFloat((stat.total_minutos / 60).toFixed(2))
  }))

  return estadisticas.sort((a, b) => b.total_horas - a.total_horas)
}

export async function getHorasPorDia(dias: number = 30): Promise<EstadisticaPorDia[]> {
  const supabase = createServerClient()
  const clerkId = await getUserId()

  const fechaInicio = new Date()
  fechaInicio.setDate(fechaInicio.getDate() - dias)
  const fechaInicioStr = fechaInicio.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('sesiones_estudio')
    .select('fecha, minutos_estudio')
    .eq('clerk_id', clerkId)
    .gte('fecha', fechaInicioStr)
    .order('fecha', { ascending: true })

  if (error) {
    console.error('Error al obtener estadísticas por día:', error)
    return []
  }

  const estadisticasMap = new Map<string, { minutos: number, count: number }>()

  data.forEach((sesion) => {
    const fecha = sesion.fecha

    if (estadisticasMap.has(fecha)) {
      const stats = estadisticasMap.get(fecha)!
      stats.minutos += sesion.minutos_estudio
      stats.count += 1
    } else {
      estadisticasMap.set(fecha, {
        minutos: sesion.minutos_estudio,
        count: 1
      })
    }
  })

  const estadisticas: EstadisticaPorDia[] = Array.from(estadisticasMap.entries()).map(([fecha, stats]) => ({
    fecha,
    total_minutos: stats.minutos,
    total_horas: parseFloat((stats.minutos / 60).toFixed(2)),
    sesiones_count: stats.count
  }))

  return estadisticas
}
