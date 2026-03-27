// Tipos de base de datos

export interface Asignatura {
  id: string
  nombre: string
  color: string | null
  created_at: string
  updated_at: string
}

export interface AsignaturaCreate {
  nombre: string
  color?: string
}

export interface Sesion {
  id: string
  fecha: string
  dia_semana: string
  asignatura_id: string
  hora_inicio: string
  hora_final: string
  minutos_estudio: number
  tipo_tarea: string | null
  sincronizado_calendar: boolean
  created_at: string
}

export interface SesionCreate {
  fecha: string
  dia_semana: string
  asignatura_id: string
  hora_inicio: string
  hora_final: string
  minutos_estudio: number
  tipo_tarea?: string
}

export interface SesionConAsignatura extends Sesion {
  asignatura: Asignatura
}

// Tipos de estadísticas

export interface EstadisticaMinutosHoy {
  fecha: string
  total_minutos: number
  total_horas: number
}

export interface EstadisticaPorAsignatura {
  asignatura: string
  asignatura_id: string
  color: string | null
  total_minutos: number
  total_horas: number
  sesiones_count: number
}

export interface EstadisticaPorDia {
  fecha: string
  total_minutos: number
  total_horas: number
  sesiones_count: number
}

// Tipos de Google Calendar

export interface CalendarEventData {
  asignatura: string
  tipo_tarea: string
  fecha: string
  hora_inicio: string
  hora_final: string
}
