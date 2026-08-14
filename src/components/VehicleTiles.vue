<script setup lang="ts">

import { computed } from 'vue'

import VehicleTile from './VehicleTile.vue'

import type { Vehicle } from '../vehicles'

const props = defineProps<{
  allVehicles: Vehicle[]
  vehicles: Vehicle[]
  headerColor: string
  ownVehicleId: string
  vehicleStatuses: Record<string, number>
  statusColors: Record<number, string>
  statusShort: Record<number, string>
}>()

const persons  = computed(() => props.allVehicles.filter(v => v.group === 'person'))
const vehiclesGroup = computed(() => props.allVehicles.filter(v => v.group !== 'person'))


const activeIds = computed(() => new Set(props.vehicles.map(v => v.id)))

const gridCols = computed(() => {
  const n = vehiclesGroup.value.length || 1
  return Math.min(n, Math.ceil(Math.sqrt(n * (16 / 9))))
})
const gridRows = computed(() => Math.ceil(props.allVehicles.length / gridCols.value))

const tileFontSize = computed(() => {
  const vwVal = (32 / gridCols.value).toFixed(1)
  const vhVal = (18 / gridRows.value).toFixed(1)
  return `clamp(1rem, min(${vwVal}vw, ${vhVal}vh), 8rem)`
})
const tileGlow = computed(() => `${props.headerColor}55`)
</script>

<template>
  <div class="vehicles-wrapper">

    <div v-if="persons.length" class="persons-row">
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

    <main class="vehicles-section">
      <VehicleTile 
        v-for="v in vehiclesGroup" 
        :key="v.id" 
        :vehicle="v"
        :isOwn="v.id === ownVehicleId"
        :isActive="activeIds.has(v.id)"
        :status="vehicleStatuses[v.id]"
        :statusColor="vehicleStatuses[v.id] !== undefined ? statusColors[vehicleStatuses[v.id]!] : undefined"
        :statusShort="vehicleStatuses[v.id] !== undefined ? statusShort[vehicleStatuses[v.id]!] : undefined"
      />
    </main>
  </div>
</template>

<style scoped>
.vehicles-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  gap: 2rem;
}

.vehicles-section {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(v-bind(gridCols), 1fr);
  grid-template-rows: repeat(v-bind(gridRows), 1fr);
  gap: clamp(0.4rem, 0.8vw, 0.8rem);
  padding: clamp(0.6rem, 1.2vh, 1.2rem) clamp(0.8rem, 1.5vw, 1.5rem);
  overflow: hidden;
}

.vehicle-tile {
  position: relative;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 0.5rem;
  border: 2px solid var(--border-tile);
  background: var(--bg-tile);
  text-align: center;
  opacity: 0.3;
  filter: grayscale(60%);
  transition: opacity 0.3s, box-shadow 0.3s, border-color 0.3s;
}

.vehicle-tile.active {
  border-color: v-bind(headerColor);
  background: var(--bg-tile-active);
  opacity: 1;
  filter: none;
  box-shadow: 0 0 24px v-bind(tileGlow), inset 0 0 0 1px v-bind(tileGlow);
}

.tile-position {
  position: absolute;
  top: 0.4em;
  left: 0.4em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: clamp(1.4rem, 2.8vw, 2.2rem);
  height: clamp(1.4rem, 2.8vw, 2.2rem);
  padding: 0 0.3em;
  border-radius: 0.35rem;
  background: v-bind(headerColor);
  color: var(--text-bright);
  font-size: clamp(0.8rem, 1.6vw, 1.3rem);
  font-weight: 900;
  line-height: 1;
}

.tile-name {
  font-size: v-bind(tileFontSize);
  font-weight: 900;
  letter-spacing: 0.03em;
  color: var(--text-dim);
  line-height: 1;
}

.vehicle-tile.active .tile-name {
  color: var(--text-bright);
}

.tile-ric {
  font-size: clamp(1.3rem, 2.3vw, 2.1rem);
  font-weight: 600;
  padding: 0.15em 0.55em;
  border-radius: 0.3rem;
  background: var(--bg-badge);
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
}

.vehicle-tile.active .tile-ric {
  background: var(--border-tile);
  color: var(--text-secondary);
}

.tile-own {
  position: absolute;
  top: 0.4em;
  right: 0.4em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: clamp(1.4rem, 2.8vw, 2.2rem);
  height: clamp(1.4rem, 2.8vw, 2.2rem);
  padding: 0 0.3em;
  border-radius: 0.35rem;
  background: var(--bg-own-inactive);
  color: var(--text-own-inactive);
  font-size: clamp(0.8rem, 1.6vw, 1.3rem);
  font-weight: 900;
  line-height: 1;
}

.vehicle-tile.active .tile-own {
  background: v-bind(headerColor);
  color: var(--text-bright);
}

.vehicle-tile.own .tile-name {
  color: var(--text-subtle);
}
.vehicle-tile.own.active .tile-name {
  color: v-bind(headerColor);
}

.tile-status-label {
  font-size: clamp(0.75rem, 1.3vw, 1.1rem);
  font-weight: 700;
  padding: 0.15em 0.55em;
  border-radius: 0.3rem;
  background: var(--bg-badge);
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
}

.persons-row {
  display: flex;
  gap: clamp(0.4rem, 0.8vw, 0.8rem);
  padding: clamp(0.4rem, 0.8vh, 0.8rem) clamp(0.8rem, 1.5vw, 1.5rem) 0;
  flex-shrink: 0;
}

.person-tile {
  flex: 0 0 auto;
  min-width: clamp(6rem, 10vw, 10rem);
  /* etwas kleiner als Fahrzeug-Tiles */
}

</style>