<script setup lang="ts">

import { computed } from 'vue'

import StandbyHeader from '../components/StandbyHeader.vue'
import Card from '../components/Card.vue'

import type { Vehicle } from '../vehicles'
import type { AlarmLogEntry } from '../api/divera'

const props = defineProps<{
  departmentName: string
  lastQueryTime: string | null
  errorMessage: string | null
  vehicles: Vehicle[]
  ownVehicleId: string
  lastAlarm: AlarmLogEntry | null
  connectionOk: boolean
  vehicleStatuses: Record<string, number>
  statusColors: Record<number, string>
  statusShort: Record<number, string>
}>()

const persons  = computed(() => props.vehicles.filter(v => v.group === 'person'))
const vehicles = computed(() => props.vehicles.filter(v => v.group === 'vehicle' || !v.group))

</script>

<template>
  <div class="wrapper">
    <StandbyHeader :departmentName="departmentName" :connectionOk="connectionOk"/>
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
          v-for="v in vehicles"
          :key="v.id" 
          :vehicle="v"
          :isOwn="v.id === ownVehicleId"
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

</style>