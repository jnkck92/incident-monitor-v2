<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  departmentName: string
  lastQueryTime: string | null
  errorMessage: string | null
}>()

const time = ref('')
const date = ref('')

let clockTimer: ReturnType<typeof setInterval>

function updateClock() {
  const now = new Date()
  time.value = now.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  date.value = now.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
})

onUnmounted(() => clearInterval(clockTimer))
</script>

<template>
  <div class="standby">
    <div class="dept-name">{{ departmentName }}</div>

    <div class="clock-block">
      <div class="clock">{{ time }}</div>
      <div class="clock-date">{{ date }}</div>
    </div>

    <div class="no-incident">
      <span class="dot" />
      KEIN EINSATZ
    </div>

    <div class="footer">
      <span v-if="errorMessage" class="error-msg">⚠ {{ errorMessage }}</span>
      <span v-else-if="lastQueryTime">Letzte Abfrage: {{ lastQueryTime }}</span>
      <span v-else>Warte auf erste Abfrage …</span>
    </div>
  </div>
</template>

<style scoped>
.standby {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 2rem;
  padding: 2rem;
}

.dept-name {
  font-size: clamp(1.2rem, 2.5vw, 2rem);
  font-weight: 300;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #a0a0a0;
}

.clock-block {
  text-align: center;
  line-height: 1;
}

.clock {
  font-size: clamp(5rem, 18vw, 14rem);
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #ffffff;
  font-variant-numeric: tabular-nums;
}

.clock-date {
  font-size: clamp(1rem, 2vw, 1.6rem);
  color: #707070;
  margin-top: 0.5rem;
  letter-spacing: 0.08em;
}

.no-incident {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: clamp(1.4rem, 3.5vw, 2.8rem);
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #22c55e;
}

.footer {
  position: fixed;
  bottom: 1.5rem;
  font-size: clamp(0.75rem, 1.2vw, 1rem);
  color: #484848;
  letter-spacing: 0.05em;
}

.error-msg {
  color: #f87171;
}
</style>
