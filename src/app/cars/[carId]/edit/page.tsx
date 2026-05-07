'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { getCar, updateCar, deleteCar, getPresignedUploadUrl } from '@/lib/api'
import type { Car } from '@/types/api'

const CURRENT_YEAR = new Date().getFullYear()

export default function EditCarPage() {
  const { carId } = useParams<{ carId: string }>()
  const router = useRouter()

  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [registrationYear, setRegistrationYear] = useState('')
  const [totalKm, setTotalKm] = useState('')
  const [totalInvested, setTotalInvested] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  // Revoke blob URL on change and on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  useEffect(() => {
    getCar(carId)
      .then(data => {
        setCar(data)
        setBrand(data.brand)
        setModel(data.model)
        setYear(String(data.year))
        setRegistrationYear(String(data.registrationYear))
        setTotalKm(String(data.totalKm))
        setTotalInvested(String(data.totalInvested))
        setIsPublic(data.isPublic)
      })
      .catch(() => setServerError('No se pudo cargar el vehículo'))
      .finally(() => setLoading(false))
  }, [carId])

  function validate() {
    const e: Record<string, string> = {}
    if (!brand.trim()) e.brand = 'La marca es obligatoria'
    if (!model.trim()) e.model = 'El modelo es obligatorio'
    const y = parseInt(year)
    if (!year || isNaN(y) || y < 1886 || y > CURRENT_YEAR) e.year = `El año debe estar entre 1886 y ${CURRENT_YEAR}`
    const ry = parseInt(registrationYear)
    if (!registrationYear || isNaN(ry) || ry < 1886 || ry > CURRENT_YEAR) e.registrationYear = `El año de matrícula debe estar entre 1886 y ${CURRENT_YEAR}`
    const km = parseFloat(totalKm)
    if (totalKm === '' || isNaN(km) || km < 0) e.totalKm = 'Los kilómetros deben ser ≥ 0'
    const inv = parseFloat(totalInvested)
    if (totalInvested === '' || isNaN(inv) || inv < 0) e.totalInvested = 'La inversión debe ser ≥ 0'
    return e
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setPhotoFile(file)
    setPhotoPreview(file ? URL.createObjectURL(file) : null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    setServerError(null)

    try {
      let photoKey: string | undefined

      if (photoFile) {
        const { uploadUrl, fileKey } = await getPresignedUploadUrl({
          carId,
          filename: photoFile.name,
          contentType: photoFile.type,
          category: 'photo',
        })
        await fetch(uploadUrl, { method: 'PUT', body: photoFile, headers: { 'Content-Type': photoFile.type } })
        photoKey = fileKey
      }

      await updateCar(carId, {
        brand: brand.trim(),
        model: model.trim(),
        year: parseInt(year),
        registrationYear: parseInt(registrationYear),
        totalKm: parseFloat(totalKm),
        totalInvested: parseFloat(totalInvested),
        isPublic,
        ...(photoKey ? { photoKey } : {}),
      })

      router.push(`/cars/${carId}`)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error al actualizar el vehículo')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteCar(carId)
      router.push('/garage')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error al eliminar el vehículo')
      setDeleting(false)
      setShowDeleteConfirm(false)
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

  if (!car) {
    return (
      <>
        <Header />
        <main className="max-w-[600px] mx-auto px-5 py-10 text-center">
          <p className="font-body-md text-body-md text-error">{serverError ?? 'Vehículo no encontrado'}</p>
          <button onClick={() => router.push('/garage')} className="mt-4 text-primary font-label-caps text-label-caps underline">
            Volver al garaje
          </button>
        </main>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="max-w-[600px] mx-auto px-5 py-10 pb-24 md:pb-10">
        <div className="border-b-2 border-dashed border-outline-variant pb-4 mb-8">
          <h1 className="font-headline-md text-headline-md text-on-surface">Editar Vehículo</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {car.brand} {car.model} · {car.year}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Marca" value={brand} onChange={e => setBrand(e.target.value)} error={errors.brand} />
            <Input label="Modelo" value={model} onChange={e => setModel(e.target.value)} error={errors.model} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Año de fabricación" type="number" value={year} onChange={e => setYear(e.target.value)} error={errors.year} min={1886} max={CURRENT_YEAR} />
            <Input label="Año de matrícula" type="number" value={registrationYear} onChange={e => setRegistrationYear(e.target.value)} error={errors.registrationYear} min={1886} max={CURRENT_YEAR} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Kilómetros actuales" type="number" value={totalKm} onChange={e => setTotalKm(e.target.value)} error={errors.totalKm} min={0} />
            <Input label="Inversión total (€)" type="number" value={totalInvested} onChange={e => setTotalInvested(e.target.value)} error={errors.totalInvested} min={0} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface-variant">FOTO (opcional)</label>
            {photoPreview ? (
              <div className="relative h-48 rounded border border-outline-variant overflow-hidden mb-2">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(null) }} className="absolute top-2 right-2 bg-inverse-surface text-inverse-on-surface rounded p-1 text-[12px] font-label-caps text-label-caps">QUITAR</button>
              </div>
            ) : car.photoUrl ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">Ya tiene foto. Selecciona una nueva para reemplazarla.</p>
            ) : null}
            <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low border border-dashed border-outline-variant rounded px-4 py-3 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">add_photo_alternate</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{photoFile ? photoFile.name : 'Seleccionar imagen...'}</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="sr-only" />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">VISIBILIDAD</span>
            <div className="bg-surface-dim border border-outline-variant rounded-full p-1 inline-flex items-center shadow-[inset_0_2px_4px_rgba(107,112,92,0.1)] w-max">
              <button type="button" onClick={() => setIsPublic(true)} className={['font-label-caps text-label-caps px-4 py-2 rounded-full transition-all border', isPublic ? 'bg-primary-container text-on-primary-container shadow-sm border-outline-variant/50' : 'text-on-surface-variant border-transparent'].join(' ')}>PÚBLICO</button>
              <button type="button" onClick={() => setIsPublic(false)} className={['font-label-caps text-label-caps px-4 py-2 rounded-full transition-all border', !isPublic ? 'bg-primary-container text-on-primary-container shadow-sm border-outline-variant/50' : 'text-on-surface-variant border-transparent'].join(' ')}>PRIVADO</button>
            </div>
          </div>

          {serverError && <p className="font-body-sm text-body-sm text-error">{serverError}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => router.back()} disabled={submitting || deleting}>CANCELAR</Button>
            <Button type="submit" disabled={submitting || deleting} className="flex-1">
              {submitting ? <Spinner /> : 'GUARDAR CAMBIOS'}
            </Button>
          </div>
        </form>

        <div className="mt-10 pt-6 border-t-2 border-dashed border-error/30">
          <h3 className="font-label-caps text-label-caps text-error mb-2">ZONA DE PELIGRO</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Eliminar el vehículo borrará todos sus datos e historial de forma permanente.</p>
          {showDeleteConfirm ? (
            <div className="bg-error-container border border-error/30 rounded p-4 space-y-3">
              <p className="font-body-sm text-body-sm text-on-error-container font-bold">¿Confirmas que quieres eliminar este vehículo?</p>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>CANCELAR</Button>
                <button type="button" onClick={handleDelete} disabled={deleting} className="flex-1 inline-flex items-center justify-center gap-2 font-label-caps text-label-caps px-4 py-2 rounded bg-error text-on-error border border-b-4 border-error/80 shadow-sm active:border-b active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {deleting ? <Spinner /> : 'SÍ, ELIMINAR'}
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center gap-2 font-label-caps text-label-caps px-4 py-2 rounded text-error border border-error/40 border-b-4 bg-gradient-to-b from-surface to-error-container/20 shadow-sm hover:from-error-container/20 hover:to-error-container/40 active:border-b active:translate-y-px transition-all">
              <span className="material-symbols-outlined text-[18px]">delete</span>
              ELIMINAR VEHÍCULO
            </button>
          )}
        </div>
      </main>

      <BottomNav />
    </>
  )
}
