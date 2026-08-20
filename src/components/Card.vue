<script setup lang="ts">
import type { Vehicle } from '../vehicles'

withDefaults(defineProps<{
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
  <div
    class="card"
    :class="{ inactive: !isActive }"
    :style="status !== undefined
  ? { borderLeftColor: statusColor, borderLeftWidth: '4px' }
  : { borderLeftColor: 'transparent', borderLeftWidth: '4px' }"
  >
    <div class="info">
      <span class="name">{{ vehicle.shortName }}</span>
      <span class="ric">{{ vehicle.ric }}</span>
    </div>
    <span v-if="status !== undefined" class="status" :style="{ color: statusColor }">
      {{ statusShort }}
    </span>
  </div>
</template>

<style scoped>
.card {
  /* container-type weg – cqw ist für Row-Layout ungeeignet */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  min-height: 0;           /* verhindert, dass Inhalt die Höhe aufdrückt */
  padding: clamp(0.4rem, 1.5vh, 1rem) clamp(0.8rem, 2vw, 2rem);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-faint);
  border-left-width: 4px;
  overflow: hidden;
  background-color: var(--bg-tile);
  background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 18px 18px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 0.15em;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.name {
  font-size: clamp(1rem, 4vh, 5rem);   /* vh statt cqw */
  font-weight: 700;
  color: var(--text-bright);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ric {
  font-family: 'Courier New', 'Consolas', monospace;
  letter-spacing: 0.05em;
  font-size: clamp(0.5rem, 2vh, 2.5rem);
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status {
  font-family: 'Courier New', monospace;
  font-size: clamp(0.7rem, 2.5vh, 3rem);
  font-weight: 700;
  letter-spacing: 0.1em;
  opacity: 0.85;
  flex-shrink: 0;
}

.card.inactive {
  opacity: 0.2;
  filter: grayscale(60%);
}
</style>