'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { createEvent } from '@/lib/api'
import { uploadFiles } from '@/lib/upload'
import type { EventType } from '@/types/api'

function PhotoPreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [src, setSrc] = useState<string | null>(null)
  useEffect(() => {
    const url = URL.createObjectURL(file)
    setSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [file])
  if (!src) return null
  return (
    <div className="relative w-16 h-16 rounded overflow-hidden border border-outline-variant flex-shrink-0">
      <img src={src} alt="" className="w-full h-full object-cover" />
      <button type="button" onClick={onRemove} className="absolute top-0 right-0 bg-inverse-surface/80 text-inverse-on-surface rounded-bl px-1 text-[10px]">✕</button>
    </div>
  )
}

const EVENT_TYPES: { value: EventType; label: string; icon: string }[] = [
  { value: 'purchase', label: 'Compra del vehículo', icon: 'shopping_cart' },
  { value: 'mechanic', label: 'Taller / Mecánica', icon: 'build' },
  { value: 'modification', label: 'Modificación / Mejora', icon: 'tune' },
  { value: 'fuel', label: 'Repostaje', icon: 'local_gas_station' },
  { value: 'wash', label: 'Lavado', icon: 'water_drop' },
  { value: 'insurance', label: 'Seguro', icon: 'shield' },
  { value: 'other', label: 'Otro', icon: 'more_horiz' },
]

export default function NewEventPage() {
  const { carId } = useParams<{ carId: string }>()
  const router = useRouter()

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [type, setType] = useState<EventType>('mechanic')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [km, setKm] = useState('')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [docFiles, setDocFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  function validate() {
    const e: Record<string, string> = {}
    if (!date) e.date = 'La fecha es obligatoria'
    if (!description.trim()) e.description = 'La descripción es obligatoria'
    const a = parseFloat(amount)
    if (amount === '' || isNaN(a) || a < 0) e.amount = 'El importe debe ser ≥ 0'
    if (km === '') {
      e.km = 'Los kilómetros son obligatorios'
    } else {
      const k = Number(km)
      if (!Number.isInteger(k) || k < 0) e.km = 'Los kilómetros deben ser un entero ≥ 0'
    }
    return e
  }

  function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setPhotoFiles(prev => [...prev, ...files])
    e.target.value = ''
  }

  function addDocs(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setDocFiles(prev => [...prev, ...files])
    e.target.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    setServerError(null)

    try {
      const [photoKeys, docKeys] = await Promise.all([
        uploadFiles(photoFiles, carId, 'photo'),
        uploadFiles(docFiles, carId, 'document'),
      ])

      await createEvent(carId, {
        date,
        type,
        description: description.trim(),
        amount: parseFloat(amount),
        km: parseInt(km, 10),
        ...(photoKeys.length > 0 ? { photoKeys } : {}),
        ...(docKeys.length > 0 ? { docKeys } : {}),
      })

      router.push(`/cars/${carId}/events`)
    } catch (err) {
      const apiErr = err as Error & { status?: number }
      if (apiErr.status === 409) {
        setServerError('Este coche ya tiene un evento de compra. Solo se permite uno por vehículo.')
      } else if (apiErr.status === 400 && apiErr.message?.includes('km must be greater')) {
        setErrors(prev => ({ ...prev, km: `El km debe ser mayor que el máximo registrado en este coche` }))
      } else {
        setServerError(apiErr.message ?? 'Error al crear el registro')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="px-5 py-8 max-w-[600px] mx-auto">
      <div className="border-b-2 border-dashed border-outline-variant pb-4 mb-6">
        <h2 className="font-headline-md text-headline-md text-on-surface">Nuevo Registro</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Añade un evento al historial de mantenimiento.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Date + Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Fecha"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            error={errors.date}
          />
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface-variant">TIPO</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as EventType)}
              className="w-full rounded border border-outline-variant bg-surface-container-low px-3 py-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {EVENT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="font-label-caps text-label-caps text-on-surface-variant">DESCRIPCIÓN *</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded border border-outline-variant bg-surface-container-low px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          {errors.description && <span className="font-body-sm text-body-sm text-error">{errors.description}</span>}
        </div>

        {/* Amount + KM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Importe (€) *"
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            error={errors.amount}
          />
          <Input
            label="Kilómetros *"
            type="number"
            min={0}
            step={1}
            value={km}
            onChange={e => setKm(e.target.value)}
            error={errors.km}
          />
        </div>

        {/* Photos */}
        <div className="flex flex-col gap-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant">FOTOS (opcional)</span>
          {photoFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {photoFiles.map((f, i) => (
                <PhotoPreview key={i} file={f} onRemove={() => setPhotoFiles(prev => prev.filter((_, j) => j !== i))} />
              ))}
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low border border-dashed border-outline-variant rounded px-4 py-3 hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">add_photo_alternate</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Añadir fotos...</span>
            <input type="file" accept="image/*" multiple onChange={addPhotos} className="sr-only" />
          </label>
        </div>

        {/* Documents */}
        <div className="flex flex-col gap-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant">DOCUMENTOS (opcional)</span>
          {docFiles.length > 0 && (
            <div className="flex flex-col gap-1">
              {docFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-surface-container-low border border-outline-variant rounded px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">description</span>
                    <span className="font-body-sm text-body-sm text-on-surface truncate max-w-[200px]">{f.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDocFiles(prev => prev.filter((_, j) => j !== i))}
                    className="text-error font-label-caps text-[10px]"
                  >
                    QUITAR
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low border border-dashed border-outline-variant rounded px-4 py-3 hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">attach_file</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Añadir documentos...</span>
            <input type="file" accept=".pdf,.doc,.docx,application/pdf" multiple onChange={addDocs} className="sr-only" />
          </label>
        </div>

        {serverError && <p className="font-body-sm text-body-sm text-error">{serverError}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => router.back()} disabled={submitting}>
            CANCELAR
          </Button>
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? <Spinner /> : 'GUARDAR REGISTRO'}
          </Button>
        </div>
      </form>
    </div>
  )
}
