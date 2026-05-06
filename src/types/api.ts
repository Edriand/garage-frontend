/* ── Garage ────────────────────────────────────────────────────────────── */
export interface Garage {
  garageId: string
  userId: string
  name: string
  description?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

/* ── Car ───────────────────────────────────────────────────────────────── */
export interface Car {
  carId: string
  garageId: string
  make: string
  model: string
  year: number
  vin?: string
  licensePlate?: string
  color?: string
  isPublic: boolean
  coverImageUrl?: string
  currentKm?: number
  createdAt: string
  updatedAt: string
}

/* ── Event ─────────────────────────────────────────────────────────────── */
export type EventType = 'mechanic' | 'fuel' | 'wash' | 'insurance' | 'other'

export interface CarEvent {
  eventId: string
  carId: string
  type: EventType
  title: string
  description?: string
  km?: number
  cost?: number
  currency?: string
  date: string
  receiptUrl?: string
  imageUrls?: string[]
  createdAt: string
  updatedAt: string
}

/* ── Car Summary ───────────────────────────────────────────────────────── */
export interface CarSummary {
  carId: string
  totalKm: number
  totalCost: number
  byType: Record<EventType, { count: number; totalCost: number }>
}

/* ── Pagination ────────────────────────────────────────────────────────── */
export interface PaginatedResponse<T> {
  items: T[]
  nextToken?: string
  count: number
}
