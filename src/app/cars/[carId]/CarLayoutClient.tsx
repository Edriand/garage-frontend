'use client'

import { useEffect, useState } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Spinner } from '@/components/ui/Spinner'
import { getCar, getPresignedDownloadUrl, likeCar, unlikeCar } from '@/lib/api'
import { CarResumenPanel } from './CarResumenPanel'
import { EventsPanel } from './EventsPanel'
import type { Car } from '@/types/api'

function CarPhoto({ photoUrl, alt }: { photoUrl: string | null; alt: string }) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!photoUrl) return
    getPresignedDownloadUrl(photoUrl)
      .then(r => setSrc(r.downloadUrl))
      .catch(() => setSrc(null))
  }, [photoUrl])

  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface-dim text-on-surface-variant">
        <span className="material-symbols-outlined text-[80px] opacity-20">directions_car</span>
      </div>
    )
  }

  return <img src={src} alt={alt} className="w-full h-full object-cover object-center" />
}

export default function CarLayoutClient({ children }: { children: React.ReactNode }) {
  const { carId } = useParams<{ carId: string }>()
  const pathname = usePathname()
  const router = useRouter()

  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [likeCount, setLikeCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)

  const isResumen = pathname === `/cars/${carId}`
  const isHistorial = pathname === `/cars/${carId}/events` || pathname.startsWith(`/cars/${carId}/events/`)

  useEffect(() => {
    getCar(carId)
      .then(data => {
        setCar(data)
        setLikeCount(data.likeCount)
        setLiked(data.isLiked)
      })
      .catch(() => router.push('/garage'))
      .finally(() => setLoading(false))
  }, [carId, router])

  async function handleLike() {
    if (!car || liking) return
    setLiking(true)
    try {
      const result = await likeCar(carId)
      setLikeCount(result.likeCount)
      setLiked(true)
    } catch {
      // ignore
    } finally {
      setLiking(false)
    }
  }

  async function handleUnlike() {
    if (!car || liking) return
    setLiking(true)
    try {
      const result = await unlikeCar(carId)
      setLikeCount(result.likeCount)
      setLiked(false)
    } catch {
      // ignore
    } finally {
      setLiking(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex justify-center items-center min-h-[60vh]"><Spinner /></main>
        <BottomNav />
      </>
    )
  }

  if (!car) return null

  const chassiLabel = `#${carId.slice(-8).toUpperCase()}`

  return (
    <>
      <Header />

      <main className="max-w-[1200px] mx-auto pb-24 md:pb-10">

        {/* Mobile: compact hero with photo */}
        <section className="md:hidden relative border-b-2 border-outline-variant overflow-hidden">
          <div className="h-48 w-full bg-surface-variant relative">
            <CarPhoto photoUrl={car.photoUrl} alt={`${car.brand} ${car.model}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25190f]/80 via-[#25190f]/20 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 w-full px-5 pb-3 flex justify-between items-end gap-3">
            <div>
              <span className="font-label-caps text-[10px] text-surface-container-high tracking-widest block mb-0.5">
                CHASIS {chassiLabel}
              </span>
              <h1
                className="font-display-lg text-display-lg text-surface-container-lowest leading-tight"
                style={{ textShadow: '0 2px 4px rgba(37,25,15,0.8)', fontSize: 'clamp(22px,5vw,36px)' }}
              >
                {car.brand} &apos;{String(car.year).slice(2)}
              </h1>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={liked ? handleUnlike : handleLike}
                disabled={liking}
                className="flex items-center gap-1.5 bg-inverse-surface/80 text-inverse-on-surface font-label-caps text-[11px] px-3 py-1.5 rounded border border-white/10 backdrop-blur-sm hover:bg-inverse-surface transition-colors disabled:opacity-50"
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{
                    fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0",
                    color: liked ? 'var(--color-secondary-container)' : 'currentColor',
                  }}
                >
                  favorite
                </span>
                {likeCount}
              </button>
              <Link
                href={`/cars/${carId}/edit`}
                className="flex items-center gap-1 bg-primary-container text-on-primary-container font-label-caps text-[10px] px-3 py-1.5 rounded border-2 border-primary-fixed shadow-[0_2px_0_0_rgba(37,25,15,0.4)]"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                EDITAR
              </Link>
            </div>
          </div>
        </section>

        {/* Desktop: compact title bar */}
        <div className="hidden md:flex items-center justify-between px-6 py-3 border-b-2 border-outline-variant bg-surface-container-low">
          <div>
            <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest block mb-0.5">
              CHASIS {chassiLabel}
            </span>
            <h1 className="font-headline-md text-headline-md text-on-surface leading-tight">
              {car.brand} {car.model} &apos;{String(car.year).slice(2)}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={liked ? handleUnlike : handleLike}
              disabled={liking}
              className="flex items-center gap-1.5 bg-surface text-on-surface font-label-caps text-[11px] px-3 py-2 rounded border border-outline-variant hover:bg-surface-variant transition-colors disabled:opacity-50"
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{
                  fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0",
                  color: liked ? 'var(--color-error)' : 'currentColor',
                }}
              >
                favorite
              </span>
              {likeCount}
            </button>
            <Link
              href={`/cars/${carId}/edit`}
              className="flex items-center gap-1.5 bg-primary-container text-on-primary-container font-label-caps text-[11px] px-4 py-2 rounded border-2 border-primary-fixed shadow-[0_2px_0_0_rgba(37,25,15,0.4)]"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              EDITAR
            </Link>
          </div>
        </div>

        {/* Tab switcher — mobile only */}
        <div className="md:hidden flex justify-center w-full px-5 py-4 border-b border-outline-variant bg-surface-container-low">
          <div className="inline-flex gap-1 p-1 bg-surface-variant rounded-lg border border-outline-variant shadow-[inset_0_2px_4px_rgba(107,112,92,0.1)]">
            <Link
              href={`/cars/${carId}`}
              className={[
                'px-6 py-2 rounded font-label-caps text-label-caps flex items-center gap-2 transition-all',
                isResumen
                  ? 'bg-surface text-on-surface shadow-[0_1px_0_0_rgba(107,112,92,0.3)] border border-outline-variant'
                  : 'text-on-surface-variant hover:bg-surface-container-high',
              ].join(' ')}
            >
              <span className={`w-2 h-2 rounded-full block shadow-inner ${isResumen ? 'bg-primary' : 'bg-outline-variant'}`} />
              RESUMEN
            </Link>
            <Link
              href={`/cars/${carId}/events`}
              className={[
                'px-6 py-2 rounded font-label-caps text-label-caps flex items-center gap-2 transition-all',
                isHistorial
                  ? 'bg-surface text-on-surface shadow-[0_1px_0_0_rgba(107,112,92,0.3)] border border-outline-variant'
                  : 'text-on-surface-variant hover:bg-surface-container-high',
              ].join(' ')}
            >
              <span className={`w-2 h-2 rounded-full block shadow-inner ${isHistorial ? 'bg-primary' : 'bg-outline-variant'}`} />
              HISTORIAL
            </Link>
          </div>
        </div>

        {/* Mobile: route children */}
        <div className="md:hidden">
          {children}
        </div>

        {/* Desktop: two-column split */}
        <div className="hidden md:flex">
          <div className="w-1/3 border-r border-outline-variant overflow-y-auto max-h-[calc(100vh-130px)] min-h-[500px]">
            {/* Photo at the top of the resumen column */}
            <div className="h-56 relative overflow-hidden border-b border-outline-variant shrink-0">
              <CarPhoto photoUrl={car.photoUrl} alt={`${car.brand} ${car.model}`} />
            </div>
            <CarResumenPanel carId={carId} />
          </div>
          <div className="w-2/3 overflow-y-auto max-h-[calc(100vh-130px)] min-h-[500px]">
            <EventsPanel carId={carId} />
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  )
}
