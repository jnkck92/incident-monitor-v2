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
  diveraId?: number
  group?: 'person' | 'vehicle'
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
  statusColors?: Record<string, string>
  statusShort?: Record<string, string>
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
  let bestRule: Rule | null = null
  let bestLen = 0
   for (const rule of config.rules) {
    for (const k of rule.keywords) {
      const norm = k.toLowerCase().replace(/\s+/g, '')
      if (t.includes(norm) && norm.length > bestLen) {
        bestRule = rule
        bestLen = norm.length
      }
    }
  }
  return bestRule
}

export function orderedVehiclesForDisplay(rule: Rule | null, config: VehicleConfig): Vehicle[] {
  const ids = rule?.vehicleOrder ?? config.defaultOrder
  const orderedSet = new Set(ids)
  return [...resolveVehicles(ids, config), ...config.vehicles.filter(v => !orderedSet.has(v.id))]
}