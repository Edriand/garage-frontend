import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { FeedCarCard } from '@/components/feed/FeedCarCard'
import { getUserGarage } from '@/lib/api'
import type { FeedCar } from '@/types/api'

export default async function UserGaragePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  let garage: Awaited<ReturnType<typeof getUserGarage>>
  try {
    garage = await getUserGarage(userId)
  } catch {
    notFound()
  }

  // Map backend cars (no userId field) to FeedCar shape
  const cars: FeedCar[] = garage.cars.map(car => ({ ...car, userId }))

  return (
    <>
      <Header />
      <main className="max-w-[1200px] mx-auto px-5 py-10 pb-24 md:pb-10">

        {/* ── Garage header ─────────────────────────────────────────── */}
        <div className="mb-8 pb-4 border-b-2 border-outline-variant flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-caps text-label-caps bg-secondary-container text-on-secondary-container border border-secondary/20 px-2 py-0.5 rounded-sm">
                GARAJE PÚBLICO
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface">
              @{userId.slice(0, 8)}
            </h1>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">directions_car</span>
            {cars.length} vehículo{cars.length !== 1 ? 's' : ''} público{cars.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Car grid ──────────────────────────────────────────────── */}
        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {cars.map(car => (
              <FeedCarCard key={car.carId} car={car} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] opacity-30">garage</span>
            <p className="font-body-md text-body-md">Este usuario no tiene vehículos públicos todavía.</p>
          </div>
        )}

      </main>
      <BottomNav />
    </>
  )
}
