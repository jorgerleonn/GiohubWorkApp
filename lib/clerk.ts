import { currentUser } from '@clerk/nextjs/server'

export async function getClerkUser() {
  return await currentUser()
}

export async function getUserId(): Promise<string | null> {
  const clerkUser = await currentUser()
  if (!clerkUser) return null
  return clerkUser.id
}

export async function requireAuth() {
  const userId = await getUserId()
  if (!userId) {
    throw new Error('Unauthorized')
  }
  return userId
}
