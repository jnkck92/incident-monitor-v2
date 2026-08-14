<script setup lang="ts">

import { computed } from 'vue'

import StandbyHeader from '../components/StandbyHeader.vue'
import VehicleTile from '../components/VehicleTile.vue'

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
  <div class="standby">

    <StandbyHeader :departmentName="departmentName" :connectionOk="connectionOk"/>

    <div class="standby-body">

      <div v-if="persons.length">
        <div class="vehicle-grid">
          <VehicleTile 
            v-for="v in persons" 
            :key="v.id" 
            :vehicle="v"
            :isOwn="v.id === ownVehicleId"
            :status="vehicleStatuses[v.id]"
            :statusColor="vehicleStatuses[v.id] !== undefined ? statusColors[vehicleStatuses[v.id]!] : undefined"
            :statusShort="vehicleStatuses[v.id] !== undefined ? statusShort[vehicleStatuses[v.id]!] : undefined"
          />
        </div>
      </div>

      <div v-if="vehicles.length">
        <div class="vehicle-grid">
          <VehicleTile 
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
  </div>
</template>

<style scoped>

.standby {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.standby-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
}

.vehicle-grid {
  display: flex;
  gap: clamp(0.4rem, 1vw, 0.8rem);
  flex-wrap: wrap;
  justify-content: center;
}

</style>