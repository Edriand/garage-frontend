'use client'

import { useEffect, useState } from 'react'
import { resolvePublicPhoto } from '@/lib/public-photo'

interface GarageAvatarProps {
  photoKey: string | null | undefined
  size?: number
  className?: string
}

export function GarageAvatar({ photoKey, size = 64, className = '' }: GarageAvatarProps) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!photoKey) { setSrc(null); return }
    resolvePublicPhoto(photoKey).then(setSrc)
  }, [photoKey])

  if (!src) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-full bg-surface-dim border-2 border-outline-variant flex items-center justify-center flex-shrink-0 ${className}`}
      >
        <span className="material-symbols-outlined text-on-surface-variant opacity-40" style={{ fontSize: size * 0.5 }}>
          person
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt="Avatar"
      style={{ width: size, height: size }}
      className={`rounded-full object-cover border-2 border-outline-variant flex-shrink-0 ${className}`}
    />
  )
}
