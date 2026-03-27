import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const publicRoutes = ['/', '/api/webhooks/clerk']

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  if (!publicRoutes.includes(req.nextUrl.pathname) && !userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
