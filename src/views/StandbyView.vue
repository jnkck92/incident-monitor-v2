<script setup lang="ts">
import { useClock } from '../composables/useClock'
import type { Vehicle } from '../vehicles'
import type { AlarmLogEntry } from '../api/divera'

defineProps<{
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

const { time, date } = useClock()
</script>

<template>
  <div class="standby">
    <div class="dept-name">{{ departmentName }}</div>

    <div class="clock-block">
      <div class="clock">{{ time }}</div>
      <div class="clock-date">{{ date }}</div>
    </div>

    <div v-if="vehicles.length" class="vehicle-grid">
      <div
        v-for="v in vehicles"
        :key="v.id"
        class="v-tile"
        :class="{ own: v.id === ownVehicleId }"
        :style="v.id in vehicleStatuses ? { borderColor: statusColors[vehicleStatuses[v.id]!] } : {}"
      >
        <span v-if="v.id === ownVehicleId" class="v-own-badge">★</span>
        <span class="v-name">{{ v.shortName }}</span>
        <span class="v-ric">{{ v.ric }}</span>
        <span v-if="v.id in vehicleStatuses" class="v-status" :style="{ color: statusColors[vehicleStatuses[v.id]!] }">{{ statusShort[vehicleStatuses[v.id]!] }}</span>
      </div>
    </div>

    <div v-if="lastAlarm" class="last-alarm">
      <span class="last-alarm-label">Letzter Einsatz</span>
      <span class="last-alarm-time">
        {{ new Date(lastAlarm.loggedAt).toLocaleString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }} Uhr
      </span>
      <span class="last-alarm-title">{{ lastAlarm.title }}</span>
    </div>

    <div class="footer">
      <span class="conn-dot" :class="{ ok: connectionOk, err: !connectionOk }" />
      <span v-if="errorMessage" class="error-msg">⚠ {{ errorMessage }}</span>
      <span v-else-if="lastQueryTime">Letzte Abfrage: {{ lastQueryTime }}</span>
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
  color: var(--text-subtle);
}

.clock-block {
  text-align: center;
  line-height: 1;
}

.clock {
  font-size: clamp(5rem, 18vw, 14rem);
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-bright);
  font-variant-numeric: tabular-nums;
}

.clock-date {
  font-size: clamp(1rem, 2vw, 1.6rem);
  color: var(--text-faint);
  margin-top: 0.5rem;
  letter-spacing: 0.08em;
}

/* ── Fahrzeug-Grid ── */
.vehicle-grid {
  display: flex;
  gap: clamp(0.4rem, 1vw, 0.8rem);
  flex-wrap: wrap;
  justify-content: center;
}

.v-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.8rem 1.2rem;
  border-radius: 0.5rem;
  border: 2px solid var(--border-faint);
  background: var(--bg-header);
  opacity: 0.4;
  min-width: clamp(6rem, 12vw, 11rem);
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
  font-size: clamp(1.6rem, 3.5vw, 3rem);
  font-weight: 900;
  color: var(--text-bright);
}

.v-tile.own .v-name {
  color: var(--text-bright);
}

.v-ric {
  font-size: clamp(0.75rem, 1.4vw, 1.1rem);
  color: var(--text-bright);
  font-variant-numeric: tabular-nums;
}

/* ── Letzter Einsatz ── */
.last-alarm {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: clamp(0.7rem, 1.2vw, 0.95rem);
  color: var(--text-faint);
}

.last-alarm-label {
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.85em;
}

.last-alarm-time {
  color: var(--text-muted);
}

.last-alarm-title {
  color: var(--text-faint);
  font-weight: 600;
}

.footer {
  position: fixed;
  bottom: 1.5rem;
  font-size: clamp(0.75rem, 1.2vw, 1rem);
  color: var(--text-faint);
  letter-spacing: 0.05em;
}

.error-msg {
  color: var(--color-error);
}

.conn-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 0.5rem; }
.conn-dot.ok  { background: var(--color-ok); }
.conn-dot.err { background: var(--color-error); }

.v-status {
  font-size: clamp(0.65rem, 1.1vw, 0.9rem);
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.1em 0.4em;
  border-radius: 0.25rem;
  background: var(--bg-badge);
  line-height: 1;
}

</style>