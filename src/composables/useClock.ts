import { ref, onMounted, onUnmounted } from 'vue'

export function useClock() {
  const time = ref('')
  const date = ref('')

  function update() {
    const now = new Date()
    time.value = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    date.value = now.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  let timer: ReturnType<typeof setInterval>
  onMounted(() => { update(); timer = setInterval(update, 1000) })
  onUnmounted(() => clearInterval(timer))

  return { time, date }
}