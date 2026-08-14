hanges<script setup lang="ts">
import type { Vehicle } from '../vehicles'

const props = withDefaults(defineProps<{
  vehicle: Vehicle
  isOwn: boolean
  isActive?: boolean
  status?: number
  statusColor?: string
  statusShort?: string
}>(), {
  isActive: true
})
</script>

<template>
  <div class="card" :class="{ inactive: !isActive }" :style="status !== undefined ? { borderColor: statusColor, background: statusColor + '20' } : {}">
    <span class="v-name">{{ vehicle.shortName }}</span>
    <span class="v-ric">{{ vehicle.ric }}</span>
    <span v-if="status !== undefined" class="v-status" :style="{ color: statusColor }">
      {{ statusShort }}
    </span>
  </div>
</template>

<style scoped>

.card {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 0.5rem;
  border: 2px solid var(--border-faint);
}

.card.inactive {
  opacity: 0.2;
  filter: grayscale(60%);
}

/*
.v-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  border-radius: 0.5rem;
  border: 2px solid var(--border-faint);
  background: var(--bg-header);
  padding: 0.5rem 0.75rem;
}

.v-own-badge {
  position: absolute;
  top: 0.3em;
  right: 0.35em;
  font-size: 0.8rem;
  color: var(--text-bright);
}

.v-name {
  font-size: 6rem;
  font-weight: 900;
  color: var(--text-bright);
}

.v-tile.own .v-name {
  color: var(--text-bright);
}

.v-ric {
  font-size: 3rem;
  color: var(--text-bright);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.1em;
}

.v-status {
  margin-top: 0.3rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.2em 0.6em; 
  border-radius: 0.5rem;
  background: var(--bg-badge);
  line-height: 1;
}

.v-tile.inactive {
  opacity: 0.2;
  filter: grayscale(60%);
}
  */

</style>