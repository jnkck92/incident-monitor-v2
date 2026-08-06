<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { Vehicle } from '../vehicles'

const props = defineProps<{
  keyword: string
  /** Ausgeschriebene Bezeichnung der Regel, z.B. "Hilfeleistung mittel" */
  ruleLabel: string | null
  /** Einsatzadresse aus der API */
  address: string | null
  vehicles: Vehicle[]
  lastQueryTime: string | null
  /** Unix-Timestamp (Sekunden) der Alarmierung – aus API-Feld 'date' */
  alarmDate: number | null
  /** Kontakt für den Hinweis unten, z.B. "ELW 15/11-4" */
  commandContact: string
}>()

const alarmTime = computed(() => {
  if (!props.alarmDate) return null
  return new Date(props.alarmDate * 1000).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
})

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

    <!-- ── HEADER ─────────────────────────────────────── -->
    <header class="alarm-header">
      <div class="header-left">
        <div class="header-badge" v-if="ruleLabel">{{ ruleLabel }}</div>
        <div class="header-badge" v-else>EINSATZ</div>
        <div class="header-keyword">{{ keyword }}</div>
        <div class="header-address" v-if="address">{{ address }}</div>
      </div>
      <div class="header-right" v-if="alarmTime">
        <div class="meta-item">
          <span class="meta-label">Alarmiert</span>
          <span class="meta-value">{{ alarmTime }} Uhr</span>
        </div>
        <div class="meta-divider" />
        <div class="meta-item">
          <span class="meta-label">Einsatzdauer</span>
          <span class="meta-value elapsed">{{ elapsed }}</span>
        </div>
      </div>
    </header>

    <!-- ── FAHRZEUGLISTE ──────────────────────────────── -->
    <main class="vehicles-section">
      <template v-if="vehicles.length > 0">
        <div v-for="v in vehicles" :key="v.id" class="vehicle-row">
          <span class="vehicle-bullet" />
          <span class="vehicle-name">{{ v.name }}</span>
          <span class="vehicle-ric">{{ v.ric }}</span>
        </div>
      </template>
      <div class="no-mapping" v-else>
        Keine Fahrzeugzuordnung für dieses Stichwort
      </div>
    </main>

    <!-- ── HINWEIS ────────────────────────────────────── -->
    <footer class="alarm-footer">
      <div class="not-listed">
        Fahrzeug nicht auf der Liste?
        &nbsp;→&nbsp;
        Vor dem Ausrücken beim <span class="phone">{{ commandContact }}</span> nachfragen.
      </div>
      <div class="last-query" v-if="lastQueryTime">
        Letzte Abfrage: {{ lastQueryTime }}
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* ── Layout ── */
.alarm {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  background: #0d0d0d;
}

/* ── Header ── */
.alarm-header {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  background: #b30000;
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
  letter-spacing: 0.3em;
  color: #ff9999;
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
  font-size: clamp(0.8rem, 1.4vw, 1.1rem);
  font-weight: 400;
  color: #ffbbbb;
  letter-spacing: 0.02em;
  opacity: 0.85;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 0.4rem;
  padding: 1rem 2.5rem 1rem 2rem;
  background: #99000044;
  border-left: 1px solid #ff444433;
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
  color: #ff9999;
  text-transform: uppercase;
}

.meta-value {
  font-size: clamp(1.1rem, 2.2vw, 1.8rem);
  font-weight: 700;
  color: #ffffff;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.meta-divider {
  width: 100%;
  height: 1px;
  background: #ff444433;
  margin: 0.2rem 0;
}

.meta-value {
  font-size: clamp(1rem, 2vw, 1.6rem);
  font-weight: 700;
  color: #ffffff;
  font-variant-numeric: tabular-nums;
}

.elapsed {
  color: #ffe066;
}

/* ── Fahrzeugliste ── */
.vehicles-section {
  padding: 1.5rem 2.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}

.vehicle-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1.8rem;
  border-left: 6px solid #cc0000;
  background: #1a1a1a;
  border-radius: 0.40rem;
}

.vehicle-bullet {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: #ff4444;
  flex-shrink: 0;
}

.vehicle-name {
  font-size: clamp(1.8rem, 4vw, 3.5rem);
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #ffffff;
  flex: 1;
}

.vehicle-ric {
  font-size: clamp(0.85rem, 1.5vw, 1.2rem);
  font-weight: 500;
  color: #666666;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.no-mapping {
  font-size: clamp(1rem, 2vw, 1.6rem);
  color: #666666;
  font-style: italic;
  padding: 1rem 1.5rem;
}

/* ── Footer ── */
.alarm-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2.5rem;
  background: #1a1200;
  gap: 2rem;
}

.not-listed {
  font-size: clamp(1rem, 1.8vw, 1.5rem);
  font-weight: 600;
  color: #fbbf24;
  letter-spacing: 0.02em;
}

.phone {
  color: #ffffff;
  font-weight: 800;
  letter-spacing: 0.05em;
  background: #7a5500;
  padding: 0.1em 0.5em;
  border-radius: 0.3rem;
}

.last-query {
  font-size: clamp(0.7rem, 1vw, 0.95rem);
  color: #444444;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
