'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getCarSummary } from '@/lib/api'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import type { CarSummary, EventType, RunningCostType } from '@/types/api'

function OdometerDisplay({ km }: { km: number }) {
  const digits = String(Math.max(0, Math.floor(km))).padStart(6, '0').split('')
  return (
    <div className="flex items-center gap-1 justify-center my-3">
      {digits.map((d, i) => (
        <div
          key={i}
          className="w-9 h-12 bg-inverse-surface text-inverse-on-surface font-mono text-xl font-bold flex items-center justify-center rounded-sm border border-outline shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
          style={{ fontFamily: 'Space Grotesk, monospace' }}
        >
          {d}
        </div>
      ))}
      <span className="font-label-caps text-label-caps text-on-surface-variant ml-1">km</span>
    </div>
  )
}

const TYPE_LABELS: Record<EventType, string> = {
  purchase: 'COMPRA',
  mechanic: 'MECÁNICA',
  modification: 'MODIFICACIÓN',
  fuel: 'GASOLINA',
  wash: 'LAVADOS',
  insurance: 'SEGURO',
  other: 'OTROS',
}

const ORDERED_TYPES: EventType[] = ['purchase', 'mechanic', 'modification', 'fuel', 'wash', 'insurance', 'other']

function formatEur(n: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)
}

export default function CarResumenPage() {
  const { carId } = useParams<{ carId: string }>()
  const [summary, setSummary] = useState<CarSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCarSummary(carId)
      .then(setSummary)
      .catch(() => setError('No se pudo cargar el resumen'))
      .finally(() => setLoading(false))
  }, [carId])

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>
  }

  if (error || !summary) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="font-body-sm text-body-sm text-error">{error ?? 'Sin datos'}</p>
      </div>
    )
  }

  return (
    <div className="px-5 py-8 flex flex-col gap-6">
      {/* Inversión total */}
      <div className="bg-surface-container border-2 border-outline rounded-xl p-6 relative overflow-hidden shadow-[0_4px_0_0_rgba(107,112,92,0.15)]">
        {/* Corner rivets */}
        {[['top-3 left-3'], ['top-3 right-3'], ['bottom-3 left-3'], ['bottom-3 right-3']].map(([pos]) => (
          <div key={pos} className={`absolute ${pos} w-2 h-2 rounded-full bg-outline-variant border border-outline shadow-sm`} />
        ))}
        <div className="flex flex-col items-center text-center z-10">
          <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[16px]">account_balance</span>
            INVERSIÓN TOTAL
          </span>
          <span className="font-display-lg text-display-lg text-primary">{formatEur(summary.totalCost)}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {summary.eventCount} {summary.eventCount === 1 ? 'registro' : 'registros'}
          </span>
        </div>
      </div>

      {/* Odómetro */}
      <div className="bg-surface-container-high border border-outline-variant rounded-xl p-5 flex flex-col items-center shadow-[0_2px_0_0_rgba(107,112,92,0.1)]">
        <span className="font-label-caps text-label-caps text-on-surface-variant w-full text-left mb-1">ODÓMETRO</span>
        <OdometerDisplay km={summary.currentKm ?? 0} />
        {summary.currentKm == null && (
          <span className="font-body-sm text-body-sm text-on-surface-variant text-center mt-1">
            Sin registros de kilómetros aún
          </span>
        )}
      </div>

      {/* Breakdown cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ORDERED_TYPES.map(type => (
          <Card key={type}>
            <CardBody className="flex flex-col gap-2">
              <Badge eventType={type} />
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">
                {TYPE_LABELS[type]}
              </span>
              <span className="font-title-sm text-title-sm text-on-surface">
                {formatEur(type === 'purchase' ? summary.purchaseCost : summary.byType[type as RunningCostType] ?? 0)}
              </span>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
