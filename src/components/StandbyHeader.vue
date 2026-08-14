<script setup lang="ts">

import ConnectionIndicator from './ConnectionIndicator.vue'

import { useClock } from '../composables/useClock'

const props = defineProps<{
  departmentName: string
  connectionOk: boolean
}>()

const { time, date } = useClock()

</script>

<template>
  <div class="standby-header">
    <div class="dept-name">
      <ConnectionIndicator :connectionOk="connectionOk" />
      {{ departmentName }}
    </div>
    <div class="header-right">
      <div class="clock">{{ time }}</div>
      <div class="clock-date">{{ date }}</div>
    </div>
  </div>
</template>

<style scoped>

.standby-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2.5rem;
  border-bottom: 1px solid var(--border-tile);
  background: var(--bg-header);
  flex-shrink: 0;
}

.dept-name {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: clamp(1.2rem, 3vw, 4rem);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-bright);
}

.header-right {
  text-align: right;
}

.clock {
  font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-bright);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.clock-date {
  font-size: clamp(0.8rem, 1.6vw, 1.6rem);
  color: var(--text-bright);
  margin-top: 0.25rem;
  letter-spacing: 0.08em;
}

</style>