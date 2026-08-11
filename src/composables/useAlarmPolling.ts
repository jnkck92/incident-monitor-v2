import { ref, onMounted, onUnmounted } from 'vue'
import { config } from '../config'
import { fetchLastAlarm, type AlarmResult } from '../api/divera'

export function useAlarmPolling(onNewAlarm: (alarm: AlarmResult) => void) {
  const alarm = ref<AlarmResult | null>(null)
  const lastQueryTime = ref<string | null>(null)
  const errorMessage = ref<string | null>(null)
  const connectionOk = ref(true)
  const closingAlarm = ref<AlarmResult | null>(null)
  let closingTimer: ReturnType<typeof setTimeout> | null = null

  async function poll() {
    try {
      const result = await fetchLastAlarm()
      connectionOk.value = true

      if (result && result.closed === false) {
        if (!alarm.value || alarm.value.id !== result.id) {
          console.log('[Alarm erkannt]', JSON.stringify(result, null, 2))
          onNewAlarm(result)
        }
      }

      if (alarm.value && alarm.value.closed === false && (!result || result.closed !== false)) {
        closingAlarm.value = alarm.value
        closingTimer && clearTimeout(closingTimer)
        closingTimer = setTimeout(() => { closingAlarm.value = null }, 10_000)
      }

      alarm.value = result
      errorMessage.value = null
    } catch (err) {
      connectionOk.value = false
      errorMessage.value = err instanceof Error ? err.message : 'Unbekannter Fehler'
    } finally {
      lastQueryTime.value = new Date().toLocaleTimeString('de-DE', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      })
    }
  }

  let pollTimer: ReturnType<typeof setInterval>

  onMounted(() => {
    poll()
    pollTimer = setInterval(poll, config.pollIntervalSeconds * 1000)
  })

  onUnmounted(() => clearInterval(pollTimer))

  return { alarm, lastQueryTime, errorMessage, connectionOk, closingAlarm }
}