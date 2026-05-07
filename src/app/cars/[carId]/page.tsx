'use client'

import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Button } from '@/components/ui/Button'

export default function CarDetailPage() {
  const { carId } = useParams<{ carId: string }>()
  const router = useRouter()

  return (
    <>
      <Header />

      <main className="max-w-[600px] mx-auto px-5 py-10 pb-24 md:pb-10 flex flex-col items-center text-center gap-6">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant">construction</span>

        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Página en desarrollo</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            El detalle del vehículo estará disponible próximamente.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.push('/garage')}>
            IR AL GARAJE
          </Button>
          <Button onClick={() => router.push(`/cars/${carId}/edit`)}>
            EDITAR VEHÍCULO
          </Button>
        </div>
      </main>

      <BottomNav />
    </>
  )
}
