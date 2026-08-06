// ============================================================
//  Fahrzeug- und Stichwort-Konfiguration
//  Fahrzeuge und Einsatzregeln hier zentral pflegen.
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
  /** Stichworte die exakt (case-insensitive) auf den DIVERA-Titel matchen */
  keywords: string[]
  /** Fahrzeug-IDs in gewünschter Reihenfolge */
  vehicleOrder: string[]
}

export interface VehicleConfig {
  vehicles: Vehicle[]
  /** Fallback-Reihenfolge wenn kein Stichwort matched */
  defaultOrder: string[]
  /** Kontakt für den "nicht auf der Liste"-Hinweis */
  commandContact: string
  rules: Rule[]
}

export const vehicleConfig: VehicleConfig = {
  vehicles: [
    { id: 'elw1',  name: 'ELW1',   shortName: 'ELW1',   type: 'Einsatzleitwagen',            ric: '15/11-4' },
    { id: 'hlf20', name: 'HLF20',  shortName: 'HLF20',  type: 'Hilfeleistungslöschfahrzeug', ric: '15/48-4' },
    { id: 'tlf16', name: 'TLF16',  shortName: 'TLF16',  type: 'Tanklöschfahrzeug',           ric: '15/23-4' },
    { id: 'rw1',   name: 'RW1',    shortName: 'RW1',    type: 'Rüstwagen',                   ric: '15/52-4' },
    { id: 'sw2000',name: 'SW2000', shortName: 'SW2000', type: 'Schlauchwagen',               ric: '15/62-4' },
    { id: 'rtb1',  name: 'RTB1',   shortName: 'RTB1',   type: 'Rettungsboot',                ric: '15/78-4' },
    { id: 'mtw1',  name: 'MTW1',   shortName: 'MTW1',   type: 'Mannschaftstransportwagen',   ric: '15/17-4' },
  ],

  defaultOrder: ['elw1', 'hlf20', 'tlf16', 'rw1', 'sw2000', 'mtw1', 'rtb1'],

  commandContact: 'ELW 15/11-4',

  rules: [
    { label: 'Gefahrgut Messeinsatz',                                  keywords: ['CBRN011', 'CBRN 011'],  vehicleOrder: ['elw1', 'hlf20'] },
    { label: 'Gefahrgut klein',                                        keywords: ['CBRN01',  'CBRN 01'],   vehicleOrder: ['elw1', 'hlf20'] },
    { label: 'Gefahrgut mittel',                                       keywords: ['CBRN02',  'CBRN 02'],   vehicleOrder: ['elw1', 'hlf20', 'sw2000', 'rw1', 'tlf16', 'mtw1'] },
    { label: 'Gefahrgut groß',                                         keywords: ['CBRN03',  'CBRN 03'],   vehicleOrder: ['elw1', 'hlf20', 'sw2000', 'rw1', 'tlf16', 'mtw1'] },
    { label: 'Klein- und Entstehungsbrände – PKW-Brand',               keywords: ['F011',    'F 011'],     vehicleOrder: ['elw1', 'hlf20', 'tlf16', 'sw2000'] },
    { label: 'Klein- und Entstehungsbrände – Brandnachschau',          keywords: ['F012',    'F 012'],     vehicleOrder: ['elw1', 'hlf20'] },
    { label: 'Klein- und Entstehungsbrände',                           keywords: ['F01',     'F 01'],      vehicleOrder: ['elw1', 'hlf20', 'tlf16'] },
    { label: 'Mittelbrand A – BMA/Rauchmelder unbestätigt',            keywords: ['F021',    'F 021'],     vehicleOrder: ['elw1', 'hlf20', 'tlf16', 'sw2000', 'rw1', 'mtw1'] },
    { label: 'Mittelbrand A ohne Personengefährdung',                  keywords: ['F02',     'F 02'],      vehicleOrder: ['elw1', 'hlf20', 'tlf16', 'sw2000', 'rw1', 'mtw1'] },
    { label: 'Fahrzeugbrand mit Personengefährdung',                   keywords: ['F031',    'F 031'],     vehicleOrder: ['elw1', 'hlf20', 'tlf16', 'sw2000', 'rw1', 'mtw1'] },
    { label: 'Mittelbrand A mit Menschenleben in Gefahr',              keywords: ['F03',     'F 03'],      vehicleOrder: [] },
    { label: 'Großbrand',                                              keywords: ['F04',     'F 04'],      vehicleOrder: ['elw1', 'hlf20', 'tlf16', 'sw2000', 'rw1', 'mtw1'] },
    { label: 'Waldbrand',                                              keywords: ['F05',     'F 05'],      vehicleOrder: ['elw1', 'hlf20', 'tlf16', 'sw2000', 'rw1', 'mtw1'] },
    { label: 'Havarie/Schiffsbrand',                                   keywords: ['F06',     'F 06'],      vehicleOrder: ['elw1', 'hlf20', 'mtw1', 'rtb1', 'rw1', 'tlf16', 'sw2000'] },
    { label: 'Hilfeleistung klein',                                    keywords: ['H01',     'H 01'],      vehicleOrder: ['elw1', 'hlf20', 'rw1'] },
    { label: 'Hilfeleistung Ölspur',                                   keywords: ['H021',    'H 021'],     vehicleOrder: ['elw1', 'hlf20', 'rw1'] },
    { label: 'Hilfeleistung Drehleiter',                               keywords: ['H022',    'H 022'],     vehicleOrder: ['elw1', 'hlf20', 'rw1'] },
    { label: 'Hilfeleistung mittel',                                   keywords: ['H02',     'H 02'],      vehicleOrder: ['elw1', 'hlf20', 'rw1'] },
    { label: 'Hilfeleistung groß',                                     keywords: ['H03',     'H 03'],      vehicleOrder: ['elw1', 'hlf20', 'rw1', 'tlf16', 'sw2000', 'mtw1'] },
    { label: 'Hilfeleistung Tiernotlage',                              keywords: ['H04',     'H 04'],      vehicleOrder: ['elw1', 'hlf20', 'rw1', 'tlf16', 'sw2000', 'mtw1'] },
    { label: 'Hilfeleistung – Verkehrsunfall mit eingeklemmter Person',keywords: ['H051',    'H 051'],     vehicleOrder: ['elw1', 'hlf20', 'rw1', 'tlf16', 'sw2000', 'mtw1'] },
    { label: 'Hilfeleistung Türnotöffnung',                            keywords: ['H052',    'H 052'],     vehicleOrder: ['elw1', 'hlf20', 'rw1'] },
    { label: 'Hilfeleistung mit Personenschaden',                      keywords: ['H05',     'H 05'],      vehicleOrder: ['elw1', 'hlf20', 'rw1', 'tlf16', 'sw2000', 'mtw1'] },
    { label: 'Hilfeleistung mit großem Personenschaden',               keywords: ['H06',     'H 06'],      vehicleOrder: ['elw1', 'hlf20', 'rw1', 'tlf16', 'sw2000', 'mtw1'] },
    { label: 'Hilfeleistung Person im Wasser',                         keywords: ['H071',    'H 071'],     vehicleOrder: ['elw1', 'hlf20', 'mtw1', 'rtb1', 'rw1', 'tlf16'] },
    { label: 'Hilfeleistung KFZ im Wasser / Bootsunfall',             keywords: ['H072',    'H 072'],     vehicleOrder: ['elw1', 'hlf20', 'mtw1', 'rtb1', 'rw1', 'tlf16', 'sw2000'] },
    { label: 'Hilfeleistung Wasserrettung',                            keywords: ['H07',     'H 07'],      vehicleOrder: ['elw1', 'hlf20', 'mtw1', 'rtb1', 'rw1', 'tlf16'] },
    { label: 'Hilfeleistung Kanal / Silorettung, Person verschüttet',  keywords: ['H081',    'H 081'],     vehicleOrder: ['elw1', 'hlf20', 'rw1', 'tlf16', 'sw2000', 'mtw1'] },
    { label: 'Hilfeleistung Höhenrettung',                             keywords: ['H08',     'H 08'],      vehicleOrder: ['elw1', 'hlf20', 'rw1', 'tlf16'] },
    { label: 'Unterstützung Rettungsdienst',                           keywords: ['S011',    'S 011'],     vehicleOrder: ['elw1', 'hlf20'] },
    { label: 'Unterstützung',                                          keywords: ['S01',     'S 01'],      vehicleOrder: ['elw1', 'hlf20'] },
  ],
}

/** Hilfsfunktion: Gibt Vehicle-Objekte für eine Liste von IDs zurück */
export function resolveVehicles(ids: string[]): Vehicle[] {
  return ids
    .map(id => vehicleConfig.vehicles.find(v => v.id === id))
    .filter((v): v is Vehicle => v !== undefined)
}

/** Findet die passende Regel für ein Stichwort ("enthält"-Prüfung, case-insensitive) */
export function findRule(title: string) {
  const t = title.trim().toLowerCase()
  return vehicleConfig.rules.find(r =>
    r.keywords.some(k => t.includes(k.toLowerCase()))
  ) ?? null
}
