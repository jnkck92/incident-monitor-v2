<script setup lang="ts">

import { useClock } from '../composables/useClock'

const props = defineProps<{
  departmentName: string
  connectionOk: boolean
}>()

const { time, date } = useClock()

</script>

<template>
  <div class="header-wrapper">
    <div class="name">{{ departmentName }}</div>
    <div class="clock-wrapper">
      <div class="clock">{{ time }}</div>
      <div class="clock-date">{{ date }}</div>
    </div>
  </div>
</template>

<style scoped>

.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 3rem;
  border-bottom: 1px solid var(--border-tile);
  background: var(--bg-own-inactive);
}

.name {
  font-size: 4rem;
  text-transform: uppercase;
  color: var(--text-bright);
}

.clock-wrapper {
  text-align: right;
}

.clock {
  font-size: 4rem;
  color: var(--text-bright);
}

.clock-date {
  font-size: 2rem;
  color: var(--text-bright);
}

</style>