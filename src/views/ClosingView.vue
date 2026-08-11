<script setup lang="ts">
import type { AlarmResult } from '../api/divera'
defineProps<{ alarm: AlarmResult; headerColor: string }>()
</script>

<template>
  <div class="closing">
    <div class="closing-label">EINSATZ BEENDET</div>
    <div class="closing-title">{{ alarm.title }}</div>
  </div>
</template>

<style scoped>
.closing {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100vh; gap: 1.5rem;
  background: var(--bg-base); animation: fade-in 0.5s ease;
}
.closing-label {
  font-size: clamp(1rem, 2.5vw, 1.8rem); font-weight: 800;
  letter-spacing: 0.2em; color: var(--color-ok);
}
.closing-title {
  font-size: clamp(2rem, 5vw, 4rem); font-weight: 900; color: var(--text-muted);
}
@keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
</style>