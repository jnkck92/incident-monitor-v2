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

      <div class="grids-row">

        <div v-if="persons.length" class="grid-section">
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

        <div v-if="vehicles.length" class="grid-section">
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
  gap: 2rem;
  padding: 2rem;
}

.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
}

.grids-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  width: 100%;
}

.grid-section {
  display: flex;
  flex-direction: column;
  width: 100%;
}

</style>