'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { getEvent, updateEvent, deleteEvent } from '@/lib/api'
import { uploadFiles } from '@/lib/upload'
import type { CarEvent, EventType } from '@/types/api'

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

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'mechanic', label: 'Taller / Mecánica' },
  { value: 'fuel', label: 'Repostaje' },
  { value: 'wash', label: 'Lavado' },
  { value: 'insurance', label: 'Seguro' },
  { value: 'other', label: 'Otro' },
]

export default function EditEventPage() {
  const { carId, eventId } = useParams<{ carId: string; eventId: string }>()
  const router = useRouter()

  const [event, setEvent] = useState<CarEvent | null>(null)
  const [loading, setLoading] = useState(true)

  const [date, setDate] = useState('')
  const [type, setType] = useState<EventType>('mechanic')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [km, setKm] = useState('')
  const [newPhotoFiles, setNewPhotoFiles] = useState<File[]>([])
  const [newDocFiles, setNewDocFiles] = useState<File[]>([])
  const [keptPhotos, setKeptPhotos] = useState<string[]>([])
  const [keptDocs, setKeptDocs] = useState<string[]>([])

  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    getEvent(carId, eventId)
      .then(data => {
        setEvent(data)
        setDate(data.date.slice(0, 10))
        setType(data.type)
        setDescription(data.description)
        setAmount(String(data.amount))
        setKm(data.km != null ? String(data.km) : '')
        setKeptPhotos(data.photos)
        setKeptDocs(data.documents)
      })
      .catch(() => setServerError('No se pudo cargar el registro'))
      .finally(() => setLoading(false))
  }, [carId, eventId])

  function validate() {
    const e: Record<string, string> = {}
    if (!date) e.date = 'La fecha es obligatoria'
    if (!description.trim()) e.description = 'La descripción es obligatoria'
    const a = parseFloat(amount)
    if (amount === '' || isNaN(a) || a < 0) e.amount = 'El importe debe ser ≥ 0'
    if (km !== '') {
      const k = parseFloat(km)
      if (isNaN(k) || k < 0) e.km = 'Los kilómetros deben ser ≥ 0'
    }
    return e
  }

  function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    setNewPhotoFiles(prev => [...prev, ...Array.from(e.target.files ?? [])])
    e.target.value = ''
  }

  function addDocs(e: React.ChangeEvent<HTMLInputElement>) {
    setNewDocFiles(prev => [...prev, ...Array.from(e.target.files ?? [])])
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
      const [newPhotoKeys, newDocKeys] = await Promise.all([
        uploadFiles(newPhotoFiles, carId, 'photo'),
        uploadFiles(newDocFiles, carId, 'document'),
      ])

      await updateEvent(carId, eventId, {
        date,
        type,
        description: description.trim(),
        amount: parseFloat(amount),
        ...(km !== '' ? { km: parseFloat(km) } : { km: undefined }),
        photoKeys: [...keptPhotos, ...newPhotoKeys],
        docKeys: [...keptDocs, ...newDocKeys],
      })

      router.push(`/cars/${carId}/events`)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error al guardar el registro')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteEvent(carId, eventId)
      router.push(`/cars/${carId}/events`)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error al eliminar')
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>
  }

  if (!event) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="font-body-sm text-body-sm text-error">{serverError ?? 'Registro no encontrado'}</p>
        <button onClick={() => router.back()} className="mt-4 text-primary font-label-caps text-label-caps underline">
          Volver
        </button>
      </div>
    )
  }

  return (
    <div className="px-5 py-8 max-w-[600px] mx-auto">
      <div className="border-b-2 border-dashed border-outline-variant pb-4 mb-6">
        <h2 className="font-headline-md text-headline-md text-on-surface">Editar Registro</h2>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Fecha" type="date" value={date} onChange={e => setDate(e.target.value)} error={errors.date} />
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface-variant">TIPO</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as EventType)}
              className="w-full rounded border border-outline-variant bg-surface-container-low px-3 py-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Importe (€) *" type="number" min={0} step="0.01" value={amount} onChange={e => setAmount(e.target.value)} error={errors.amount} />
          <Input label="Kilómetros (opcional)" type="number" min={0} value={km} onChange={e => setKm(e.target.value)} error={errors.km} />
        </div>

        {/* Existing photos */}
        {keptPhotos.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">FOTOS ACTUALES</span>
            <div className="flex flex-wrap gap-2">
              {keptPhotos.map(key => (
                <div key={key} className="relative w-16 h-16 rounded overflow-hidden border border-outline-variant bg-surface-dim flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px] text-on-surface-variant opacity-40">image</span>
                  <button
                    type="button"
                    onClick={() => setKeptPhotos(prev => prev.filter(k => k !== key))}
                    className="absolute top-0 right-0 bg-inverse-surface/80 text-inverse-on-surface rounded-bl px-1 text-[10px]"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New photos */}
        <div className="flex flex-col gap-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant">AÑADIR FOTOS</span>
          {newPhotoFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {newPhotoFiles.map((f, i) => (
                <PhotoPreview key={i} file={f} onRemove={() => setNewPhotoFiles(prev => prev.filter((_, j) => j !== i))} />
              ))}
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low border border-dashed border-outline-variant rounded px-4 py-3 hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">add_photo_alternate</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Añadir fotos...</span>
            <input type="file" accept="image/*" multiple onChange={addPhotos} className="sr-only" />
          </label>
        </div>

        {/* Existing docs */}
        {keptDocs.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">DOCUMENTOS ACTUALES</span>
            {keptDocs.map(key => (
              <div key={key} className="flex items-center justify-between bg-surface-container-low border border-outline-variant rounded px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">description</span>
                  <span className="font-body-sm text-body-sm text-on-surface truncate max-w-[200px]">{key.split('/').pop()}</span>
                </div>
                <button type="button" onClick={() => setKeptDocs(prev => prev.filter(k => k !== key))} className="text-error font-label-caps text-[10px]">QUITAR</button>
              </div>
            ))}
          </div>
        )}

        {/* New docs */}
        <div className="flex flex-col gap-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant">AÑADIR DOCUMENTOS</span>
          {newDocFiles.length > 0 && (
            <div className="flex flex-col gap-1">
              {newDocFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-surface-container-low border border-outline-variant rounded px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">description</span>
                    <span className="font-body-sm text-body-sm text-on-surface truncate max-w-[200px]">{f.name}</span>
                  </div>
                  <button type="button" onClick={() => setNewDocFiles(prev => prev.filter((_, j) => j !== i))} className="text-error font-label-caps text-[10px]">QUITAR</button>
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
          <Button type="button" variant="secondary" onClick={() => router.back()} disabled={submitting || deleting}>CANCELAR</Button>
          <Button type="submit" disabled={submitting || deleting} className="flex-1">
            {submitting ? <Spinner /> : 'GUARDAR CAMBIOS'}
          </Button>
        </div>
      </form>

      {/* Delete zone */}
      <div className="mt-10 pt-6 border-t-2 border-dashed border-error/30">
        <h3 className="font-label-caps text-label-caps text-error mb-2">ZONA DE PELIGRO</h3>
        {showDeleteConfirm ? (
          <div className="bg-error-container border border-error/30 rounded p-4 space-y-3">
            <p className="font-body-sm text-body-sm text-on-error-container font-bold">¿Confirmas que quieres eliminar este registro?</p>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>CANCELAR</Button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 font-label-caps text-label-caps px-4 py-2 rounded bg-error text-on-error border border-b-4 border-error/80 shadow-sm active:border-b active:translate-y-px transition-all disabled:opacity-50"
              >
                {deleting ? <Spinner /> : 'SÍ, ELIMINAR'}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 font-label-caps text-label-caps px-4 py-2 rounded text-error border border-error/40 border-b-4 bg-gradient-to-b from-surface to-error-container/20 shadow-sm active:border-b active:translate-y-px transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            ELIMINAR REGISTRO
          </button>
        )}
      </div>
    </div>
  )
}
