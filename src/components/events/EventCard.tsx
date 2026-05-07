'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { deleteEvent, getPresignedDownloadUrl } from '@/lib/api'
import type { CarEvent } from '@/types/api'

interface EventCardProps {
  carId: string
  event: CarEvent
  onDeleted: (eventId: string) => void
}

function PhotoThumb({ fileKey }: { fileKey: string }) {
  const [src, setSrc] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getPresignedDownloadUrl(fileKey)
      .then(r => setSrc(r.downloadUrl))
      .catch(() => setSrc(null))
  }, [fileKey])

  if (!src) return <div className="w-16 h-16 bg-surface-dim rounded animate-pulse" />

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-16 h-16 rounded overflow-hidden border border-outline-variant flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <img src={src} alt="" className="w-full h-full object-cover" />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/90 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt=""
            className="max-w-full max-h-full rounded object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-inverse-on-surface hover:opacity-70"
          >
            <span className="material-symbols-outlined text-[32px]">close</span>
          </button>
        </div>
      )}
    </>
  )
}

function DocLink({ fileKey }: { fileKey: string }) {
  const [url, setUrl] = useState<string | null>(null)
  const filename = fileKey.split('/').pop() ?? 'documento'

  useEffect(() => {
    getPresignedDownloadUrl(fileKey)
      .then(r => setUrl(r.downloadUrl))
      .catch(() => setUrl(null))
  }, [fileKey])

  if (!url) return null

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-primary font-label-caps text-[10px] hover:underline"
    >
      <span className="material-symbols-outlined text-[14px]">description</span>
      {filename}
    </a>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
}

function formatEur(n: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)
}

export function EventCard({ carId, event, onDeleted }: EventCardProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteEvent(carId, event.eventId)
      onDeleted(event.eventId)
    } catch {
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className="relative bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-[0_2px_0_0_rgba(107,112,92,0.15)]">
      <div className="absolute top-0 left-0 w-full h-0 border-t-2 border-dashed border-outline-variant/50" />
      <div className="pt-[2px] p-4 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="font-label-caps text-[10px] text-on-surface-variant">{formatDate(event.date)}</span>
            <Badge eventType={event.type} />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-title-sm text-title-sm text-on-surface">{formatEur(event.amount)}</span>
            {event.km != null && (
              <span className="flex items-center gap-1 font-label-caps text-[10px] text-on-surface-variant">
                <span className="material-symbols-outlined text-[12px]">speed</span>
                {event.km.toLocaleString('es-ES')} km
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="font-body-md text-body-md text-on-surface">{event.description}</p>

        {/* Photos */}
        {event.photos.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {event.photos.map(key => <PhotoThumb key={key} fileKey={key} />)}
          </div>
        )}

        {/* Documents */}
        {event.documents.length > 0 && (
          <div className="flex flex-col gap-1">
            {event.documents.map(key => <DocLink key={key} fileKey={key} />)}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-outline-variant/50 pt-3 mt-1">
          <Link
            href={`/cars/${carId}/events/${event.eventId}/edit`}
            className="flex items-center gap-1 font-label-caps text-[11px] text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
            EDITAR
          </Link>
          <span className="text-outline-variant">·</span>
          {showConfirm ? (
            <div className="flex items-center gap-2">
              <span className="font-body-sm text-body-sm text-error text-[12px]">¿Eliminar?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="font-label-caps text-[11px] text-error hover:underline disabled:opacity-50"
              >
                {deleting ? <Spinner /> : 'SÍ'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="font-label-caps text-[11px] text-on-surface-variant hover:underline"
              >
                NO
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1 font-label-caps text-[11px] text-error hover:underline"
            >
              <span className="material-symbols-outlined text-[14px]">delete</span>
              ELIMINAR
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
