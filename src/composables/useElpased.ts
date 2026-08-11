import { ref, onMounted, onUnmounted } from 'vue'

export function useElapsed(alarmDate: () => number | null) {
  const elapsed = ref('')

  function update() {
    const date = alarmDate()
    if (!date) { elapsed.value = ''; return }
    const d = Math.floor(Date.now() / 1000 - date)
    const h = Math.floor(d / 3600)
    const m = Math.floor((d % 3600) / 60)
    const s = d % 60
    elapsed.value = h > 0
      ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  let timer: ReturnType<typeof setInterval>
  onMounted(() => { update(); timer = setInterval(update, 1000) })
  onUnmounted(() => clearInterval(timer))

  return { elapsed }
}