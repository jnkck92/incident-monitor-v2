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

function bestCols(n: number): number {
  if (n <= 0) return 1
  const divisors: number[] = []
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) divisors.push(i)
  }
  const sqrtN = Math.sqrt(n)
  return divisors.filter(d => d >= sqrtN)[0] ?? n
}

const vehicleCols = computed(() => bestCols(vehicles.value.length))
</script>

<template>
  <div class="wrapper">
    <StandbyHeader :departmentName="departmentName" :connectionOk="connectionOk"/>

    <div class="persons-bar">
      <div
        v-for="v in persons"
        :key="v.id"
        class="person-badge"
        :style="vehicleStatuses[v.id] !== undefined
          ? { borderColor: statusColors[vehicleStatuses[v.id]!], background: statusColors[vehicleStatuses[v.id]!] + '30' }
          : {}"
      >
        <span class="person-name">{{ v.shortName }}</span>
        <span
          v-if="vehicleStatuses[v.id] !== undefined"
          class="person-status"
          :style="{ color: statusColors[vehicleStatuses[v.id]!] }"
        >
          {{ statusShort[vehicleStatuses[v.id]!] }}
        </span>
      </div>
    </div>

    <div
      class="card-container"
      :style="{ gridTemplateColumns: `repeat(${vehicleCols}, 1fr)` }"
    >
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
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.persons-bar {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(0.3rem, 0.5vw, 0.6rem);
  padding: clamp(0.4rem, 0.8vw, 0.8rem) clamp(0.5rem, 1vw, 1rem);
  border-bottom: 1px solid var(--border-tile);
  /* kein eigenes background – fällt durch auf den globalen Hintergrund */
}

.person-badge {
  display: flex;
  align-items: center;
  gap: 0.6em;
  padding: 0.3em 0.8em;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-faint);
  border-left-width: 3px;                  /* Status-Balken wie bei Cards */
  background-color: var(--bg-tile);
  background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 18px 18px;             /* gleiche Dot-Textur */
  flex: 1;
  min-width: max-content;
}

.person-name {
  font-size: clamp(1rem, 2.2vw, 2rem);
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-bright);
  white-space: nowrap;
}

.person-status {
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: clamp(0.7rem, 1.4vw, 1.3rem);
  font-weight: 700;
  letter-spacing: 0.1em;
  white-space: nowrap;
  opacity: 0.85;
  margin-left: auto;    /* ← nach rechts schieben */
}

.card-container {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(0.4rem, 0.8vh, 1rem);
  padding: clamp(0.5rem, 1vw, 1rem);
}
</style>