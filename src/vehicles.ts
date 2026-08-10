// ============================================================
//  Typen und Hilfsfunktionen für Fahrzeuge und Regeln.
//  Die Konfigurationsdaten liegen in /public/vehicles.json
//  und werden zur Laufzeit geladen.
// ============================================================

export interface Vehicle {
  id: string
  name: string
  shortName: string
  type: string
  ric: string
}

export interface Rule {
  label: string
  keywords: string[]
  vehicleOrder: string[]
  color?: string
}

export interface VehicleConfig {
  vehicles: Vehicle[]
  defaultOrder: string[]
  commandContact: string
  rules: Rule[]
}

/** Gibt Vehicle-Objekte für eine Liste von IDs zurück */
export function resolveVehicles(ids: string[], config: VehicleConfig): Vehicle[] {
  return ids
    .map(id => config.vehicles.find(v => v.id === id))
    .filter((v): v is Vehicle => v !== undefined)
}

/** Findet die passende Regel für ein Stichwort (case-insensitive) */
export function findRule(title: string, config: VehicleConfig): Rule | null {
  const t = title.trim().toLowerCase().replace(/\s+/g, '')
  return config.rules.find(r =>
    r.keywords.some(k => t.includes(k.toLowerCase().replace(/\s+/g, '')))
  ) ?? null
}