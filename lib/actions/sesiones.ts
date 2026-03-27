'use server'

import { createServerClient } from '@/lib/supabase/server'
import { Sesion, SesionCreate, SesionConAsignatura } from '@/lib/types'
import { getToday } from '@/lib/utils'
import { getUserId } from '@/lib/clerk'

export async function createSesion(datos: SesionCreate): Promise<Sesion> {
  const supabase = createServerClient()
  const clerkId = await getUserId()

  if (!clerkId) {
    throw new Error('No autenticado')
  }

  const { data, error } = await supabase
    .from('sesiones_estudio')
    .insert({ ...datos, clerk_id: clerkId })
    .select()
    .single()

  if (error) {
    console.error('Error al crear sesión:', error)
    throw new Error('No se pudo crear la sesión')
  }

  return data
}

export async function getSesionesRecientes(limit: number = 10): Promise<SesionConAsignatura[]> {
  const supabase = createServerClient()
  const clerkId = await getUserId()

  const { data, error } = await supabase
    .from('sesiones_estudio')
    .select(`
      *,
      asignatura:asignaturas(*)
    `)
    .eq('clerk_id', clerkId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error al obtener sesiones recientes:', error)
    throw new Error('No se pudieron cargar las sesiones')
  }

  return data || []
}

export async function getSesionesHoy(): Promise<SesionConAsignatura[]> {
  const supabase = createServerClient()
  const clerkId = await getUserId()
  const hoy = getToday()

  const { data, error } = await supabase
    .from('sesiones_estudio')
    .select(`
      *,
      asignatura:asignaturas(*)
    `)
    .eq('clerk_id', clerkId)
    .eq('fecha', hoy)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener sesiones de hoy:', error)
    throw new Error('No se pudieron cargar las sesiones de hoy')
  }

  return data || []
}

export async function deleteSesion(id: string): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('sesiones_estudio')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error al eliminar sesión:', error)
    throw new Error('No se pudo eliminar la sesión')
  }
}
