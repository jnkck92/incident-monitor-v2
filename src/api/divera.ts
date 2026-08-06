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

/**
 * Ruft /api/last-alarm ab – oder eine lokale Mock-Datei wenn VITE_USE_MOCK=true.
 * Gibt null zurück, wenn kein aktiver Alarm vorliegt.
 * Wirft einen Error bei HTTP-Fehler oder Netzwerkproblem.
 */
export async function fetchLastAlarm(): Promise<AlarmResult | null> {
  const useMock = import.meta.env.VITE_USE_MOCK === 'true'
  const url = useMock
    ? import.meta.env.VITE_MOCK_FILE || '/mock/no-alarm.json'
    : `/divera-api/api/last-alarm?accesskey=${encodeURIComponent(config.diveraApiKey)}`

  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) })

  if (!useMock) {
    if (response.status === 429) {
      throw new Error('Rate-Limit erreicht (429) – Abfrage-Intervall erhöhen.')
    }
    if (response.status === 403) {
      throw new Error('Zugriff verweigert (403) – API-Key prüfen.')
    }
  }

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
