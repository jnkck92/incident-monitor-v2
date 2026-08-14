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
