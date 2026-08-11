import { config } from '../config'

/** Relevante Felder aus dem DIVERA /api/last-alarm Response */
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

export const STATUS_COLOR: Record<number, string> = {
  0: '#ff0000',  // Notruf              — Rot (kritisch)
  1: '#ffcc00',  // Einsatzbereit/Funk  — Gelb
  2: '#22cc44',  // Einsatzbereit/Wache — Grün
  3: '#1a72ff',  // Unterwegs           — Blau
  4: '#00aacc',  // An der Einsatzstelle — Cyan/Teal (unterscheidbar von 3)
  5: '#ffcc00',  // Sprechwunsch        — Gelb (wie 1)
  6: '#cc2200',  // Nicht einsatzbereit — Dunkelrot
  7: '#aa44ff',  // Einsatzgebunden     — Lila
  8: '#0077aa',  // Bedingt verfügbar   — Dunkles Cyan
  9: '#888888',  // Quittung            — Grau
}

export const STATUS_SHORT: Record<number, string> = {
  0: 'NOTRUF',
  1: 'BEREIT/FUNK',
  2: 'BEREIT/WACHE',
  3: 'UNTERWEGS',
  4: 'EINSATZSTELLE',
  5: 'SPRECHWUNSCH',
  6: 'NICHT BEREIT',
  7: 'EINSATZGEB.',
  8: 'BED. VERFÜGBAR',
  9: 'QUITTUNG',
}

export const STATUS_LABEL: Record<number, string> = {
  0: 'Notruf', 
  1: 'Einsatzbereit über Funk', 
  2: 'Einsatzbereit auf der Wache / am Standort',
  3: 'Auftrag übernommen / unterwegs zum Einsatzort', 
  4: 'An der Einsatzstelle / am Einsatzort angekommen', 
  5: 'Sprechwunsch',
  6: 'Nicht einsatzbereit', 
  7: 'Einsatzgebunden', 
  8: 'Bedingt verfügbar', 
  9: 'Quittung',
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

/**
 * Ruft /api/last-alarm ab – oder eine lokale Mock-Datei wenn VITE_USE_MOCK=true.
 * Gibt null zurück, wenn kein aktiver Alarm vorliegt.
 * Wirft einen Error bei HTTP-Fehler oder Netzwerkproblem.
 */
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

  // DIVERA gibt bei /api/last-alarm direkt das alarm-result-Objekt zurück.
  // Manche Endpunkte wrappen in { success, data } – beide Varianten abfangen.
  const alarm: AlarmResult | null = json?.data ?? json ?? null

  // Wenn kein id vorhanden ist oder Einsatz geschlossen, ist kein Alarm aktiv
  if (!alarm || typeof alarm.id === 'undefined') return null

  return alarm
}
