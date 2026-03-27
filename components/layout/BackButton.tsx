'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function BackButton() {
  const router = useRouter()
  
  return (
    <Button
      onClick={() => router.push('/')}
      variant="secondary"
      className="bg-giohub-card-secondary hover:bg-giohub-gray"
    >
      ⬅ Volver al menú
    </Button>
  )
}
