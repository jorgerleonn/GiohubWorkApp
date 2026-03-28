'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function BackButton() {
  const router = useRouter()
  
  return (
    <Button
      onClick={() => router.push('/')}
      variant="secondary"
      className="bg-deepworkos-card-secondary hover:bg-deepworkos-gray"
    >
      ⬅ Volver al menú
    </Button>
  )
}
