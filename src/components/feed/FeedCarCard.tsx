'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { FeedCar } from '@/types/api'
import { resolvePublicPhoto } from '@/lib/public-photo'

function CarPhoto({ photoUrl, alt, className }: { photoUrl: string | null; alt: string; className?: string }) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!photoUrl) return
    resolvePublicPhoto(photoUrl).then(setSrc)
  }, [photoUrl])

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-surface-dim text-on-surface-variant ${className ?? ''}`}>
        <span className="material-symbols-outlined text-4xl opacity-30">directions_car</span>
      </div>
    )
  }

  return <img src={src} alt={alt} className={`object-cover ${className ?? ''}`} />
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  const d = Math.floor(diff / 86_400_000)
  if (h < 1) return 'hace un momento'
  if (h < 24) return `hace ${h} hora${h > 1 ? 's' : ''}`
  return `hace ${d} día${d > 1 ? 's' : ''}`
}

interface FeedCarCardProps {
  car: FeedCar
  variant?: 'grid' | 'list'
}

export function FeedCarCard({ car, variant = 'grid' }: FeedCarCardProps) {
  if (variant === 'list') {
    return (
      <article className="bg-surface-container border border-outline-variant rounded p-2 flex gap-4 items-center shadow-[2px_2px_0_0_rgba(107,112,92,0.15)] hover:bg-surface-container-high transition-colors">
        <Link
          href={`/cars/${car.carId}`}
          className="w-[100px] h-20 md:w-40 md:h-[100px] flex-shrink-0 rounded-sm border border-outline-variant overflow-hidden shadow-[inset_0_2px_4px_rgba(107,112,92,0.1)]"
        >
          <CarPhoto photoUrl={car.photoUrl} alt={`${car.brand} ${car.model}`} className="w-full h-full" />
        </Link>
        <div className="flex-grow flex flex-col justify-between py-1 min-w-0">
          <div>
            <Link href={`/cars/${car.carId}`} className="block hover:underline">
              <h4 className="font-title-sm text-[16px] md:text-title-sm text-on-surface leading-tight mb-1 truncate">
                {car.brand} {car.model}
              </h4>
            </Link>
            <p className="font-body-sm text-[12px] md:text-body-sm text-on-surface-variant">
              {car.createdAt ? `Añadido ${relativeTime(car.createdAt)} por ` : 'Por '}
              <Link href={`/users/${car.userId}`} className="hover:text-primary hover:underline">
                @{car.userId.slice(0, 12)}
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">favorite</span>
              <span className="font-label-caps text-[10px]">{car.likeCount}</span>
            </span>
            <span className="font-label-caps text-[10px] bg-surface text-on-surface-variant px-1.5 py-0.5 rounded-sm border border-outline-variant/50 uppercase">
              {car.year}
            </span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col flex-shrink-0 shadow-[2px_2px_0_0_rgba(107,112,92,0.15)] w-[280px] md:w-auto">
      <div className="p-2 pb-0">
        <div className="aspect-[4/3] bg-surface-variant rounded-sm overflow-hidden border border-outline/30 relative">
          <Link href={`/cars/${car.carId}`} className="absolute inset-0 block">
            <CarPhoto
              photoUrl={car.photoUrl}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full transition-transform duration-500 hover:scale-105"
            />
          </Link>
          <div className="absolute top-2 right-2 bg-surface/95 border border-outline px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-sm pointer-events-none">
            <span
              className="material-symbols-outlined text-[14px] text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <span className="font-label-caps text-label-caps text-on-surface">{car.likeCount}</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <Link href={`/cars/${car.carId}`} className="block hover:underline">
            <h4 className="font-title-sm text-title-sm text-on-surface mb-1">
              {car.brand} {car.model}
            </h4>
          </Link>
          <Link
            href={`/users/${car.userId}`}
            className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 hover:text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[14px]">person</span>
            @{car.userId.slice(0, 12)}
          </Link>
        </div>
        <div className="flex gap-2 mt-4 pt-3 border-t border-outline-variant/50">
          <span className="font-label-caps text-[10px] bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded-sm border border-tertiary tracking-widest uppercase">
            {car.year}
          </span>
        </div>
      </div>
    </article>
  )
}
