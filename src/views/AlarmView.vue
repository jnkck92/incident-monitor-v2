<script setup lang="ts">
import type { Vehicle } from '../vehicles'

import Header from '../components/AlarmHeader.vue'
import VehicleTiles from '../components/VehicleTiles.vue'

const props = defineProps<{
  keyword: string
  ruleLabel: string | null
  address: string | null
  vehicles: Vehicle[]
  allVehicles: Vehicle[]
  lastQueryTime: string | null
  alarmDate: number | null
  commandContact: string
  headerColor: string
  ownVehicleId: string
  vehicleStatuses: Record<string, number>
  statusColors: Record<number, string>
  statusShort: Record<number, string>
}>()

</script>

<template>
  <div class="alarm">

    <Header
      :keyword="keyword"
      :rule-label="ruleLabel"
      :address="address"
      :alarm-date="alarmDate"
      :header-color="headerColor"
    />

    <VehicleTiles
      :all-vehicles="allVehicles"
      :vehicles="vehicles"
      :header-color="headerColor"
      :own-vehicle-id="ownVehicleId"
      :vehicle-statuses="vehicleStatuses"
      :status-colors="statusColors"
      :status-short="statusShort"
    />

    <footer class="alarm-footer">
      Falls Ihr Fahrzeug nicht alarmiert ist — vor dem Ausrücken bei
      <span class="alarm-footer-contact">{{ commandContact }}</span> nachfragen.
    </footer>

  </div>
</template>

<style scoped>

.alarm {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  background: var(--bg-base);
  animation: alarm-in 0.4s ease-out;
}

.alarm-footer {
  padding: 0.5rem clamp(0.8rem, 1.5vw, 1.5rem);
  border-top: 1px solid var(--border-faint);
  background: var(--bg-surface);
  font-size: clamp(0.65rem, 2vw, 2.5rem);
  color: var(--text-faint);
  letter-spacing: 0.03em;
  text-align: center;
}

.alarm-footer-contact {
  font-weight: 700;
  color: var(--text-subtle);
}

</style>