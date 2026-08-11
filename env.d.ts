/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DIVERA_API_KEY: string
  readonly VITE_DIVERA_BASE_URL: string
  readonly VITE_POLL_INTERVAL_SECONDS: string
  readonly VITE_DEPARTMENT_NAME: string
  readonly VITE_USE_MOCK: string
  readonly VITE_OWN_VEHICLE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
