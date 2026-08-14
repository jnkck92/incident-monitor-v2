<script setup lang="ts">
import { computed } from 'vue'
import { useElapsed } from '../composables/useElpased'

const props = defineProps<{
  keyword: string
  ruleLabel: string | null
  address: string | null
  alarmDate: number | null
  headerColor: string
}>()

const parsedTitle = computed(() => {
  const [, code, description] = props.keyword.match(/^([A-Za-z]+\s*\d+)\s*-\s*(.+)$/) ?? []
  if (code && description) return { code: code.trim(), description: description.trim() }
  return { code: null, description: props.keyword }
})

const alarmTime = computed(() => {
  if (!props.alarmDate) return null
  return new Date(props.alarmDate * 1000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
})

const { elapsed } = useElapsed(() => props.alarmDate)

</script>

<template>
  <header class="header">
    <div class="left">
      <div class="badge">
        {{ parsedTitle.code }}
        <span v-if="ruleLabel"> · {{ ruleLabel }}</span>
        <span v-else-if="parsedTitle.code" class="no-rule-warning">Keine AAO hinterlegt</span>
      </div>
      <div class="keyword">{{ parsedTitle.description }}</div>
      <div class="address" v-if="address">{{ address }}</div>
    </div>
    <div class="right" v-if="alarmTime">
      <div class="meta"><span class="label">Alarmiert</span><span class="val">{{ alarmTime }}</span></div>
      <div class="meta"><span class="label">Einsatzdauer</span><span class="val elapsed">{{ elapsed }}</span></div>
    </div>
  </header>
</template>

<style scoped>

.header { 
  display: flex; 
  align-items: stretch; 
  background: v-bind(headerColor + '20');
  border-bottom: 1px solid var(--border-header); 
  border-top: 3px solid v-bind(headerColor);
}

.left { 
  flex: 1; 
  padding: 1rem; 
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  gap: 0.15rem; 
}

.badge { 
  font-size: clamp(0.7rem, 2.4vw, 2.6rem); 
  font-weight: 700; 
  letter-spacing: 0.15em; 
  text-transform: uppercase; 
  color: v-bind(headerColor); 
  margin-bottom: 0.2rem; 
}

.keyword { 
  font-size: clamp(2rem, 5.5vw, 5rem); 
  font-weight: 900; 
  color: var(--text-bright); 
  line-height: 1; 
}

.address { 
  font-size: clamp(0.8rem, 3vw, 3rem); 
  color: var(--text-bright); 
  margin-top: 0.2rem; 
}

.right { 
  display: flex; 
  flex-direction: column; 
  gap: 0.75rem; 
  align-items: center; 
  justify-content: center; 
  padding: 1rem 2.5rem; 
  border-left: 1px solid var(--border-tile);
}

.meta { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 0.15rem;
}

.label { 
  font-size: 0.65rem; 
  letter-spacing: 0.1em; 
  text-transform: uppercase; 
  color: var(--text-muted);
}

.val { 
  font-size: clamp(1.1rem, 2vw, 1.8rem); 
  font-weight: 700; 
  font-variant-numeric: tabular-nums; 
  color: var(--text-bright);
}

.elapsed { 
  color: var(--color-elapsed);
}

.no-rule-warning {
  color: var(--color-elapsed);
  font-weight: 800;
  letter-spacing: 0.1em;
}

</style>