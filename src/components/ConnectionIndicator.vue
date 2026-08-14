<script setup lang="ts">
import { useClock } from '../composables/useClock'

const props = defineProps<{
  connectionOk: boolean
}>()

</script>

<template>
  <span class="conn-dot" :class="{ ok: connectionOk, err: !connectionOk }" />
</template>

<style scoped>

.conn-dot { 
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.conn-dot.ok {
  background: var(--color-ok);
}

.conn-dot.err {
  background: var(--color-error);
}

</style>