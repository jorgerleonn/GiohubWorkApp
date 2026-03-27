'use server'

import { createServerClient } from '@/lib/supabase/server'
import { Asignatura, AsignaturaCreate } from '@/lib/types'
import { getUserId } from '@/lib/clerk'

export async function getAsignaturas(): Promise<Asignatura[]> {
  const supabase = createServerClient()
  const userId = await getUserId()

  const { data, error } = await supabase
    .from('asignaturas')
    .select('*')
    .eq('user_id', userId)
    .order('nombre')

  if (error) {
    console.error('Error al obtener asignaturas:', error)
    throw new Error('No se pudieron cargar las asignaturas')
  }

  return data || []
}

export async function createAsignatura(datos: AsignaturaCreate): Promise<Asignatura> {
  const supabase = createServerClient()
  const userId = await getUserId()

  if (!userId) {
    throw new Error('No autenticado')
  }

  const { data, error } = await supabase
    .from('asignaturas')
    .insert({ ...datos, user_id: userId })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ya existe una asignatura con ese nombre')
    }
    console.error('Error al crear asignatura:', error)
    throw new Error('No se pudo crear la asignatura')
  }

  return data
}

export async function deleteAsignatura(id: string): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('asignaturas')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error al eliminar asignatura:', error)
    throw new Error('No se pudo eliminar la asignatura')
  }
}
