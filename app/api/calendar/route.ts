import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { CalendarEventData } from '@/lib/types'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@/lib/clerk-client'

// POST /api/calendar - Crear evento en Google Calendar del usuario
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body: CalendarEventData = await req.json()
    const { asignatura, tipo_tarea, fecha, hora_inicio, hora_final } = body
    
    if (!asignatura || !fecha || !hora_inicio || !hora_final) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }
    
    // Obtener token de Google desde Clerk
    console.log('User ID:', userId)
    console.log('Request body:', JSON.stringify(body))
    
    let oauthAccessTokenResponse
    try {
      oauthAccessTokenResponse = await clerkClient.users.getUserOauthAccessToken(userId, 'google')
      console.log('OAuth Response:', JSON.stringify(oauthAccessTokenResponse, null, 2))
    } catch (err) {
      console.error('Error getting OAuth token:', err)
      return NextResponse.json(
        { error: 'Error al obtener token de Google. Asegúrate de tener Google conectado en tu perfil de Clerk.' },
        { status: 401 }
      )
    }
    
    const googleToken = oauthAccessTokenResponse.data[0]?.token
    console.log('Google Token:', googleToken ? 'EXISTS' : 'MISSING')
    
    if (!googleToken) {
      console.log('No Google token found for user:', userId)
      return NextResponse.json(
        { error: 'Google Calendar no conectado. Ve a tu perfil de Clerk > Account > Connected Accounts y conecta Google.' },
        { status: 401 }
      )
    }
    
    // Autenticación con el token del usuario
    const authObj = new google.auth.OAuth2()
    authObj.setCredentials({ access_token: googleToken })
    
    const calendar = google.calendar({ version: 'v3', auth: authObj })
    
    // Convertir fecha y hora al formato correcto (ISO 8601)
    const [year, month, day] = fecha.split('-')
    const [horaI, minI, segI] = hora_inicio.split(':')
    const [horaF, minF, segF] = hora_final.split(':')
    
    const inicio = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(horaI),
      parseInt(minI),
      parseInt(segI || '0')
    )
    
    const fin = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(horaF),
      parseInt(minF),
      parseInt(segF || '0')
    )
    
    // Crear evento
    const event = {
      summary: `📚 ${asignatura}`,
      description: tipo_tarea || 'Sesión de estudio DeepWorkOS',
      start: {
        dateTime: inicio.toISOString(),
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: fin.toISOString(),
        timeZone: 'Europe/Madrid',
      },
    }
    
    // Usar el calendario principal del usuario
    const response = await calendar.events.insert({
      calendarId: 'primary',
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
