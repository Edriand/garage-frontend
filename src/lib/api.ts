import { fetchAuthSession } from 'aws-amplify/auth'
import type {
  Car,
  CreateCarBody,
  UpdateCarBody,
  GarageSettings,
  CarSummary,
  CarEvent,
  EventsPage,
  CreateEventBody,
  UpdateEventBody,
  UploadUrlBody,
  UploadUrlResponse,
  DownloadUrlResponse,
  FeedPage,
} from '@/types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await fetchAuthSession()
  const token = session.tokens?.idToken?.toString()
  if (!token) throw new ApiError(401, 'No active session')
  return { Authorization: `Bearer ${token}` }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const authHeaders = await getAuthHeaders()
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    let message = text
    try {
      const parsed = JSON.parse(text)
      if (parsed.message) message = parsed.message
    } catch {}
    throw new ApiError(res.status, message)
  }

  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

export async function getCars(): Promise<Car[]> {
  const data = await request<{ cars: Car[] }>('/cars')
  return data.cars
}

export async function createCar(body: CreateCarBody): Promise<Car> {
  return request<Car>('/cars', { method: 'POST', body: JSON.stringify(body) })
}

export async function getCar(carId: string): Promise<Car> {
  return request<Car>(`/cars/${carId}`)
}

export async function updateCar(carId: string, body: UpdateCarBody): Promise<Car> {
  return request<Car>(`/cars/${carId}`, { method: 'PUT', body: JSON.stringify(body) })
}

export async function deleteCar(carId: string): Promise<void> {
  await request<void>(`/cars/${carId}`, { method: 'DELETE' })
}

export async function getGarage(): Promise<GarageSettings> {
  return request<GarageSettings>('/garage')
}

export async function updateGarage(body: { isPublic: boolean }): Promise<GarageSettings> {
  return request<GarageSettings>('/garage', { method: 'PUT', body: JSON.stringify(body) })
}

export async function getCarSummary(carId: string): Promise<CarSummary> {
  return request<CarSummary>(`/cars/${carId}/summary`)
}

export async function getEvents(carId: string, nextToken?: string): Promise<EventsPage> {
  const qs = nextToken ? `?nextToken=${encodeURIComponent(nextToken)}` : ''
  return request<EventsPage>(`/cars/${carId}/events${qs}`)
}

export async function getEvent(carId: string, eventId: string): Promise<CarEvent> {
  return request<CarEvent>(`/cars/${carId}/events/${eventId}`)
}

export async function createEvent(carId: string, body: CreateEventBody): Promise<CarEvent> {
  return request<CarEvent>(`/cars/${carId}/events`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateEvent(carId: string, eventId: string, body: UpdateEventBody): Promise<CarEvent> {
  return request<CarEvent>(`/cars/${carId}/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function deleteEvent(carId: string, eventId: string): Promise<void> {
  await request<void>(`/cars/${carId}/events/${eventId}`, { method: 'DELETE' })
}

export async function likeCar(carId: string): Promise<{ likeCount: number }> {
  return request<{ likeCount: number }>(`/cars/${carId}/like`, { method: 'POST' })
}

export async function unlikeCar(carId: string): Promise<{ likeCount: number }> {
  return request<{ likeCount: number }>(`/cars/${carId}/like`, { method: 'DELETE' })
}

export async function getPresignedUploadUrl(body: UploadUrlBody): Promise<UploadUrlResponse> {
  return request<UploadUrlResponse>('/upload/presigned-url', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function getPresignedDownloadUrl(fileKey: string): Promise<DownloadUrlResponse> {
  return request<DownloadUrlResponse>(
    `/download/presigned-url?fileKey=${encodeURIComponent(fileKey)}`,
  )
}

async function publicRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    let message = text
    try {
      const parsed = JSON.parse(text)
      if (parsed.message) message = parsed.message
    } catch {}
    throw new ApiError(res.status, message)
  }
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

export async function getFeed(params?: {
  sort?: 'latest' | 'likes'
  limit?: number
  nextToken?: string
}): Promise<FeedPage> {
  const qs = new URLSearchParams()
  if (params?.sort) qs.set('sort', params.sort)
  if (params?.limit != null) qs.set('limit', String(params.limit))
  if (params?.nextToken) qs.set('nextToken', params.nextToken)
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return publicRequest<FeedPage>(`/feed${query}`, { cache: 'no-store' } as RequestInit)
}
