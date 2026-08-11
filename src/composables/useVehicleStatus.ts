import { ref, watchEffect, watch, onUnmounted } from 'vue'
import { config } from '../config'
import { fetchVehicleStatus } from '../api/divera'
import type { Vehicle } from '../vehicles'

export function useVehicleStatus(
  getVehicles: () => Vehicle[],
  isAlarmActive: () => boolean   // neu
) {
  const statuses = ref<Record<string, number>>({})
  let timer: ReturnType<typeof setInterval> | null = null

  async function fetchAll() {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      try {
        const res = await fetch('/mock/vehicle-statuses.json')
        if (res.ok) statuses.value = await res.json()
      } catch { }
      return
    }

    const result: Record<string, number> = {}
    await Promise.allSettled(
      getVehicles()
        .filter(v => v.diveraId != null)
        .map(async v => {
          const s = await fetchVehicleStatus(v.diveraId!, config.diveraApiKey)
          if (s !== null) result[v.id] = s
        })
    )
    statuses.value = result
  }

  function restartTimer() {
    if (timer) clearInterval(timer)
    const interval = isAlarmActive() ? 10_000 : 60_000
    timer = setInterval(fetchAll, interval)
  }

  // Startet wenn Fahrzeuge geladen sind (watchEffect statt onMounted)
  const stopWatch = watchEffect(() => {
    if (getVehicles().length > 0) {
      stopWatch()
      fetchAll()
      restartTimer()
    }
  })

  // Intervall anpassen wenn Alarmstatus sich ändert
  watch(isAlarmActive, () => {
    fetchAll()      // sofort aktualisieren beim Übergang
    restartTimer()  // dann mit neuem Intervall weiter
  })

  onUnmounted(() => {
    stopWatch()
    if (timer) clearInterval(timer)
  })

  return { statuses }
}