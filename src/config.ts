// ============================================================
//  Incident Monitor – Konfiguration
//  Alle Einstellungen werden hier zentral vorgenommen.
//  Fahrzeuge und Einsatzregeln → src/vehicles.ts
// ============================================================

export interface AppConfig {
  /** Basis-URL der DIVERA-Instanz (ohne abschließenden Slash) */
  diveraBaseUrl: string
  /** API-Key (Accesskey) aus DIVERA 24/7 unter Verwaltung → Schnittstellen */
  diveraApiKey: string
  /** Abfrage-Intervall in Sekunden (Empfehlung DIVERA: mind. 20 s) */
  pollIntervalSeconds: number
  /** Anzeigename der Wache / Feuerwehr */
  departmentName: string
}

export const config: AppConfig = {
  // Werte kommen aus .env.development / .env.production / .env.local
  // Secrets (API-Key) nur in .env.local eintragen – wird nicht ins Git eingecheckt.
  diveraBaseUrl: import.meta.env.VITE_DIVERA_BASE_URL || 'https://app.divera247.com',
  diveraApiKey: import.meta.env.VITE_DIVERA_API_KEY || '',
  pollIntervalSeconds: Number(import.meta.env.VITE_POLL_INTERVAL_SECONDS) || 30,
  departmentName: import.meta.env.VITE_DEPARTMENT_NAME || 'Feuerwehr',
}

