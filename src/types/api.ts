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
