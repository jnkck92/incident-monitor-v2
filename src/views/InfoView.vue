<script setup lang="ts">
import StandbyHeader from '../components/StandbyHeader.vue'
import { useInfoPanel } from '../composables/useInfoPanel'
import type { DiveraEvent, DiveraNews } from '../api/divera'

defineProps<{
  departmentName: string
  connectionOk: boolean
}>()

const { events, news } = useInfoPanel(300)

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('de-DE', {
    weekday: 'short', day: '2-digit', month: '2-digit'
  })
}

function formatTime(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString('de-DE', {
    hour: '2-digit', minute: '2-digit'
  })
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() / 1000) - ts)
  if (diff < 3600)  return `vor ${Math.floor(diff / 60)} Min.`
  if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std.`
  return `vor ${Math.floor(diff / 86400)} Tagen`
}
</script>

<template>
  <div class="wrapper">
    <StandbyHeader :departmentName="departmentName" :connectionOk="connectionOk" />

    <div class="content">

      <section class="panel">
        <div class="panel-label">TERMINE</div>
        <div class="panel-body">
          <div v-if="events.length === 0" class="empty">Keine anstehenden Termine</div>
          <div v-for="e in events" :key="e.id" class="event-row">
            <div class="event-date">
              <span class="event-day">{{ formatDate(e.ts_start ?? e.date) }}</span>
              <span class="event-time">{{ formatTime(e.ts_start ?? e.date) }}</span>
            </div>
            <div class="event-info">
              <span class="event-title">{{ e.title }}</span>
              <span class="event-address" v-if="e.address">{{ e.address }}</span>
            </div>
          </div>
        </div>
      </section>

      <div class="divider" />

      <section class="panel">
        <div class="panel-label">MITTEILUNGEN</div>
        <div class="panel-body">
          <div v-if="news.length === 0" class="empty">Keine Mitteilungen</div>
          <div v-for="n in news" :key="n.id" class="news-row">
            <div class="news-meta">{{ timeAgo(n.ts_create ?? n.date) }}</div>
            <div class="news-title">{{ n.title }}</div>
            <div class="news-text" v-if="n.text">{{ n.text }}</div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: row;
  gap: 0;
  overflow: hidden;
  background-color: var(--bg-surface);
}

.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.panel-label {
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: clamp(0.7rem, 1.2vw, 1.1rem);
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--text-subtle);
  padding: clamp(0.5rem, 1vw, 1rem) clamp(0.8rem, 1.5vw, 1.5rem);
  border-bottom: 1px solid var(--border-tile);
  background-color: var(--bg-surface);
  background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 18px 18px;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: clamp(0.5rem, 1vw, 1rem);
  display: flex;
  flex-direction: column;
  gap: clamp(0.3rem, 0.8vh, 0.8rem);
}

.divider {
  width: 1px;
  background: var(--border-tile);
  flex-shrink: 0;
}

/* Events */
.event-row {
  display: flex;
  gap: 1em;
  align-items: flex-start;
  padding: 0.5em 0.8em;
  border: 1px solid var(--border-faint);
  border-left: 3px solid var(--text-dim);
  border-radius: var(--border-radius);
  background-color: var(--bg-tile);
  background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 18px 18px;
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
  min-width: 5em;
}

.event-day {
  font-family: 'Courier New', monospace;
  font-size: clamp(0.8rem, 1.5vh, 1.4rem);
  font-weight: 700;
  color: var(--text-bright);
  white-space: nowrap;
}

.event-time {
  font-family: 'Courier New', monospace;
  font-size: clamp(0.6rem, 1.2vh, 1rem);
  color: var(--text-secondary);
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  min-width: 0;
}

.event-title {
  font-size: clamp(0.9rem, 1.8vh, 1.6rem);
  font-weight: 700;
  color: var(--text-bright);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-address {
  font-family: 'Courier New', monospace;
  font-size: clamp(0.6rem, 1.1vh, 1rem);
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* News */
.news-row {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  padding: 0.5em 0.8em;
  border: 1px solid var(--border-faint);
  border-left: 3px solid var(--text-dim);
  border-radius: var(--border-radius);
  background-color: var(--bg-tile);
  background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 18px 18px;
}

.news-meta {
  font-family: 'Courier New', monospace;
  font-size: clamp(0.55rem, 1vh, 0.85rem);
  color: var(--text-subtle);
  letter-spacing: 0.05em;
}

.news-title {
  font-size: clamp(0.9rem, 1.8vh, 1.6rem);
  font-weight: 700;
  color: var(--text-bright);
}

.news-text {
  font-size: clamp(0.7rem, 1.3vh, 1.1rem);
  color: var(--text-secondary);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.empty {
  font-family: 'Courier New', monospace;
  color: var(--text-dim);
  font-size: clamp(0.8rem, 1.5vh, 1.2rem);
  padding: 1rem;
}
</style>