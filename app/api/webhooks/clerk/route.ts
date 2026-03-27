import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing WEBHOOK_SECRET' }, { status: 500 })
  }

  const payload = await req.json()
  const headers = {
    'svix-id': req.headers.get('svix-id') || '',
    'svix-timestamp': req.headers.get('svix-timestamp') || '',
    'svix-signature': req.headers.get('svix-signature') || '',
  }

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(payload, headers) as WebhookEvent
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { type, data } = evt

  if (type === 'user.created' || type === 'user.updated') {
    const supabase = createServerClient()
    const email = data.email_addresses?.[0]?.email_address
    const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ') || null

    if (email) {
      const { error } = await supabase.from('users').upsert({
        clerk_id: data.id,
        email,
        full_name: fullName,
      }, {
        onConflict: 'clerk_id',
      })

      if (error) {
        console.error('Error syncing user to Supabase:', error)
        return NextResponse.json({ error: 'Database sync failed' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ success: true })
}
