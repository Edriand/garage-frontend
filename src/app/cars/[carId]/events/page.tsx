'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getEvents } from '@/lib/api'
import { EventCard } from '@/components/events/EventCard'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import type { CarEvent, EventType } from '@/types/api'

type Filter = 'all' | EventType

const FILTERS: { key: Filter; label: string; icon: string }[] = [
  { key: 'all', label: 'TODOS', icon: 'filter_list' },
  { key: 'mechanic', label: 'TALLER', icon: 'build' },
  { key: 'fuel', label: 'REPOSTAJE', icon: 'local_gas_station' },
  { key: 'wash', label: 'LAVADO', icon: 'water_drop' },
]

function formatEur(n: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)
}

function StatsStrip({ events }: { events: CarEvent[] }) {
  const mostRecentKm = events.find(e => e.km != null)?.km ?? null
  const lastMechanic = events.find(e => e.type === 'mechanic')
  const ytd = events
    .filter(e => new Date(e.date).getFullYear() === new Date().getFullYear())
    .reduce((s, e) => s + e.amount, 0)
  const total = events.length

  const stats = [
    { icon: 'speed', label: 'KILOMETRAJE', value: mostRecentKm != null ? `${mostRecentKm.toLocaleString('es-ES')} km` : '—' },
    { icon: 'oil_barrel', label: 'ÚLTIMO ACEITE', value: lastMechanic ? new Date(lastMechanic.date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }).toUpperCase() : '—' },
    { icon: 'payments', label: 'INVERSIÓN YTD', value: formatEur(ytd) },
    { icon: 'receipt_long', label: 'TOTAL EVENTOS', value: String(total) },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 pt-6">
      {stats.map(s => (
        <div
          key={s.label}
          className="bg-surface border border-surface-variant rounded p-3 flex flex-col items-center justify-center shadow-[inset_0_2px_4px_rgba(107,112,92,0.1)]"
        >
          <span className="material-symbols-outlined text-primary text-[20px] mb-1">{s.icon}</span>
          <span className="font-label-caps text-[9px] text-outline tracking-wider mb-0.5">{s.label}</span>
          <span className="font-title-sm text-[15px] text-on-surface text-center">{s.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function EventsPage() {
  const { carId } = useParams<{ carId: string }>()

  const [events, setEvents] = useState<CarEvent[]>([])
  const [nextToken, setNextToken] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const page = await getEvents(carId)
      setEvents(page.events)
      setNextToken(page.nextToken)
    } catch {
      setError('No se pudo cargar el historial')
    } finally {
      setLoading(false)
    }
  }, [carId])

  useEffect(() => { load() }, [load])

  async function loadMore() {
    if (!nextToken) return
    setLoadingMore(true)
    try {
      const page = await getEvents(carId, nextToken)
      setEvents(prev => [...prev, ...page.events])
      setNextToken(page.nextToken)
    } catch {
      // ignore
    } finally {
      setLoadingMore(false)
    }
  }

  function handleDeleted(eventId: string) {
    setEvents(prev => prev.filter(e => e.eventId !== eventId))
  }

  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter)

  return (
    <div className="flex flex-col gap-4 pb-6">
      <StatsStrip events={events} />

      {/* Filter tabs */}
      <div className="flex gap-2 px-5 pt-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={[
              'flex items-center gap-1 px-3 py-2 rounded font-label-caps text-label-caps border transition-all',
              filter === f.key
                ? 'bg-primary-container text-on-primary-container border-outline-variant shadow-[0_2px_0_0_rgba(107,112,92,0.15)]'
                : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-variant',
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-[14px]">{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Add event CTA */}
      <div className="px-5">
        <Link
          href={`/cars/${carId}/events/new`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded border-2 border-dashed border-outline-variant text-on-surface-variant font-label-caps text-label-caps hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          AÑADIR REGISTRO
        </Link>
      </div>

      {/* Events list */}
      <div className="px-5 flex flex-col gap-4">
        {loading && <div className="flex justify-center py-10"><Spinner /></div>}
        {error && <p className="font-body-sm text-body-sm text-error text-center">{error}</p>}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-[48px] text-outline-variant">history</span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              {filter === 'all' ? 'Aún no hay registros.' : 'No hay registros para este filtro.'}
            </p>
          </div>
        )}
        {filtered.map(event => (
          <EventCard
            key={event.eventId}
            carId={carId}
            event={event}
            onDeleted={handleDeleted}
          />
        ))}
      </div>

      {/* Pagination */}
      {nextToken && !loading && (
        <div className="px-5">
          <Button variant="secondary" onClick={loadMore} disabled={loadingMore} className="w-full">
            {loadingMore ? <Spinner /> : 'CARGAR REGISTROS ANTERIORES'}
          </Button>
        </div>
      )}
    </div>
  )
}
