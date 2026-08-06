<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { config } from './config'
import { vehicleConfig, findRule, resolveVehicles, type Vehicle } from './vehicles'
import { fetchLastAlarm, type AlarmResult } from './api/divera'
import StandbyView from './components/StandbyView.vue'
import AlarmView from './components/AlarmView.vue'

// ----------------------------------------------------------------
// Reaktiver Zustand
// ----------------------------------------------------------------
const alarm = ref<AlarmResult | null>(null)
const lastQueryTime = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

// ----------------------------------------------------------------
// Stichwort → Fahrzeuge
// Exakter Match gegen rules; Fallback auf defaultOrder
// ----------------------------------------------------------------
const resolvedVehicles = computed<Vehicle[]>(() => {
  const title = alarm.value?.title ?? ''
  const rule = findRule(title)
  const ids = rule ? rule.vehicleOrder : vehicleConfig.defaultOrder
  return resolveVehicles(ids)
})

const matchedRule = computed(() => findRule(alarm.value?.title ?? ''))

const isAlarmActive = computed<boolean>(
  () => !!alarm.value && alarm.value.closed === false,
)

// ----------------------------------------------------------------
// Polling
// ----------------------------------------------------------------
async function poll() {
  try {
    alarm.value = await fetchLastAlarm()
    errorMessage.value = null
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Unbekannter Fehler'
  } finally {
    lastQueryTime.value = new Date().toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }
}

let pollTimer: ReturnType<typeof setInterval>

onMounted(() => {
  poll()
  pollTimer = setInterval(poll, config.pollIntervalSeconds * 1000)
})

onUnmounted(() => clearInterval(pollTimer))
</script>

<template>
  <AlarmView
    v-if="isAlarmActive"
    :keyword="alarm!.title ?? '–'"
    :rule-label="matchedRule?.label ?? null"
    :address="alarm!.address ?? null"
    :vehicles="resolvedVehicles"
    :alarm-date="alarm!.date ?? null"
    :command-contact="vehicleConfig.commandContact"
    :last-query-time="lastQueryTime"
  />
  <StandbyView
    v-else
    :department-name="config.departmentName"
    :last-query-time="lastQueryTime"
    :error-message="errorMessage"
  />
</template>

<style scoped>
/* keine scoped styles nötig – Layout liegt in den Views */
</style>

