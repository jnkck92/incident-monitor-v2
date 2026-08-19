export interface AppConfig {
  diveraBaseUrl: string
  diveraApiKey: string
  pollIntervalSeconds: number
  departmentName: string
  ownVehicleId: string
}

export const config: AppConfig = {
  diveraBaseUrl: 'https://app.divera247.com',
  diveraApiKey: '',
  pollIntervalSeconds: 30,
  departmentName: 'Feuerwehr',
  ownVehicleId: '',
}

export function initConfig(overrides: Partial<AppConfig>) {
  Object.assign(config, overrides)
}