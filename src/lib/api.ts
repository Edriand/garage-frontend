import { fetchAuthSession } from 'aws-amplify/auth'
import type {
  Car,
  CreateCarBody,
  UpdateCarBody,
  GarageSettings,
  UploadUrlBody,
  UploadUrlResponse,
  DownloadUrlResponse,
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
    const body = await res.text().catch(() => res.statusText)
    throw new ApiError(res.status, body)
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
