import { ref, onMounted, onUnmounted } from 'vue'
import type { VehicleConfig } from '../vehicles'

export function useVehicleConfig() {
  const vehicleConfig = ref<VehicleConfig | null>(null)

  async function load() {
    const res = await fetch('/data.json')
    if (!res.ok) throw new Error(`data.json konnte nicht geladen werden (${res.status})`)
    vehicleConfig.value = await res.json() as VehicleConfig
  }

  let reloadTimer: ReturnType<typeof setInterval>

  onMounted(async () => {
    await load()
    reloadTimer = setInterval(load, 60 * 60 * 1000)
  })

  onUnmounted(() => clearInterval(reloadTimer))

  return { vehicleConfig }
}