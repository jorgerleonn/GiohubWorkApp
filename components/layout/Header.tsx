'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export function Header() {
  const { isSignedIn, user } = useUser()

  if (!isSignedIn) return null

  return (
    <header className="flex items-center justify-between p-4 bg-deepworkos-card border-b border-deepworkos-gray/20">
      <Link href="/" className="text-2xl font-bold text-white">
        DeepWorkOS
      </Link>
      
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm">
          {user.firstName || user.emailAddresses[0]?.emailAddress}
        </span>
        <UserButton />
      </div>
    </header>
  )
}
