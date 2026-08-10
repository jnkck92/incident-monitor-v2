<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { Vehicle } from '../vehicles'

import Header from './Header.vue'
import VehicleTiles from './VehicleTiles.vue'

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
}>()

const elapsed = ref('')

function updateElapsed() {
  if (!props.alarmDate) { elapsed.value = ''; return }
  const diffSec = Math.floor(Date.now() / 1000 - props.alarmDate)
  const h = Math.floor(diffSec / 3600)
  const m = Math.floor((diffSec % 3600) / 60)
  const s = diffSec % 60
  elapsed.value = h > 0
    ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

let timer: ReturnType<typeof setInterval>
onMounted(() => { updateElapsed(); timer = setInterval(updateElapsed, 1000) })
onUnmounted(() => clearInterval(timer))
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
    />

  </div>
</template>

<style scoped>
/* ── Layout ── */
.alarm {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  background: #0d0d0d;
  animation: alarm-in 0.4s ease-out;
}

/* ── Header ── */
.alarm-header {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 0;
}

.header-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem 2rem 1rem 2.5rem;
  gap: 0.2rem;
}

.header-badge {
  font-size: clamp(0.75rem, 1.2vw, 1rem);
  font-weight: 800;
  letter-spacing: 0.2em;
  color: #ffffff;
  text-transform: uppercase;
}

.header-keyword {
  font-size: clamp(2.8rem, 7vw, 6rem);
  font-weight: 900;
  letter-spacing: 0.05em;
  color: #ffffff;
  line-height: 1;
}

.header-address {
  font-size: clamp(0.8rem, 2.5vw, 2rem);
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.02em;
  margin-top: 0.5rem;
}

.header-divider {
  width: 100%;
  height: 1px;
  background: #ffffff33;
  margin: 0.3rem 0;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 0.4rem;
  padding: 1rem 2.5rem 1rem 2rem;
  background: #00000033;
  border-left: 1px solid #ffffff22;
  flex-shrink: 0;
}

.meta-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
}

.meta-label {
  font-size: clamp(0.6rem, 1vw, 0.8rem);
  font-weight: 400;
  letter-spacing: 0.15em;
  color: #ffcccc;
  text-transform: uppercase;
}

.meta-divider {
  width: 100%;
  height: 1px;
  background: #ffffff22;
  margin: 0.2rem 0;
}

.meta-value {
  font-size: clamp(1rem, 2vw, 1.6rem);
  font-weight: 700;
  color: #ffffff;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.elapsed {
  color: #ffe066;
}

</style>