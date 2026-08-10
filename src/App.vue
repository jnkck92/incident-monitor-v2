<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { config } from './config'
import { findRule, resolveVehicles, type Vehicle, type VehicleConfig } from './vehicles'
import { fetchLastAlarm, type AlarmResult } from './api/divera'
import StandbyView from './components/StandbyView.vue'
import AlarmView from './components/AlarmView.vue'

// ----------------------------------------------------------------
// Reaktiver Zustand
// ----------------------------------------------------------------
const alarm = ref<AlarmResult | null>(null)
const lastQueryTime = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const vehicleConfig = ref<VehicleConfig | null>(null)

// ----------------------------------------------------------------
// vehicles.json zur Laufzeit laden
// ----------------------------------------------------------------
async function loadVehicleConfig() {
  const res = await fetch('/vehicles.json')
  if (!res.ok) throw new Error(`vehicles.json konnte nicht geladen werden (${res.status})`)
  vehicleConfig.value = await res.json() as VehicleConfig
}

// ----------------------------------------------------------------
// Stichwort → Fahrzeuge
// ----------------------------------------------------------------
const resolvedVehicles = computed<Vehicle[]>(() => {
  if (!vehicleConfig.value) return []
  const title = alarm.value?.title ?? ''
  const rule = findRule(title, vehicleConfig.value)
  const ids = rule ? rule.vehicleOrder : vehicleConfig.value.defaultOrder
  return resolveVehicles(ids, vehicleConfig.value)
})

const matchedRule = computed(() =>
  vehicleConfig.value ? findRule(alarm.value?.title ?? '', vehicleConfig.value) : null
)

const isAlarmActive = computed<boolean>(
  () => !!alarm.value && alarm.value.closed === false,
)

const headerColor = computed(() =>
  matchedRule.value?.color ?? '#b30000'  // Fallback: Rot
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

onMounted(async () => {
  await loadVehicleConfig()
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
  :header-color="headerColor"
  :address="alarm!.address ?? null"
  :vehicles="resolvedVehicles"
  :all-vehicles="vehicleConfig?.vehicles ?? []"
  :alarm-date="alarm!.date ?? null"
  :command-contact="vehicleConfig?.commandContact ?? ''"
  :last-query-time="lastQueryTime"
/>
  <StandbyView
    v-else
    :department-name="config.departmentName"
    :last-query-time="lastQueryTime"
    :error-message="errorMessage"
  />
</template>

<style scoped></style>