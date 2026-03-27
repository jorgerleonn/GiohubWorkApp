import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export async function getClerkUser() {
  return await currentUser()
}

export async function getSupabaseUser() {
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkUser.id)
    .single()

  if (error || !data) return null
  return data
}

export async function getUserId(): Promise<string | null> {
  const supabaseUser = await getSupabaseUser()
  return supabaseUser?.id || null
}

export async function requireAuth() {
  const user = await getSupabaseUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}
