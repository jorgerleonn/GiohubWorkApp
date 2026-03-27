import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parse } from 'date-fns'
import { es } from 'date-fns/locale'

// Combina classNames con Tailwind merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatea fecha a DD/MM/YYYY
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd/MM/yyyy')
}

// Formatea hora a HH:MM:SS
export function formatTime(date: Date): string {
  return format(date, 'HH:mm:ss')
}

// Obtiene el día de la semana en inglés
export function getDayOfWeek(date: Date): string {
  return format(date, 'EEEE')
}

// Calcula minutos entre dos horas
export function calculateMinutes(horaInicio: string, horaFinal: string): number {
  const inicio = parse(horaInicio, 'HH:mm:ss', new Date())
  const final = parse(horaFinal, 'HH:mm:ss', new Date())
  return Math.floor((final.getTime() - inicio.getTime()) / (1000 * 60))
}

// Convierte minutos a formato "Xh Ym"
export function minutesToHoursMinutes(minutos: number): string {
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  if (horas === 0) return `${mins}m`
  if (mins === 0) return `${horas}h`
  return `${horas}h ${mins}m`
}

// Obtiene fecha de hoy en formato YYYY-MM-DD
export function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

// Convierte fecha DD/MM/YYYY a YYYY-MM-DD
export function convertDateFormat(date: string): string {
  const [day, month, year] = date.split('/')
  return `${year}-${month}-${day}`
}
