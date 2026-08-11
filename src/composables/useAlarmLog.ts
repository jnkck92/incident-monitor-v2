import { ref } from 'vue'
import type { AlarmResult, AlarmLogEntry } from '../api/divera'

export function useAlarmLog() {
  const lastAlarm = ref<AlarmLogEntry | null>(
    JSON.parse(localStorage.getItem('alarmLog') ?? '[]')[0] ?? null
  )

  function record(alarm: AlarmResult) {
    const existing = JSON.parse(localStorage.getItem('alarmLog') ?? '[]')
    existing.unshift({ ...alarm, loggedAt: new Date().toISOString() })
    localStorage.setItem('alarmLog', JSON.stringify(existing.slice(0, 200)))
    lastAlarm.value = existing[0]
  }

  return { lastAlarm, record }
}