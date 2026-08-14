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

  <!--
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
  -->
</template>

<style scoped>

.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding: 1rem;
  gap: 1rem;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}



.standby-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1.5vh, 2rem);
  padding: clamp(0.5rem, 1.5vw, 2rem);
  overflow: hidden;
}

.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(6rem, 14vw, 16rem), 1fr));
  gap: clamp(0.5rem, 1vw, 1rem);
  width: 100%;
}

.grids-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(1rem, 2.5vh, 3rem);
  width: 100%;
  min-height: 0;
}

.grid-section {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.grid-section + .grid-section {
  margin-top: clamp(1.5rem, 3vh, 4rem);
  padding-top: clamp(1rem, 2.5vh, 3rem);
  border-top: 2px solid rgba(255,255,255,0.06);
}

</style>