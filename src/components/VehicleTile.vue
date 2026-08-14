<script setup lang="ts">
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
  <div class="v-tile" :class="{ own: isOwn, inactive: !isActive }" :style="status !== undefined ? { borderColor: statusColor } : {}">
    <span v-if="isOwn" class="v-own-badge">★</span>
    <span class="v-name">{{ vehicle.shortName }}</span>
    <span class="v-ric">{{ vehicle.ric }}</span>
    <span v-if="status !== undefined" class="v-status" :style="{ color: statusColor }">
      {{ statusShort }}
    </span>
  </div>
</template>

<style scoped>

.v-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: clamp(0.4rem, 1.5vh, 1.2rem) clamp(0.6rem, 1.5vw, 1.8rem);
  border-radius: 0.5rem;
  border: 2px solid var(--border-faint);
  background: var(--bg-header);
  min-width: clamp(8rem, 16vw, 15rem);
}

.v-tile.own {
  opacity: 0.75;
  border-color: var(--border-own);
}

.v-own-badge {
  position: absolute;
  top: 0.3em;
  right: 0.35em;
  font-size: clamp(0.55rem, 1vw, 0.8rem);
  color: var(--text-bright);
}

.v-name {
  font-size: clamp(2.2rem, 5vw, 4.5rem);
  font-weight: 900;
  color: var(--text-bright);
}

.v-tile.own .v-name {
  color: var(--text-bright);
}

.v-ric {
  font-size: clamp(0.9rem, 1.8vw, 1.4rem);
  color: var(--text-bright);
  font-variant-numeric: tabular-nums;
}

.v-status {
  margin-top: 0.3rem;
  font-size: clamp(0.8rem, 1.4vw, 1.1rem);
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.2em 0.6em; 
  border-radius: 0.25rem;
  background: var(--bg-badge);
  line-height: 1;
}

.v-tile.inactive {
  opacity: 0.2;
  filter: grayscale(60%);
}

</style>