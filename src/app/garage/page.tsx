'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { CarCard } from '@/components/cars/CarCard'
import { Spinner } from '@/components/ui/Spinner'
import { getCars, getGarage, updateGarage, updateCar } from '@/lib/api'
import type { Car, GarageSettings } from '@/types/api'

export default function GaragePage() {
  const [cars, setCars] = useState<Car[]>([])
  const [garage, setGarage] = useState<GarageSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [brandFilter, setBrandFilter] = useState('')
  const [togglingGarage, setTogglingGarage] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [carsData, garageData] = await Promise.all([getCars(), getGarage()])
        setCars(carsData)
        setGarage(garageData)
      } catch {
        setError('Error al cargar el garaje. Inténtalo de nuevo.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleToggleGarage(isPublic: boolean) {
    if (togglingGarage) return
    setTogglingGarage(true)
    try {
      const updated = await updateGarage({ isPublic })
      setGarage(updated)
    } catch {
      // revert on error — no-op, state unchanged
    } finally {
      setTogglingGarage(false)
    }
  }

  async function handleToggleCarVisibility(carId: string, isPublic: boolean) {
    try {
      const updated = await updateCar(carId, { isPublic })
      setCars(prev => prev.map(c => (c.carId === carId ? updated : c)))
    } catch {
      // silent fail
    }
  }

  const brands = useMemo(() => {
    const set = new Set(cars.map(c => c.brand))
    return Array.from(set).sort()
  }, [cars])

  const filteredCars = useMemo(
    () => (brandFilter ? cars.filter(c => c.brand === brandFilter) : cars),
    [cars, brandFilter],
  )

  const totalInvested = useMemo(
    () => cars.reduce((sum, c) => sum + (c.totalInvested ?? 0), 0),
    [cars],
  )

  return (
    <>
      <Header activePath="/garage" />

      <main className="max-w-[1200px] mx-auto px-5 py-10 pb-24 md:pb-10 flex flex-col md:flex-row gap-10">

        {/* ── Left: Car Grid ─────────────────────────────────── */}
        <div className="flex-1 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-dashed border-outline-variant pb-4 gap-4">
            <div>
              <h1 className="font-headline-md text-headline-md text-on-surface">Mi Garaje</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Gestión de inventario de vehículos
              </p>
            </div>

            {/* Mobile: PÚBLICO / PRIVADO pill toggle */}
            <div className="md:hidden bg-surface-dim border border-outline-variant rounded-full p-1 inline-flex items-center shadow-[inset_0_2px_4px_rgba(107,112,92,0.1)]">
              <button
                onClick={() => handleToggleGarage(true)}
                disabled={togglingGarage}
                className={[
                  'font-label-caps text-label-caps px-4 py-2 rounded-full transition-all border',
                  garage?.isPublic
                    ? 'bg-primary-container text-on-primary-container shadow-sm border-outline-variant/50'
                    : 'text-on-surface-variant border-transparent',
                ].join(' ')}
              >
                PÚBLICO
              </button>
              <button
                onClick={() => handleToggleGarage(false)}
                disabled={togglingGarage}
                className={[
                  'font-label-caps text-label-caps px-4 py-2 rounded-full transition-all border',
                  !garage?.isPublic
                    ? 'bg-primary-container text-on-primary-container shadow-sm border-outline-variant/50'
                    : 'text-on-surface-variant border-transparent',
                ].join(' ')}
              >
                PRIVADO
              </button>
            </div>

            {/* Add car button */}
            <Link
              href="/cars/new"
              className={[
                'inline-flex items-center gap-2',
                'bg-gradient-to-b from-surface to-surface-variant text-on-surface',
                'font-label-caps text-label-caps px-6 py-3 rounded',
                'border border-outline-variant border-b-4',
                'shadow-sm hover:from-surface-variant hover:to-surface-dim',
                'transition-all active:border-b active:translate-y-px',
              ].join(' ')}
            >
              <span className="material-symbols-outlined text-primary text-[18px]">add_circle</span>
              AÑADIR COCHE
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-error font-body-md">{error}</div>
          ) : filteredCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <span className="material-symbols-outlined text-[64px] text-on-surface-variant opacity-30">
                garage
              </span>
              <p className="font-headline-md text-headline-md text-on-surface-variant">
                {brandFilter ? 'Sin resultados' : 'Sin vehículos'}
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
                {brandFilter
                  ? `No tienes coches de la marca "${brandFilter}".`
                  : 'Añade tu primer vehículo para empezar tu historial.'}
              </p>
              {!brandFilter && (
                <Link
                  href="/cars/new"
                  className="inline-flex items-center gap-2 bg-gradient-to-b from-primary to-primary-container text-on-primary font-label-caps text-label-caps px-6 py-3 rounded border border-b-4 border-primary-container shadow-[0_2px_0_0_rgba(83,88,69,0.2)] hover:from-primary-container hover:to-primary active:border-b active:translate-y-px active:shadow-none transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  AÑADIR PRIMER VEHÍCULO
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map(car => (
                <CarCard
                  key={car.carId}
                  car={car}
                  onToggleVisibility={handleToggleCarVisibility}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Sidebar (desktop only) ──────────────────── */}
        <aside className="hidden md:flex w-80 flex-shrink-0 flex-col gap-6">

          {/* Visibilidad del Garaje */}
          <div className="bg-surface-container border border-outline-variant p-4 rounded-lg shadow-[0_2px_0_0_rgba(107,112,92,0.15)] relative">
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-outline-variant shadow-inner" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-outline-variant shadow-inner" />
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-3 border-b border-outline-variant/50 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">settings_input_component</span>
              VISIBILIDAD DEL GARAJE
            </h3>
            <div className="bg-surface-dim p-1.5 rounded border border-outline-variant shadow-inner flex mt-4">
              <button
                onClick={() => handleToggleGarage(true)}
                disabled={togglingGarage}
                className={[
                  'flex-1 rounded-l py-2 font-label-caps text-[11px] flex items-center justify-center gap-1 transition-all',
                  garage?.isPublic
                    ? 'bg-surface-container-lowest border border-outline-variant shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] text-primary'
                    : 'bg-gradient-to-b from-surface to-surface-variant border-y border-l border-outline-variant text-on-surface-variant hover:from-surface-variant hover:to-surface-dim border-b-2 shadow-sm',
                ].join(' ')}
              >
                <span className="material-symbols-outlined text-[16px]" style={garage?.isPublic ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                  public
                </span>
                PÚBLICO
              </button>
              <button
                onClick={() => handleToggleGarage(false)}
                disabled={togglingGarage}
                className={[
                  'flex-1 rounded-r py-2 font-label-caps text-[11px] flex items-center justify-center gap-1 transition-all',
                  !garage?.isPublic
                    ? 'bg-surface-container-lowest border border-outline-variant shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] text-primary'
                    : 'bg-gradient-to-b from-surface to-surface-variant border-y border-r border-outline-variant text-on-surface-variant hover:from-surface-variant hover:to-surface-dim border-b-2 shadow-sm',
                ].join(' ')}
              >
                <span className="material-symbols-outlined text-[16px]" style={!garage?.isPublic ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                  lock
                </span>
                PRIVADO
              </button>
            </div>
            <p className="font-body-sm text-[12px] text-on-surface-variant mt-3 leading-tight italic border-l-2 border-primary pl-2">
              {garage?.isPublic
                ? 'Tu colección es visible para la comunidad.'
                : 'Tu colección es privada.'}
            </p>
          </div>

          {/* Resumen Técnico */}
          <div className="bg-surface-container border border-outline-variant p-4 rounded-lg shadow-[0_2px_0_0_rgba(107,112,92,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 border-t-2 border-outline-variant opacity-40" />
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">speed</span>
              RESUMEN TÉCNICO
            </h3>
            <div className="space-y-2">
              <div className="bg-surface border border-outline-variant p-2 flex justify-between items-center shadow-inner rounded-sm">
                <span className="font-label-caps text-[11px] text-on-surface">VEHÍCULOS TOTALES</span>
                <div className="bg-primary text-on-primary font-mono text-[14px] px-2 py-0.5 rounded border border-primary-container shadow-sm">
                  {String(cars.length).padStart(2, '0')}
                </div>
              </div>
              <div className="bg-surface border border-outline-variant p-2 flex justify-between items-center shadow-inner rounded-sm">
                <span className="font-label-caps text-[11px] text-on-surface">VALOR ESTIMADO</span>
                <div className="text-secondary font-mono text-[14px] font-bold">
                  {totalInvested >= 1000
                    ? `${(totalInvested / 1000).toFixed(1)}K €`
                    : `${totalInvested} €`}
                </div>
              </div>
            </div>
          </div>

          {/* Filtrar Inventario */}
          <div className="bg-surface-container border border-outline-variant p-4 rounded-lg shadow-[0_2px_0_0_rgba(107,112,92,0.15)]">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">tune</span>
              FILTRAR INVENTARIO
            </h3>
            <div>
              <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1">
                MARCA
              </label>
              <div className="bg-surface border border-outline-variant shadow-inner rounded-sm overflow-hidden flex relative">
                <select
                  value={brandFilter}
                  onChange={e => setBrandFilter(e.target.value)}
                  className="w-full bg-transparent border-none text-body-sm font-body-md text-on-surface focus:ring-0 py-2 pl-3 pr-8 appearance-none cursor-pointer"
                >
                  <option value="">Todas las marcas</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <div className="absolute right-0 top-0 bottom-0 px-2 flex items-center text-outline bg-surface-dim border-l border-outline-variant pointer-events-none">
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <BottomNav activePath="/garage" />
    </>
  )
}
