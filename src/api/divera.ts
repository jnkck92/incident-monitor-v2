import { config } from '../config'

export interface AlarmResult {
  id?: number
  title?: string
  address?: string
  closed?: boolean
  date?: number
  priority?: boolean
}

export interface AlarmLogEntry {
  id?: number
  title?: string
  address?: string
  loggedAt: string
}

export interface DiveraEvent {
  id: number
  title: string
  date: number
  ts_start?: number
  ts_end?: number
  address?: string
  deleted?: boolean
  hidden?: boolean
}

export interface DiveraNews {
  id: number
  title: string
  text?: string
  date: number
  ts_create: number
  deleted?: boolean
  hidden?: boolean
}

export async function fetchUpcomingEvents(): Promise<DiveraEvent[]> {
  const useMock = import.meta.env.VITE_USE_MOCK === 'true'
  const url = useMock
    ? '/mock/events.json'
    : `/divera-api/api/v2/events?accesskey=${encodeURIComponent(config.diveraApiKey)}`

  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const items: Record<string, DiveraEvent> = json?.data?.items ?? {}
  const sorting: number[] = json?.data?.sorting ?? []
  const now = Date.now() / 1000
  return sorting
    .map(id => items[id])
    .filter((e): e is DiveraEvent => !!e && !e.deleted && !e.hidden && (e.ts_start ?? e.date) >= now)
    .slice(0, 8)
}

export async function fetchRecentNews(): Promise<DiveraNews[]> {
  const useMock = import.meta.env.VITE_USE_MOCK === 'true'
  const url = useMock
    ? '/mock/news.json'
    : `/divera-api/api/v2/news?accesskey=${encodeURIComponent(config.diveraApiKey)}`

  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const items: Record<string, DiveraNews> = json?.data?.items ?? {}
  const sorting: number[] = json?.data?.sorting ?? []
  return sorting
    .map(id => items[id])
    .filter((n): n is DiveraNews => !!n && !n.deleted && !n.hidden)
    .slice(0, 6)
}
export async function fetchVehicleStatus(diveraId: number, apiKey: string): Promise<number | null> {
  try {
    const url = `/divera-api/api/v2/using-vehicles/get-status/${diveraId}?accesskey=${encodeURIComponent(apiKey)}`
    const res = await fetch(url, { signal: AbortSignal.timeout(5_000) })
    console.log(
      `fetchVehicleStatus(${diveraId}) => HTTP ${res.status} ${res.statusText} (ok=${res.ok})`
    )
    if (!res.ok) return null
    const json = await res.json()
    return json?.data?.status ?? json?.status ?? null
  } catch {
    return null
  }
}

export async function fetchLastAlarm(): Promise<AlarmResult | null> {
  const useMock = import.meta.env.VITE_USE_MOCK === 'true'
  if (useMock) {
    const keyword = new URLSearchParams(window.location.search).get('alarm')
    const mockFile = keyword
      ? `/mock/${keyword}.json`
      : (import.meta.env.VITE_MOCK_FILE || '/mock/no-alarm.json')
    const res = await fetch(mockFile, { signal: AbortSignal.timeout(10_000) })
    const json = await res.json()
    const alarm: AlarmResult | null = json?.data ?? json ?? null
    if (!alarm || typeof alarm.id === 'undefined') return null
    return alarm
  }

  const url = `/divera-api/api/last-alarm?accesskey=${encodeURIComponent(config.diveraApiKey)}`
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) })

  if (!response.ok) {
    throw new Error(`API-Fehler: HTTP ${response.status}`)
  }

  const json = await response.json()

  const alarm: AlarmResult | null = json?.data ?? json ?? null

  if (!alarm || typeof alarm.id === 'undefined') return null

  return alarm
}
