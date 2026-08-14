<script setup lang="ts">
import { computed } from 'vue'

import type { Vehicle } from '../vehicles'

import Header from '../components/AlarmHeader.vue'
import Card from '../components/Card.vue'

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

const persons  = computed(() => props.allVehicles.filter(v => v.group === 'person'))
const vehiclesGroup = computed(() => props.allVehicles.filter(v => v.group !== 'person'))

const activeIds = computed(() => new Set(props.vehicles.map(v => v.id)))

</script>

<template>

  <div class="wrapper">
     <Header
      :keyword="keyword"
      :rule-label="ruleLabel"
      :address="address"
      :alarm-date="alarmDate"
      :header-color="headerColor"
    />
    <div class="card-wrapper">
      <div class="card-container">
        <Card 
          v-for="v in persons" 
          :key="v.id" 
          :vehicle="v"
          :isOwn="v.id === ownVehicleId"
          :status="vehicleStatuses[v.id]"
          :statusColor="vehicleStatuses[v.id] !== undefined ? statusColors[vehicleStatuses[v.id]!] : undefined"
          :statusShort="vehicleStatuses[v.id] !== undefined ? statusShort[vehicleStatuses[v.id]!] : undefined"
        />
      </div>
      <div class="card-container">
        <Card 
          v-for="v in vehiclesGroup"
          :key="v.id" 
          :vehicle="v"
          :isOwn="v.id === ownVehicleId"
          :isActive="activeIds.has(v.id)"
          :status="vehicleStatuses[v.id]"
          :statusColor="vehicleStatuses[v.id] !== undefined ? statusColors[vehicleStatuses[v.id]!] : undefined"
          :statusShort="vehicleStatuses[v.id] !== undefined ? statusShort[vehicleStatuses[v.id]!] : undefined"
        />
      </div>
    </div>
  </div>

</template>

<style scoped>

.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.card-wrapper {
  display: grid;
  padding: 1rem;
  gap: 1rem;
  flex: 1;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

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
  color: var(--text-bright);
  letter-spacing: 0.03em;
  text-align: center;
}

.alarm-footer-contact {
  font-weight: 700;
  color: var(--text-bright);
}

</style>