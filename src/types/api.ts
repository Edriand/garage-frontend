/* ── Garage Settings ────────────────────────────────────────────────── */
export interface GarageSettings {
  isPublic: boolean
  photoKey?: string | null
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
  photoKey?: string
  isPublic?: boolean
}

export type UpdateCarBody = Partial<CreateCarBody>

/* ── Event ─────────────────────────────────────────────────────────────── */
export type EventType = 'mechanic' | 'fuel' | 'wash' | 'insurance' | 'modification' | 'purchase' | 'other'

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
  km: number
  photoKeys?: string[]
  docKeys?: string[]
}

export type UpdateEventBody = Partial<CreateEventBody>

/* ── Car Summary ───────────────────────────────────────────────────────── */
export type RunningCostType = Exclude<EventType, 'purchase'>

export interface CarSummary {
  currentKm: number | null
  purchaseCost: number
  totalRunningCost: number
  totalCost: number
  eventCount: number
  byType: Record<RunningCostType, number>
}

/* ── Public garage ─────────────────────────────────────────────────────── */
export interface PublicGarageCar {
  carId: string
  brand: string
  model: string
  year: number
  likeCount: number
  photoUrl: string | null
  createdAt?: string
}

export interface PublicGarageResponse {
  userId: string
  isPublic: boolean
  photoKey?: string | null
  updatedAt?: string
  cars: PublicGarageCar[]
}

/* ── Feed ──────────────────────────────────────────────────────────────── */
export interface FeedCar {
  carId: string
  userId: string
  brand: string
  model: string
  year: number
  likeCount: number
  photoUrl: string | null
  createdAt?: string
}

export interface FeedPage {
  cars: FeedCar[]
  nextToken?: string
}

/* ── Upload / Download ─────────────────────────────────────────────────── */
export interface UploadUrlBody {
  carId?: string
  eventId?: string
  filename: string
  contentType: string
  category: 'photo' | 'document' | 'avatar'
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
