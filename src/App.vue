<script setup lang="ts">
/*import { computed, onMounted } from 'vue'
import { config } from './config'
import { findRule, resolveVehicles, orderedVehiclesForDisplay, type Vehicle } from './vehicles'
import { useVehicleConfig } from './composables/useVehicleConfig'
import { useAlarmLog } from './composables/useAlarmLog'
import { useAlarmPolling } from './composables/useAlarmPolling'
import { useVehicleStatus } from './composables/useVehicleStatus'
import StandbyView from './views/StandbyView.vue'
import AlarmView from './views/AlarmView.vue'
import ClosingView from './views/ClosingView.vue'*/
import { useWindowSize } from './composables/useWindowSize'

const { width, height } = useWindowSize();

/*
const ownVehicleId = import.meta.env.VITE_OWN_VEHICLE_ID ?? ''

const { vehicleConfig } = useVehicleConfig()
const { lastAlarm, record } = useAlarmLog()
const { alarm, lastQueryTime, errorMessage, connectionOk, closingAlarm } = useAlarmPolling(record)

const matchedRule = computed(() =>
  vehicleConfig.value ? findRule(alarm.value?.title ?? '', vehicleConfig.value) : null
)

const resolvedVehicles = computed<Vehicle[]>(() => {
  if (!vehicleConfig.value) return []
  const ids = matchedRule.value?.vehicleOrder ?? vehicleConfig.value.defaultOrder
  return resolveVehicles(ids, vehicleConfig.value)
})

const orderedVehicles = computed<Vehicle[]>(() =>
  vehicleConfig.value ? orderedVehiclesForDisplay(matchedRule.value, vehicleConfig.value) : []
)

const isAlarmActive = computed(() => !!alarm.value && alarm.value.closed === false)
const headerColor = computed(() => matchedRule.value?.color ?? '#b30000')

const { statuses: vehicleStatuses } = useVehicleStatus(
  () => vehicleConfig.value?.vehicles ?? [],
  () => isAlarmActive.value
)

const resolvedStatusColors = computed(() => {
  const cfg = vehicleConfig.value?.statusColors
  if (!cfg) return {}
  return Object.fromEntries(Object.entries(cfg).map(([k, v]) => [Number(k), v]))
})

const resolvedStatusShort = computed(() => {
  const cfg = vehicleConfig.value?.statusShort
  if (!cfg) return {}
  return Object.fromEntries(Object.entries(cfg).map(([k, v]) => [Number(k), v]))
})

onMounted(() => {
  navigator.wakeLock?.request('screen').catch(() => {})
})
*/
</script>

<template>

  <div>
    <p>Breite: {{ width }}px</p>
    <p>Höhe: {{ height }}px</p>
  </div>

  <!--
  <Transition name="view" mode="out-in">

    <ClosingView
      v-if="closingAlarm && !isAlarmActive"
      key="closing"
      :alarm="closingAlarm"
      :header-color="headerColor"
    />

    <AlarmView
      v-else-if="isAlarmActive"
      key="alarm"
      :keyword="alarm!.title ?? '-'"
      :rule-label="matchedRule?.label ?? null"
      :header-color="headerColor"
      :address="alarm!.address ?? null"
      :vehicles="resolvedVehicles"
      :all-vehicles="orderedVehicles"
      :alarm-date="alarm!.date ?? null"
      :command-contact="vehicleConfig?.commandContact ?? ''"
      :last-query-time="lastQueryTime"
      :own-vehicle-id="ownVehicleId"
      :vehicle-statuses="vehicleStatuses"
      :status-colors="resolvedStatusColors"
      :status-short="resolvedStatusShort"
    />

    <StandbyView
      v-else
      key="standby"
      :department-name="config.departmentName"
      :last-query-time="lastQueryTime"
      :error-message="errorMessage"
      :vehicles="vehicleConfig?.vehicles ?? []"
      :own-vehicle-id="ownVehicleId"
      :last-alarm="lastAlarm"
      :connection-ok="connectionOk"
      :vehicle-statuses="vehicleStatuses"
      :status-colors="resolvedStatusColors"
      :status-short="resolvedStatusShort"
    />

  </Transition>
  -->
</template>

<style scoped>

.view-enter-active, .view-leave-active { transition: opacity 0.5s ease; }
.view-enter-from, .view-leave-to { opacity: 0; }

</style>