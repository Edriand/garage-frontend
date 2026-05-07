/* ── Garage Settings ────────────────────────────────────────────────── */
export interface GarageSettings {
  isPublic: boolean
  updatedAt?: string
}

/* ── Car ───────────────────────────────────────────────────────────────── */
export interface Car {
  carId: string
  userId: string
  brand: string
  model: string
  year: number
  registrationYear: number
  totalKm: number
  totalInvested: number
  photoUrl: string | null
  isPublic: boolean
  likeCount: number
  isLiked: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCarBody {
  brand: string
  model: string
  year: number
  registrationYear: number
  totalKm: number
  totalInvested: number
  photoKey?: string
  isPublic?: boolean
}

export type UpdateCarBody = Partial<CreateCarBody>

/* ── Event ─────────────────────────────────────────────────────────────── */
export type EventType = 'mechanic' | 'fuel' | 'wash' | 'insurance' | 'other'

export interface CarEvent {
  eventId: string
  carId: string
  type: EventType
  description: string
  amount: number
  km: number | null
  date: string
  photos: string[]
  documents: string[]
  createdAt: string
  updatedAt: string
}

export interface EventsPage {
  events: CarEvent[]
  nextToken?: string
}

export interface CreateEventBody {
  date: string
  type: EventType
  description: string
  amount: number
  km?: number
  photoKeys?: string[]
  docKeys?: string[]
}

export type UpdateEventBody = Partial<CreateEventBody>

/* ── Car Summary ───────────────────────────────────────────────────────── */
export interface CarSummary {
  totalKm: number
  totalCost: number
  eventCount: number
  byType: Record<EventType, number>
  lastKmReading: number | null
}

/* ── Upload / Download ─────────────────────────────────────────────────── */
export interface UploadUrlBody {
  carId: string
  eventId?: string
  filename: string
  contentType: string
  category: 'photo' | 'document'
}

export interface UploadUrlResponse {
  uploadUrl: string
  fileKey: string
  expiresIn: number
}

export interface DownloadUrlResponse {
  downloadUrl: string
  expiresIn: number
}
