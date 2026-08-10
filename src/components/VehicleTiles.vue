<script setup lang="ts">
import { computed } from 'vue'
import type { Vehicle } from '../vehicles'

const props = defineProps<{
  /** Alle Fahrzeuge zur Anzeige */
  allVehicles: Vehicle[]
  /** Nur die für diesen Einsatz aktiven */
  vehicles: Vehicle[]
  /** Akzentfarbe der aktiven Kacheln */
  headerColor: string
}>()

const activeIds = computed(() => new Set(props.vehicles.map(v => v.id)))

const gridCols = computed(() => {
  const n = props.allVehicles.length || 1
  return Math.min(n, Math.ceil(Math.sqrt(n * (16 / 9))))
})
const gridRows = computed(() => Math.ceil(props.allVehicles.length / gridCols.value))

const tileFontSize = computed(() =>
  `clamp(2rem, ${(22 / gridCols.value).toFixed(1)}vw, 6rem)`
)
const tileGlow = computed(() => `${props.headerColor}55`)
</script>

<template>
  <main class="vehicles-section">
    <div
      v-for="v in allVehicles"
      :key="v.id"
      class="vehicle-tile"
      :class="{ active: activeIds.has(v.id) }"
    >
      <span class="tile-name">{{ v.shortName }}</span>
      <span class="tile-ric">{{ v.ric }}</span>
    </div>
  </main>
</template>

<style scoped>
.vehicles-section {
  display: grid;
  grid-template-columns: repeat(v-bind(gridCols), 1fr);
  grid-template-rows: repeat(v-bind(gridRows), 1fr);
  gap: clamp(0.4rem, 0.8vw, 0.8rem);
  padding: clamp(0.6rem, 1.2vh, 1.2rem) clamp(0.8rem, 1.5vw, 1.5rem);
  overflow: hidden;
}

.vehicle-tile {
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 0.5rem;
  border: 2px solid #2a2a2a;
  background: #141414;
  text-align: center;
  opacity: 0.3;
  filter: grayscale(60%);
  transition: opacity 0.3s, box-shadow 0.3s, border-color 0.3s;
}

.vehicle-tile.active {
  border-color: v-bind(headerColor);
  background: #1c1c1c;
  opacity: 1;
  filter: none;
  box-shadow: 0 0 24px v-bind(tileGlow), inset 0 0 0 1px v-bind(tileGlow);
}

.tile-name {
  font-size: v-bind(tileFontSize);
  font-weight: 900;
  letter-spacing: 0.03em;
  color: #444;
  line-height: 1;
}

.vehicle-tile.active .tile-name {
  color: #ffffff;
}

.tile-ric {
  font-size: clamp(1rem, 1.8vw, 1.6rem);
  font-weight: 600;
  padding: 0.15em 0.55em;
  border-radius: 0.3rem;
  background: #1e1e1e;
  color: #444;
  font-variant-numeric: tabular-nums;
}

.vehicle-tile.active .tile-ric {
  background: #2a2a2a;
  color: #bbb;
}
</style>