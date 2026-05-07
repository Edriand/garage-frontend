'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Car } from '@/types/api'
import { getPresignedDownloadUrl } from '@/lib/api'

interface CarCardProps {
  car: Car
  onToggleVisibility?: (carId: string, isPublic: boolean) => void
}

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
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-surface-dim text-on-surface-variant">
        <span className="material-symbols-outlined text-[48px] opacity-30">directions_car</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
    />
  )
}

export function CarCard({ car, onToggleVisibility }: CarCardProps) {
  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-[0_2px_0_0_rgba(107,112,92,0.15)] relative group flex flex-col">
      {/* Dashed top accent */}
      <div className="absolute top-0 left-0 w-full h-0 border-t-2 border-dashed border-outline-variant/50 z-10" />

      {/* Photo */}
      <Link href={`/cars/${car.carId}`} className="relative h-48 bg-surface-dim border-b border-outline-variant block flex-shrink-0 overflow-hidden">
        <CarPhoto photoUrl={car.photoUrl} alt={`${car.brand} ${car.model}`} />

        {/* Visibility badge */}
        {onToggleVisibility && (
          <button
            aria-label="Toggle visibility"
            onClick={e => {
              e.preventDefault()
              onToggleVisibility(car.carId, !car.isPublic)
            }}
            className={[
              'absolute top-3 right-3 rounded p-1.5 shadow-sm',
              'active:translate-y-px transition-transform flex items-center justify-center',
              car.isPublic
                ? 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-bright'
                : 'bg-surface-dim border border-outline-variant text-on-surface-variant shadow-[inset_0_2px_4px_rgba(107,112,92,0.1)]',
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-[18px]">
              {car.isPublic ? 'visibility' : 'visibility_off'}
            </span>
          </button>
        )}
      </Link>

      {/* Content */}
      <Link href={`/cars/${car.carId}`} className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="min-w-0 flex-1">
            <h2 className="font-title-sm text-title-sm text-on-surface font-bold truncate">
              {car.year} {car.brand} {car.model}
            </h2>
          </div>
          {/* Like count */}
          <div className="flex items-center gap-1 text-secondary ml-2 flex-shrink-0">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            <span className="font-label-caps text-[11px]">{car.likeCount}</span>
          </div>
        </div>

        {/* Divider with rivet */}
        <div className="w-full h-px bg-outline-variant opacity-50 my-2 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-surface-container-lowest border border-outline-variant rotate-45" />
        </div>

        {/* Badges */}
        <div className="mt-auto flex flex-wrap gap-2">
          <span className="bg-surface-variant border border-outline-variant text-on-surface-variant font-label-caps text-[10px] px-2 py-1 rounded-sm uppercase tracking-wider font-mono">
            ID: #{car.carId.slice(-8).toUpperCase()}
          </span>
          <span className="bg-secondary-container/30 border border-secondary/20 text-on-secondary-container font-label-caps text-[10px] px-2 py-1 rounded-sm uppercase tracking-wider">
            AL DÍA
          </span>
          {!car.isPublic && (
            <span className="bg-surface border border-outline-variant text-on-surface-variant font-label-caps text-[10px] px-2 py-1 rounded-sm uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">lock</span>
              Privado
            </span>
          )}
        </div>
      </Link>
    </article>
  )
}
