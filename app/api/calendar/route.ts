import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { CalendarEventData } from '@/lib/types'

// POST /api/calendar - Crear evento en Google Calendar
export async function POST(req: NextRequest) {
  try {
    const body: CalendarEventData = await req.json()
    const { asignatura, tipo_tarea, fecha, hora_inicio, hora_final } = body
    
    // Validar datos requeridos
    if (!asignatura || !fecha || !hora_inicio || !hora_final) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }
    
    // Configurar autenticación con service account
    const serviceAccountJSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    if (!serviceAccountJSON) {
      return NextResponse.json(
        { error: 'No se ha configurado la cuenta de servicio de Google' },
        { status: 500 }
      )
    }
    
    const credentials = JSON.parse(serviceAccountJSON)
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })
    
    const calendar = google.calendar({ version: 'v3', auth })
    
    // Convertir fecha y hora al formato correcto (ISO 8601)
    // fecha viene como "YYYY-MM-DD", hora como "HH:MM:SS"
    const [year, month, day] = fecha.split('-')
    const [horaI, minI, segI] = hora_inicio.split(':')
    const [horaF, minF, segF] = hora_final.split(':')
    
    const inicio = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(horaI),
      parseInt(minI),
      parseInt(segI)
    )
    
    const fin = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(horaF),
      parseInt(minF),
      parseInt(segF)
    )
    
    // Crear evento
    const event = {
      summary: asignatura,
      description: tipo_tarea || '',
      start: {
        dateTime: inicio.toISOString(),
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: fin.toISOString(),
        timeZone: 'Europe/Madrid',
      },
    }
    
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    })
    
    return NextResponse.json({
      success: true,
      event_id: response.data.id,
      event_link: response.data.htmlLink,
    })
  } catch (error) {
    console.error('Error al crear evento en Google Calendar:', error)
    return NextResponse.json(
      {
        error: 'Error al sincronizar con Google Calendar',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
